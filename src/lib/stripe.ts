import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Platform fee percentage (e.g., 10%)
export const PLATFORM_FEE_PERCENTAGE = 10;

// Calculate platform fee
export function calculatePlatformFee(amount: number): number {
  return Math.round((amount * PLATFORM_FEE_PERCENTAGE) / 100);
}

// Calculate freelancer payout (total - platform fee)
export function calculateFreelancerPayout(amount: number): number {
  return amount - calculatePlatformFee(amount);
}

// Create Payment Intent for escrow deposit
export async function createEscrowPaymentIntent(
  amount: number,
  clientId: string,
  contractId: string,
  metadata?: Record<string, string>
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      clientId,
      contractId,
      type: 'escrow_deposit',
      ...metadata,
    },
    description: `Escrow deposit for contract ${contractId}`,
  });

  return paymentIntent;
}

// Create Payment Intent for milestone
export async function createMilestonePaymentIntent(
  amount: number,
  milestoneId: string,
  contractId: string,
  metadata?: Record<string, string>
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      milestoneId,
      contractId,
      type: 'milestone_payment',
      ...metadata,
    },
    description: `Payment for milestone ${milestoneId}`,
  });

  return paymentIntent;
}

// Release payment to freelancer
export async function releaseMilestonePayment(
  freelancerStripeAccountId: string,
  amount: number,
  milestoneId: string
) {
  const platformFee = calculatePlatformFee(amount);
  const freelancerAmount = amount - platformFee;

  const transfer = await stripe.transfers.create({
    amount: Math.round(freelancerAmount * 100),
    currency: 'usd',
    destination: freelancerStripeAccountId,
    metadata: {
      milestoneId,
      type: 'milestone_payout',
      platformFee: platformFee.toString(),
    },
  });

  return transfer;
}

// Create customer
export async function createStripeCustomer(
  email: string,
  name: string,
  userId: string
) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });

  return customer;
}

// Attach payment method to customer
export async function attachPaymentMethod(
  paymentMethodId: string,
  customerId: string
) {
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  // Set as default payment method
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
}

// Create Connect account for freelancer payouts
export async function createConnectAccount(
  email: string,
  freelancerId: string
) {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    metadata: {
      freelancerId,
    },
    capabilities: {
      transfers: { requested: true },
    },
  });

  return account;
}

// Create account link for Connect onboarding
export async function createAccountLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string
) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  });

  return accountLink;
}

// Refund payment
export async function refundPayment(
  paymentIntentId: string,
  amount?: number,
  reason?: string
) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
    reason: reason as Stripe.RefundCreateParams.Reason,
  });

  return refund;
}

// Get payment method details
export async function getPaymentMethod(paymentMethodId: string) {
  return await stripe.paymentMethods.retrieve(paymentMethodId);
}

// List customer payment methods
export async function listCustomerPaymentMethods(customerId: string) {
  return await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
