import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting checkout process...");
    
    // Parse request body
    const { space_id, price, days, booking_id } = await req.json();

    if (!space_id || !price) {
      throw new Error("space_id and price are required");
    }
    
    console.log(`Checkout request: space_id=${space_id}, price=${price}, days=${days || 'not specified'}, booking_id=${booking_id || 'not specified'}`);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    
    console.log(`Authenticated user: ${user.id} (${user.email})`);

    // Create a service client to fetch the stripe configuration (bypasses RLS)
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceRoleKey) {
      throw new Error("Service role key not configured");
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      serviceRoleKey
    );

    // Get Stripe configuration from database
    const { data: stripeConfig, error: configError } = await supabaseAdmin
      .from('stripe_config')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    
    if (configError) {
      console.error("Error fetching Stripe config:", configError.message);
      return new Response(
        JSON.stringify({
          error: "Stripe configuration not found. Please set up Stripe in the admin panel first."
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    // Determine which key to use based on mode
    const stripeSecretKey = stripeConfig.mode === 'production' && stripeConfig.prod_key 
      ? stripeConfig.prod_key 
      : stripeConfig.test_key;

    if (!stripeSecretKey) {
      console.error("No valid Stripe key found in configuration");
      return new Response(
        JSON.stringify({
          error: "Stripe API key not properly configured. Please check the Stripe settings in the admin panel."
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    // Validate Stripe key format
    if (!stripeSecretKey.startsWith('sk_')) {
      console.error("Invalid Stripe key format in configuration");
      return new Response(
        JSON.stringify({
          error: "Invalid Stripe key format in configuration. Please check the Stripe settings in the admin panel."
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    console.log(`Checking for existing Stripe customer with email: ${user.email}`);
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log(`Found existing customer: ${customerId}`);
    } else {
      // Create a new customer
      console.log(`Creating new Stripe customer for user: ${user.id}`);
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id
        }
      });
      customerId = customer.id;
      console.log(`Created new customer: ${customerId}`);
    }

    // Get space details
    console.log(`Fetching space details for space_id: ${space_id}`);
    const { data: spaceData, error: spaceError } = await supabaseClient
      .from('spaces')
      .select('title, host_id')
      .eq('id', space_id)
      .single();

    if (spaceError) {
      console.error(`Error fetching space details: ${spaceError.message}`);
      throw spaceError;
    }
    if (!spaceData) {
      console.error(`Space not found: ${space_id}`);
      throw new Error("Space not found");
    }
    
    console.log(`Space details: title=${spaceData.title}, host_id=${spaceData.host_id}`);

    // Get origin URL for success/cancel redirects
    const origin = req.headers.get("origin") || "http://localhost:3000";
    console.log(`Using origin for redirects: ${origin}`);

    // Create a checkout session
    console.log("Creating Stripe checkout session...");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Reserva: ${spaceData.title}`,
              description: `Reserva por ${days || 1} dia(s)`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/reservas/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/spaces/${space_id}`,
      metadata: {
        space_id,
        host_id: spaceData.host_id,
        client_id: user.id,
        days: days || 1,
        booking_id: booking_id || undefined
      }
    });
    
    console.log(`Checkout session created: ${session.id}`);
    console.log(`Checkout URL: ${session.url}`);

    // If we have a booking_id, store the session ID
    if (booking_id) {
      console.log(`Updating booking ${booking_id} with session ID ${session.id}`);
      
      const { error: updateError } = await supabaseAdmin
        .from('bookings')
        .update({ 
          payment_intent: session.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', booking_id);
      
      if (updateError) {
        console.error(`Error updating booking: ${updateError.message}`);
        // Continue even if there's an error, since checkout can still work
      }
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in create-checkout function:", error);
    console.error("Error details:", error.message);
    
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
