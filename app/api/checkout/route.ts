import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { createPayment, type PaymentGateway } from '@/lib/payment'
import { getClientIp } from '@/lib/payment/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tier, gateway } = body as { tier: 'pro' | 'premium'; gateway: PaymentGateway }

    if (!tier || !['pro', 'premium'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "pro" or "premium"' },
        { status: 400 }
      )
    }

    if (!gateway) {
      return NextResponse.json(
        { error: 'Payment gateway is required' },
        { status: 400 }
      )
    }

    const ipAddr =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.ip ||
      '127.0.0.1'

    const payment = await createPayment({
      userId: session.user.id,
      tier,
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
