'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const tier = searchParams.get('tier')
  const message = searchParams.get('message') || 'Giao dịch thành công.'

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <Badge className="mb-4" variant="outline">
                Thanh toán thành công
              </Badge>
              <CardTitle className="text-2xl mb-2">
                Chào mừng bạn đến với PTE Talents!
              </CardTitle>
              <CardDescription>
                {message}
              </CardDescription>
              {orderId && (
                <p className="text-sm text-muted-foreground mt-2">
                  Mã giao dịch: <span className="font-mono">{orderId}</span>
                </p>
              )}
              {tier && (
                <p className="text-sm text-muted-foreground">
                  Gói đăng ký: <span className="capitalize font-semibold">{tier}</span>
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Tiếp theo?</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>Làm mock test không giới hạn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>Truy cập phân tích chi tiết</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>Ưu tiên chấm điểm AI</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/pte/dashboard" className="flex-1">
                  <Button className="w-full">
                    Bắt đầu luyện tập
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pte/mock-tests" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Làm mock test
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
