import { SubscriptionTier } from '@/lib/subscription/tiers'

export const SUPPORTED_GATEWAYS = ['vnpay', 'momo', 'zalopay'] as const
export type PaymentGateway = (typeof SUPPORTED_GATEWAYS)[number]

export const GATEWAY_LABELS: Record<PaymentGateway, string> = {
  vnpay: 'VNPay',
  momo: 'MoMo',
  zalopay: 'ZaloPay',
}

export interface PaymentTierConfig {
  price: number
  durationDays: number
}

export const PAYMENT_TIER_CONFIG: Record<
  Exclude<SubscriptionTier, SubscriptionTier.FREE>,
  PaymentTierConfig
> = {
  [SubscriptionTier.PRO]: {
    price: 299_000,
    durationDays: 30,
  },
  [SubscriptionTier.PREMIUM]: {
    price: 499_000,
    durationDays: 30,
  },
}

export function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BASE_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000'
  )
}

export function isPaymentConfigured(gateway: PaymentGateway): boolean {
  switch (gateway) {
    case 'vnpay':
      return Boolean(
        process.env.VNPAY_TMN_CODE && process.env.VNPAY_HASH_SECRET
      )
    case 'momo':
      return Boolean(
        process.env.MOMO_PARTNER_CODE && process.env.MOMO_ACCESS_KEY
      )
    case 'zalopay':
      return Boolean(
        process.env.ZALOPAY_APP_ID && process.env.ZALOPAY_KEY1
      )
    default:
      return false
  }
}
