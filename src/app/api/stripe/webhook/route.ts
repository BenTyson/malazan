import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, STRIPE_PRICES } from '@/lib/stripe/config';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

// Use service role key for webhook (no auth context)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.supabase_user_id;
  const plan = session.metadata?.plan as 'pro' | 'business';

  if (!userId || !plan) {
    console.error('Missing metadata in checkout session');
    return;
  }

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: plan,
      subscription_status: 'active',
      stripe_customer_id: session.customer as string,
    })
    .eq('id', userId);

  console.log(`Subscription activated for user ${userId}: ${plan}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Find user by customer ID
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) {
    console.error('No profile found for customer:', customerId);
    return;
  }

  // Determine plan from price ID by matching against configured prices
  const priceId = subscription.items.data[0]?.price.id;
  let tier: 'free' | 'pro' | 'business' = 'free';

  if (priceId === STRIPE_PRICES.pro_monthly || priceId === STRIPE_PRICES.pro_yearly) {
    tier = 'pro';
  } else if (priceId === STRIPE_PRICES.business_monthly || priceId === STRIPE_PRICES.business_yearly) {
    tier = 'business';
  }

  // Map Stripe status to our status
  let status = 'active';
  if (subscription.status === 'past_due') status = 'past_due';
  if (subscription.status === 'canceled') status = 'canceled';
  if (subscription.status === 'unpaid') status = 'unpaid';

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: tier,
      subscription_status: status,
    })
    .eq('id', profile.id);

  console.log(`Subscription updated for user ${profile.id}: ${tier} (${status})`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) {
    console.error('No profile found for customer:', customerId);
    return;
  }

  // Downgrade to free
  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: 'free',
      subscription_status: 'canceled',
    })
    .eq('id', profile.id);

  console.log(`Subscription canceled for user ${profile.id}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) return;

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: 'past_due',
    })
    .eq('id', profile.id);

  console.log(`Payment failed for user ${profile.id}`);
}
