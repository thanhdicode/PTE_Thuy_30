export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const bytes = new Uint8Array(3)
  crypto.getRandomValues(bytes)
  const random = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
  return `PTE${timestamp}${random}`
}

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function normalizeAmount(amount: number): number {
  // VNPay expects amount * 100 in VND; the vnpay library already handles it,
  // but we keep prices in whole VND internally.
  return Math.max(1000, Math.round(amount))
}

export function getClientIp(req?: { headers?: { 'x-forwarded-for'?: string }; socket?: { remoteAddress?: string } }): string {
  if (!req) return '127.0.0.1'
  const forwarded = req.headers?.['x-forwarded-for']
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim() || '127.0.0.1'
  }
  return req.socket?.remoteAddress || '127.0.0.1'
}
