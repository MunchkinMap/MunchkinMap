import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backward compatibility
export const stripe = {
  get webhooks() { return getStripe().webhooks; },
  get checkout() { return getStripe().checkout; },
  get billingPortal() { return getStripe().billingPortal; },
  get customers() { return getStripe().customers; },
  get subscriptions() { return getStripe().subscriptions; },
};

export const STRIPE_PLANS = {
  premium_monthly: {
    id: "premium_monthly",
    name: "Premium Monthly",
    description: "Full access to all features, billed monthly",
    price: 9.99,
    interval: "month" as const,
    priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
    features: [
      "Personalized feed and recommendations",
      "Unlimited saved searches",
      "Offline access to favorites",
      "Advanced filters",
      "Early access to new features",
      "Ad-free experience",
    ],
  },
  premium_annual: {
    id: "premium_annual",
    name: "Premium Annual",
    description: "Full access to all features, billed annually (save 20%)",
    price: 95.88, // $7.99/mo
    interval: "year" as const,
    priceId: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID!,
    features: [
      "Personalized feed and recommendations",
      "Unlimited saved searches",
      "Offline access to favorites",
      "Advanced filters",
      "Early access to new features",
      "Ad-free experience",
      "2 months free",
    ],
  },
};

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      trial_period_days: 7,
    },
  });

  return session;
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function createOrRetrieveCustomer(
  userId: string,
  email: string,
  name?: string
) {
  // Check if customer exists in Stripe
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0];
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      supabase_user_id: userId,
    },
  });

  return customer;
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}

export async function resumeSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });

  return subscription;
}
