
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.33.2'
import Stripe from 'https://esm.sh/stripe@13.9.0?target=deno'

// Configure os CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Lidar com solicitações CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar se o usuário está autenticado
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Verificar a autenticação do usuário
    const {
      data: { session },
    } = await supabaseClient.auth.getSession()

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado - é necessário estar logado' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Recuperar dados do corpo da requisição
    const { spaceId, spaceTitle, bookingType, amount, quantity, unit } = await req.json()

    // Inicializar o cliente Stripe com a chave secreta do ambiente Supabase
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Verificar se o usuário já existe como cliente no Stripe
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    })

    let customerId
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      // Criar um novo cliente Stripe se não existir
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.user_metadata?.full_name || session.user.email,
      })
      customerId = customer.id
    }

    // Criar uma sessão de checkout no Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Reserva: ${spaceTitle}`,
              description: `${quantity} ${unit}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/reservas/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/spaces/${spaceId}`,
    })

    return new Response(
      JSON.stringify({ url: checkoutSession.url }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
