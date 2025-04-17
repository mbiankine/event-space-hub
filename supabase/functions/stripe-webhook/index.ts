
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import * as crypto from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Custom webhook signature verification function
async function verifyStripeWebhook(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    // Get the timestamp and signatures from the stripe-signature header
    const details = signature.split(',').reduce((acc: any, item) => {
      const [key, value] = item.split('=');
      acc[key] = value;
      return acc;
    }, {});
    
    if (!details.t || !details.v1) {
      console.error('Invalid signature format');
      return false;
    }

    const timestamp = details.t;
    const signedPayload = `${timestamp}.${payload}`;
    
    // Convert the webhook secret to a crypto key
    const encoder = new TextEncoder();
    const secretBytes = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      'raw',
      secretBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );
    
    // Generate the signature
    const signatureBytes = encoder.encode(signedPayload);
    const signed = await crypto.subtle.sign(
      { name: 'HMAC' },
      key,
      signatureBytes
    );
    
    // Convert the signature to a hex string
    const expectedSignature = Array.from(new Uint8Array(signed))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Compare signatures
    return expectedSignature === details.v1;
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    console.error("STRIPE_SECRET_KEY not found");
    return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
  });

  // Use the provided webhook secret or get it from environment
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not found");
    return new Response(JSON.stringify({ error: "Webhook secret not configured" }), { status: 500 });
  }

  console.log("Using webhook secret:", webhookSecret.substring(0, 5) + "...");

  try {
    // Get the signature from the headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("No stripe signature found");
      return new Response(JSON.stringify({ error: "No Stripe signature" }), { status: 400 });
    }

    // Get the raw body
    const body = await req.text();
    
    // Verify the event using our custom function instead of Stripe's native method
    const isValid = await verifyStripeWebhook(body, signature, webhookSecret);
    
    if (!isValid) {
      console.error("Invalid signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
    }
    
    // Parse the event data manually
    const event = JSON.parse(body);
    
    console.log("Received Stripe webhook event:", event.type);

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log("Processing completed checkout session:", session.id);

        // Update booking status if this was a booking payment
        if (session.metadata?.booking_id) {
          console.log(`Updating booking ${session.metadata.booking_id} to confirmed status with payment method ${session.payment_method_types?.[0] || 'card'}`);
          
          // Update the booking record with payment_method and payment status
          const { error: updateError } = await supabaseAdmin
            .from('bookings')
            .update({
              payment_status: 'paid',
              status: 'confirmed',
              payment_method: session.payment_method_types?.[0] || 'card',
              updated_at: new Date().toISOString()
            })
            .eq('id', session.metadata.booking_id);

          if (updateError) {
            console.error("Error updating booking:", updateError);
            throw updateError;
          }
          console.log(`Updated booking ${session.metadata.booking_id} status to confirmed and payment to paid with method ${session.payment_method_types?.[0] || 'card'}`);
          
          // Force a double-check update after a short delay to ensure changes are applied
          setTimeout(async () => {
            try {
              const { data: checkBooking, error: checkError } = await supabaseAdmin
                .from('bookings')
                .select('payment_status, status')
                .eq('id', session.metadata.booking_id)
                .single();
                
              console.log(`Double-check result for booking ${session.metadata.booking_id}:`, checkBooking);
                
              if (checkError) {
                console.error("Error in double-check query:", checkError);
              } else if (checkBooking.payment_status !== 'paid' || checkBooking.status !== 'confirmed') {
                console.log("Booking still not properly updated, forcing another update");
                const { error: doubleCheckError } = await supabaseAdmin
                  .from('bookings')
                  .update({
                    payment_status: 'paid',
                    status: 'confirmed',
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', session.metadata.booking_id);
                  
                if (doubleCheckError) {
                  console.error("Error in double-check update:", doubleCheckError);
                } else {
                  console.log("Double-check update completed successfully");
                }
              } else {
                console.log("Booking already updated correctly, no action needed");
              }
            } catch (err) {
              console.error("Error in double-check update:", err);
            }
          }, 2000);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log("Payment failed for intent:", paymentIntent.id);
        
        // If this was a booking payment, update the booking status
        const { data: bookings, error: searchError } = await supabaseAdmin
          .from('bookings')
          .select('id')
          .eq('payment_intent', paymentIntent.id)
          .maybeSingle();

        if (searchError) {
          console.error("Error searching for booking:", searchError);
          throw searchError;
        }

        if (bookings) {
          const { error: updateError } = await supabaseAdmin
            .from('bookings')
            .update({
              payment_status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('id', bookings.id);

          if (updateError) {
            console.error("Error updating booking:", updateError);
            throw updateError;
          }
          console.log(`Updated booking ${bookings.id} status to failed`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 400 }
    );
  }
});
