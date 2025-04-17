
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    // Parse request body
    const { testApiKey, prodApiKey, mode } = await req.json();

    if (!testApiKey) {
      throw new Error("Test API key is required");
    }

    if (mode === 'production' && !prodApiKey) {
      throw new Error("Production API key is required when in production mode");
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

    // In a real implementation, you would store these in a secure storage
    // For demonstration, we'll just log that we received them
    console.log(`Stripe keys received for mode: ${mode}`);
    console.log(`Test key begins with: ${testApiKey.substring(0, 7)}...`);
    if (prodApiKey) {
      console.log(`Production key begins with: ${prodApiKey.substring(0, 7)}...`);
    }
    
    // Store configuration in database (in a real app)
    // For now we'll just pretend we saved it
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
