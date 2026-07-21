'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { MessageCircle, HelpCircle, Send, CheckCircle2 } from 'lucide-react'

const faqs = [
  { q: 'Làm thế nào để bắt đầu luyện PTE?', a: 'Chọn Dashboard → Practice hoặc Mock Test để làm bài theo từng dạng hoặc full bài thi.' },
  { q: 'AI chấm điểm có chính xác không?', a: 'AI dựa trên rubric PTE 0-90, phù hợp để đánh giá xu hướng và phản hồi chi tiết.' },
  { q: 'Tôi có thể thanh toán bằng Momo/ZaloPay không?', a: 'Có, hệ thống tích hợp VNPay, Momo, ZaloPay và tự động kích hoạt gói.' },
]

export default function DemoSupportPage() {
  const [sent, setSent] = useState(false)
  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/demo">← Demo hub</a>
            </Button>
            <h1 className="font-bold text-lg">Support & FAQ</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HelpCircle className="w-5 h-5" /> FAQ</CardTitle>
            <CardDescription>Các câu hỏi thường gặp</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Contact us</CardTitle>
            <CardDescription>Form liên hệ + Messenger/Zalo OA widget có thể tích hợp ở góc phải.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Name" />
            <Input placeholder="Email" />
            <Textarea placeholder="How can we help?" />
            {sent ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Sent (demo)
              </div>
            ) : (
              <Button onClick={() => setSent(true)} className="gap-2"><Send className="w-4 h-4" /> Send</Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
