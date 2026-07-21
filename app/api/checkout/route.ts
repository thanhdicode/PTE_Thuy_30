import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { createPayment } from '@/lib/payment'
import { type PaymentGateway, isPaymentConfigured } from '@/lib/payment/config'
import { getClientIp } from '@/lib/payment/utils'
import { SubscriptionTier } from '@/lib/subscription/tiers'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tier, gateway } = body as { tier: string; gateway: PaymentGateway }

    if (!tier || !['pro', 'premium'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "pro" or "premium"' },
        { status: 400 }
      )
    }

    if (!gateway || !isPaymentConfigured(gateway)) {
      return NextResponse.json(
        { error: 'Payment gateway is required or not configured' },
        { status: 400 }
      )
    }

    const ipAddr = getClientIp({
      headers: {
        'x-forwarded-for': request.headers.get('x-forwarded-for') || undefined,
      },
    })

    const payment = await createPayment({
      userId: session.user.id,
      tier: tier === 'premium' ? SubscriptionTier.PREMIUM : SubscriptionTier.PRO,
      gateway,
      ipAddr,
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Checkout error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create checkout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
