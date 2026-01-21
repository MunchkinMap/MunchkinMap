import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseAdmin;
}

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
]);

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          await handleSubscriptionChange(subscription);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        // Handle successful payment - could send receipt email, etc.
        console.log("Invoice paid:", invoice.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        // Handle failed payment - could send notification email
        console.log("Invoice payment failed:", invoice.id);
        await handlePaymentFailed(invoice);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const stripe = getStripe();
  const supabase = getSupabaseAdmin();
  const customerId = subscription.customer as string;

  // Get customer to find user ID
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return;

  const userId = customer.metadata?.supabase_user_id;
  if (!userId) {
    console.error("No user ID found in customer metadata");
    return;
  }

  // Determine plan from price
  const priceId = subscription.items.data[0]?.price.id;
  let plan: "free" | "premium_monthly" | "premium_annual" = "free";

  if (priceId === process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID) {
    plan = "premium_monthly";
  } else if (priceId === process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID) {
    plan = "premium_annual";
  }

  // Map Stripe status to our status
  let status: "active" | "past_due" | "canceled" | "trialing" = "active";
  if (subscription.status === "past_due") status = "past_due";
  else if (subscription.status === "canceled") status = "canceled";
  else if (subscription.status === "trialing") status = "trialing";

  // Get period dates from subscription
  const currentPeriodStart = (subscription as unknown as { current_period_start: number }).current_period_start;
  const currentPeriodEnd = (subscription as unknown as { current_period_end: number }).current_period_end;

  // Update user subscription
  await supabase.from("user_subscriptions").upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    plan,
    status,
    current_period_start: new Date(currentPeriodStart * 1000).toISOString(),
    current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
  });

  // Update user premium status
  await supabase
    .from("profiles")
    .update({ is_premium: plan !== "free" && status === "active" })
    .eq("id", userId);
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const stripe = getStripe();
  const supabase = getSupabaseAdmin();
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return;

  const userId = customer.metadata?.supabase_user_id;
  if (!userId) return;

  await supabase
    .from("user_subscriptions")
    .update({ status: "canceled", plan: "free" })
    .eq("stripe_subscription_id", subscription.id);

  await supabase
    .from("profiles")
    .update({ is_premium: false })
    .eq("id", userId);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const stripe = getStripe();
  const supabase = getSupabaseAdmin();
  const customerId = invoice.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return;

  const userId = customer.metadata?.supabase_user_id;
  if (!userId) return;

  // Get subscription from invoice
  const subscriptionId = (invoice as unknown as { subscription: string | null }).subscription;

  // Update subscription status to past_due
  if (subscriptionId) {
    await supabase
      .from("user_subscriptions")
      .update({ status: "past_due" })
      .eq("stripe_subscription_id", subscriptionId);
  }

  // Could also create a notification for the user here
}
