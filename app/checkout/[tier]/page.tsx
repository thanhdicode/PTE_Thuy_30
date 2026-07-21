'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, Loader2 } from 'lucide-react'
import {
  SubscriptionTier,
  TIER_FEATURES_DISPLAY,
  TIER_PRICING,
} from '@/lib/subscription/tiers'
import {
  GATEWAY_LABELS,
  SUPPORTED_GATEWAYS,
  type PaymentGateway,
  isPaymentConfigured,
} from '@/lib/payment/config'
import { formatVnd } from '@/lib/payment/utils'

export default function CheckoutPage() {
  const params = useParams<{ tier: string }>()
  const tierParam = params?.tier ?? ''
  const tier = tierParam as SubscriptionTier

  const [isLoading, setIsLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<PaymentGateway | null>(null)

  if (!['pro', 'premium'].includes(tierParam)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Plan</h1>
          <p className="text-muted-foreground mb-4">The selected plan is not available.</p>
          <Link href="/pricing">
            <Button>View Available Plans</Button>
          </Link>
        </div>
      </div>
    )
  }

  const pricing = TIER_PRICING[tier]
  const features = TIER_FEATURES_DISPLAY[tier]

  const handleCheckout = async () => {
    if (!selectedProvider) return
    setIsLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierParam, gateway: selectedProvider }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create checkout session')
      }

      const { paymentUrl } = await response.json()
      window.location.href = paymentUrl
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error instanceof Error ? error.message : 'Failed to start checkout.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4" variant="outline">
              Checkout
            </Badge>
            <h1 className="text-3xl font-bold mb-2">
              Hoàn tất đăng ký gói {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </h1>
            <p className="text-muted-foreground">
              Chọn cổng thanh toán phù hợp bên dưới
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      tier === 'pro' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                  />
                  Gói {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </CardTitle>
                <CardDescription>
                  {tier === 'pro'
                    ? 'Dành cho học viên nghiêm túc'
                    : 'Trải nghiệm tối đa'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold">
                    {pricing.price === 0 ? (
                      'Free'
                    ) : (
                      <>
                        {formatVnd(pricing.price)}
                        <span className="text-lg text-muted-foreground">/{pricing.period === 'month' ? 'tháng' : pricing.period}</span>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Chọn cổng thanh toán</h3>

              {SUPPORTED_GATEWAYS.map((gateway) => {
                const configured = isPaymentConfigured(gateway)
                return (
                  <Card
                    key={gateway}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedProvider === gateway ? 'ring-2 ring-primary' : ''
                    } ${!configured ? 'opacity-50' : ''}`}
                    onClick={() => configured && setSelectedProvider(gateway)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{GATEWAY_LABELS[gateway]}</h4>
                            <p className="text-sm text-muted-foreground">
                              {configured
                                ? gateway === 'vnpay'
                                  ? 'ATM / Internet Banking / Thẻ quốc tế'
                                  : 'Sẵn sàng'
                                : 'Chưa cấu hình'}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            selectedProvider === gateway
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}
                        >
                          {selectedProvider === gateway && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              <Button
                onClick={handleCheckout}
                disabled={!selectedProvider || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo thanh toán...
                  </>
                ) : (
                  `Thanh toán qua ${selectedProvider ? GATEWAY_LABELS[selectedProvider] : '...'}`
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Bằng việc thanh toán, bạn đồng ý với{' '}
                <Link href="/legal/terms" className="underline hover:no-underline">
                  Điều khoản dịch vụ
                </Link>{' '}
                và{' '}
                <Link href="/legal/privacy" className="underline hover:no-underline">
                  Chính sách bảo mật
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button variant="outline">← Quay lại bảng giá</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
