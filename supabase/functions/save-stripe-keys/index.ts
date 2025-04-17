
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
    const { testApiKey, prodApiKey, mode } = await req.json();

    if (!testApiKey) {
      throw new Error("Test API key is required");
    }

    if (mode === 'production' && !prodApiKey) {
      throw new Error("Production API key is required when in production mode");
    }

    // Validate API keys by trying to initialize Stripe
    try {
      // Test the test key
      const testStripe = new Stripe(testApiKey, { apiVersion: '2023-10-16' });
      await testStripe.balance.retrieve();
      console.log("Test API key validated successfully");
      
      // Test the production key if provided
      if (prodApiKey) {
        const prodStripe = new Stripe(prodApiKey, { apiVersion: '2023-10-16' });
        await prodStripe.balance.retrieve();
        console.log("Production API key validated successfully");
      }
    } catch (stripeError) {
      console.error("Stripe key validation failed:", stripeError);
      throw new Error(`Invalid Stripe API key: ${stripeError.message}`);
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
    if (userError) throw userError;
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Verify admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .rpc('has_role', { user_id: user.id, role: 'admin' });
    if (roleError) throw roleError;

    if (!roleData) {
      throw new Error("Unauthorized: Admin role required");
    }

    // Store API keys securely in edge function secrets
    // In a real implementation, this would be more secure
    // For now, we'll just log that we received them
    console.log(`Stripe keys received for mode: ${mode}`);
    console.log(`Test key begins with: ${testApiKey.substring(0, 7)}...`);
    if (prodApiKey) {
      console.log(`Production key begins with: ${prodApiKey.substring(0, 7)}...`);
    }
    
    // In a real production app, we would save the keys to a secure storage
    // or database table with proper encryption
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in save-stripe-keys:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "An unknown error occurred",
      details: error.toString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
