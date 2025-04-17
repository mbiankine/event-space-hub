
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

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
    // Parse request body
    const { testApiKey, prodApiKey, mode, webhookSecret } = await req.json();

    // Log received data (without exposing full keys)
    console.log(`Stripe keys received for mode: ${mode}`);
    console.log(`Test key begins with: ${testApiKey ? testApiKey.substring(0, 7) + '...' : 'none'}`);
    
    if (!testApiKey) {
      throw new Error("Test API key is required");
    }

    if (mode === 'production' && !prodApiKey) {
      throw new Error("Production API key is required when in production mode");
    }

    // Basic format validation for Stripe keys
    if (!testApiKey.startsWith('sk_test_')) {
      throw new Error("Invalid test API key format. It should start with 'sk_test_'");
    }

    if (mode === 'production' && prodApiKey && !prodApiKey.startsWith('sk_live_')) {
      throw new Error("Invalid production API key format. It should start with 'sk_live_'");
    }

    console.log("Starting key validation...");

    // Validate API keys by trying to initialize Stripe with explicit error handling
    try {
      // Test the test key
      const testStripe = new Stripe(testApiKey, { apiVersion: '2023-10-16' });
      const testResult = await testStripe.balance.retrieve();
      console.log("Test API key validated successfully");
      
      // Test the production key if provided
      if (prodApiKey) {
        const prodStripe = new Stripe(prodApiKey, { apiVersion: '2023-10-16' });
        const prodResult = await prodStripe.balance.retrieve();
        console.log("Production API key validated successfully");
      }
    } catch (stripeError: any) {
      console.error("Stripe key validation failed:", stripeError.message);
      
      // Provide more detailed error messages based on the Stripe error
      if (stripeError.message.includes("Invalid API Key")) {
        throw new Error("Invalid Stripe API key: The key you provided was rejected by Stripe");
      }
      
      if (stripeError.message.includes("No such customer")) {
        // This is actually a success case since we're just checking if the API is valid
        console.log("Key is valid, but returned a customer error (expected)");
      } else {
        // For other errors, throw with more details
        throw new Error(`Stripe key validation failed: ${stripeError.message}`);
      }
    }

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
    
    if (userError) {
      console.error("Auth error:", userError.message);
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    console.log("User authenticated, checking admin role...");

    // Verify admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .rpc('has_role', { user_id: user.id, role: 'admin' });
      
    if (roleError) {
      console.error("Role check error:", roleError.message);
      throw new Error(`Role verification error: ${roleError.message}`);
    }

    if (!roleData) {
      throw new Error("Unauthorized: Admin role required");
    }

    // Create a service client to save the configuration (bypasses RLS)
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceRoleKey) {
      throw new Error("Service role key not configured");
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      serviceRoleKey
    );

    // Check if configuration already exists
    const { data: existingConfig, error: fetchError } = await supabaseAdmin
      .from('stripe_config')
      .select('*')
      .maybeSingle();
      
    if (fetchError && !fetchError.message.includes('No rows found')) {
      console.error("Error fetching config:", fetchError);
      throw new Error(`Database error: ${fetchError.message}`);
    }

    // Save or update configuration
    let dbOperation;
    if (existingConfig) {
      dbOperation = supabaseAdmin
        .from('stripe_config')
        .update({
          test_key: testApiKey,
          prod_key: prodApiKey || null,
          webhook_secret: webhookSecret || null,
          mode,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        })
        .eq('id', existingConfig.id);
    } else {
      dbOperation = supabaseAdmin
        .from('stripe_config')
        .insert({
          test_key: testApiKey,
          prod_key: prodApiKey || null,
          webhook_secret: webhookSecret || null,
          mode,
          created_by: user.id,
          updated_by: user.id
        });
    }
    
    const { error: saveError } = await dbOperation;
    if (saveError) {
      console.error("Error saving config:", saveError);
      throw new Error(`Failed to save configuration: ${saveError.message}`);
    }
    
    console.log("Stripe configuration saved successfully to database");
    
    // Update the STRIPE_SECRET_KEY in edge function secrets for immediate use
    const activeKey = mode === 'production' && prodApiKey ? prodApiKey : testApiKey;
    
    // We can't directly update edge function secrets here, but we can use the saved key
    // in other edge functions by fetching from the database
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Stripe configuration saved successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in save-stripe-keys:", error.message);
    console.error("Error details:", error.stack || "No stack trace");
    
    return new Response(JSON.stringify({ 
      error: error.message || "An unknown error occurred",
      details: error.toString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
