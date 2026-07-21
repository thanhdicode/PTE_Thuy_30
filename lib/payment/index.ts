import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/drizzle'
import { paymentTransactions, userSubscriptions } from '@/lib/db/schema'
import { SubscriptionTier } from '@/lib/subscription/tiers'
import {
  GATEWAY_LABELS,
  PAYMENT_TIER_CONFIG,
  SUPPORTED_GATEWAYS,
  type PaymentGateway,
  getBaseUrl,
  isPaymentConfigured,
} from './config'
import { buildVNPayPaymentUrl, verifyVNPayReturn } from './vnpay'
import { generateOrderId, normalizeAmount } from './utils'

export interface CreatePaymentInput {
  userId: string
  tier: Exclude<SubscriptionTier, SubscriptionTier.FREE>
  gateway: PaymentGateway
  ipAddr: string
}

export interface CreatedPayment {
  orderId: string
  paymentUrl: string
  gateway: PaymentGateway
  amount: number
}

export async function createPayment({
  userId,
  tier,
  gateway,
  ipAddr,
}: CreatePaymentInput): Promise<CreatedPayment> {
  if (!SUPPORTED_GATEWAYS.includes(gateway)) {
    throw new Error(`Unsupported payment gateway: ${gateway}`)
  }

  if (!isPaymentConfigured(gateway)) {
    throw new Error(`${GATEWAY_LABELS[gateway]} is not configured`)
  }

  const config = PAYMENT_TIER_CONFIG[tier]
  if (!config) {
    throw new Error(`Invalid tier: ${tier}`)
  }

  const orderId = generateOrderId()
  const baseUrl = getBaseUrl()
  const returnUrl = `${baseUrl}/api/payment/vnpay/return`

  let paymentUrl: string

  switch (gateway) {
    case 'vnpay':
      paymentUrl = buildVNPayPaymentUrl({
        orderId,
        amount: config.price,
        tier,
        ipAddr,
        returnUrl,
      })
      break
    case 'momo':
    case 'zalopay':
      // Placeholder: redirect to a manual transfer / contact page until integrated
      paymentUrl = `${baseUrl}/checkout/${tier}?gateway=${gateway}&status=pending`
      break
    default:
      throw new Error(`Gateway handler missing: ${gateway}`)
  }

  await db.insert(paymentTransactions).values({
    userId,
    tier,
    gateway,
    amount: config.price,
    orderId,
    paymentUrl,
    status: 'pending',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  })

  return { orderId, paymentUrl, gateway, amount: config.price }
}

export interface VerifyPaymentInput {
  gateway: PaymentGateway
  query: Record<string, unknown>
}

export interface VerifiedPayment {
  orderId: string
  success: boolean
  verified: boolean
  message: string
  amount: number
  tier?: SubscriptionTier
}

export async function verifyPayment({
  gateway,
  query,
}: VerifyPaymentInput): Promise<VerifiedPayment> {
  if (gateway !== 'vnpay') {
    throw new Error(`Gateway verification not implemented: ${gateway}`)
  }

  const result = verifyVNPayReturn(query)

  if (!result.isVerified) {
    return {
      orderId: String(query.vnp_TxnRef || ''),
      success: false,
      verified: false,
      message: result.message,
      amount: Number(query.vnp_Amount || 0) / 100,
    }
  }

  const orderId = String(result.vnp_TxnRef || query.vnp_TxnRef || '')
  const amount = Number(result.vnp_Amount || query.vnp_Amount || 0) / 100

  const transaction = await db.query.paymentTransactions.findFirst({
    where: eq(paymentTransactions.orderId, orderId),
  })

  if (!transaction) {
    return {
      orderId,
      success: false,
      verified: true,
      message: 'Transaction not found',
      amount,
    }
  }

  if (result.isSuccess) {
    await db
      .update(paymentTransactions)
      .set({
        status: 'paid',
        providerRef: String(query.vnp_TransactionNo || ''),
        responseCode: String(query.vnp_ResponseCode || ''),
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(paymentTransactions.orderId, orderId))

    const durationDays = PAYMENT_TIER_CONFIG[transaction.tier]?.durationDays || 30
    const now = new Date()
    const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000)

    await db.insert(userSubscriptions).values({
      userId: transaction.userId,
      planType: transaction.tier,
      status: 'active',
      startDate: now,
      endDate,
      autoRenew: false,
      paymentMethod: transaction.gateway,
    })

    return {
      orderId,
      success: true,
      verified: true,
      message: result.message,
      amount,
      tier: transaction.tier as SubscriptionTier,
    }
  }

  await db
    .update(paymentTransactions)
    .set({
      status: result.isSuccess ? 'paid' : 'failed',
      responseCode: String(query.vnp_ResponseCode || ''),
      updatedAt: new Date(),
    })
    .where(eq(paymentTransactions.orderId, orderId))

  return {
    orderId,
    success: false,
    verified: true,
    message: result.message,
    amount,
    tier: transaction.tier as SubscriptionTier,
  }
}

export { getBaseUrl, isPaymentConfigured, SUPPORTED_GATEWAYS, GATEWAY_LABELS }
