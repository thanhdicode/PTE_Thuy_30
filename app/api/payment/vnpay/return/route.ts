import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/payment'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = Object.fromEntries(searchParams.entries())

    const result = await verifyPayment({ gateway: 'vnpay', query })

    const redirectUrl = new URL(
      result.success ? '/checkout/success' : '/checkout/cancel',
      request.nextUrl.origin
    )
    redirectUrl.searchParams.set('orderId', result.orderId)
    if (result.tier) redirectUrl.searchParams.set('tier', result.tier)
    redirectUrl.searchParams.set('message', encodeURIComponent(result.message))

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('VNPay return error:', error)
    const message = error instanceof Error ? error.message : 'Payment verification failed'
    return NextResponse.redirect(
      new URL(`/checkout/cancel?message=${encodeURIComponent(message)}`, request.nextUrl.origin)
    )
  }
}
