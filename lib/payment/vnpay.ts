import { VNPay, VnpLocale, HashAlgorithm, dateFormat } from 'vnpay'
import { getClientIp, normalizeAmount } from './utils'

let vnpayClient: VNPay | null = null

export function getVNPayClient(): VNPay | null {
  if (vnpayClient) return vnpayClient

  const tmnCode = process.env.VNPAY_TMN_CODE
  const secureSecret = process.env.VNPAY_HASH_SECRET

  if (!tmnCode || !secureSecret) {
    return null
  }

  vnpayClient = new VNPay({
    tmnCode,
    secureSecret,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: process.env.VNPAY_TEST_MODE !== 'false',
    hashAlgorithm: HashAlgorithm.SHA512,
    loggerFn: ignoreLogger,
  })

  return vnpayClient
}

function ignoreLogger() {
  // Suppress library logs in production to avoid leaking payment data
}

export function buildVNPayPaymentUrl({
  orderId,
  amount,
  tier,
  ipAddr,
  returnUrl,
}: {
  orderId: string
  amount: number
  tier: string
  ipAddr: string
  returnUrl: string
}): string {
  const client = getVNPayClient()
  if (!client) {
    throw new Error('VNPay is not configured')
  }

  const cleanInfo = `Thanh toan goi ${tier.toUpperCase()} PTE Talents - ${orderId}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s\-]/g, ' ')
    .trim()

  const expireDate = new Date()
  expireDate.setMinutes(expireDate.getMinutes() + 15)

  return client.buildPaymentUrl({
    vnp_Amount: normalizeAmount(amount),
    vnp_IpAddr: getClientIp({ socket: { remoteAddress: ipAddr } } as any),
    vnp_TxnRef: orderId,
    vnp_OrderInfo: cleanInfo,
    vnp_ReturnUrl: returnUrl,
    vnp_CreateDate: Number(dateFormat(new Date())),
    vnp_ExpireDate: Number(dateFormat(expireDate)),
    vnp_Locale: VnpLocale.VN,
  })
}

export function verifyVNPayReturn(query: Record<string, unknown>) {
  const client = getVNPayClient()
  if (!client) {
    throw new Error('VNPay is not configured')
  }
  return client.verifyReturnUrl(query as any)
}

export function verifyVNPayIpn(query: Record<string, unknown>) {
  const client = getVNPayClient()
  if (!client) {
    throw new Error('VNPay is not configured')
  }
  return client.verifyIpnCall(query as any)
}
