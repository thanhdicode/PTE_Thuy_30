import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/payment'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = Object.fromEntries(searchParams.entries())

    const result = await verifyPayment({ gateway: 'vnpay', query })

    return NextResponse.json({
      RspCode: result.success ? '00' : '01',
      Message: result.verified ? 'Confirm Success' : 'Invalid Checksum',
    })
  } catch (error) {
    console.error('VNPay IPN error:', error)
    return NextResponse.json({
      RspCode: '99',
      Message: 'Unknown error',
    })
  }
}

export const POST = GET
