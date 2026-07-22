'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Mic,
  PenTool,
  FileBarChart,
  CreditCard,
  Settings,
  HelpCircle,
  Bot,
} from 'lucide-react'

const modules = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    desc: 'Tổng quan tiến độ, điểm số, lịch thi và gợi ý bài tập.',
    href: '/demo/dashboard',
    icon: LayoutDashboard,
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    id: 'practice',
    title: 'Practice 4 kỹ năng',
    desc: '20 dạng câu hỏi PTE Academic với đầy đủ giao diện làm bài.',
    href: '/demo/practice',
    icon: BookOpen,
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    id: 'mocktest',
    title: 'Mock Test',
    desc: 'Phòng thi mô phỏng đầy đủ: timer, autosave, anti-cheat, kết quả.',
    href: '/demo/mock-test',
    icon: ClipboardList,
    color: 'bg-violet-500/10 text-violet-600',
  },
  {
    id: 'ai-speaking',
    title: 'AI Speaking',
    desc: 'Ghi âm, transcription và chấm điểm phát âm/trôi chảy/nội dung.',
    href: '/demo/ai-speaking',
    icon: Mic,
    color: 'bg-rose-500/10 text-rose-600',
  },
  {
    id: 'ai-writing',
    title: 'AI Writing',
    desc: 'Nhập bài viết, nhận điểm và phản hồi grammar/vocabulary/content.',
    href: '/demo/ai-writing',
    icon: PenTool,
    color: 'bg-amber-500/10 text-amber-600',
  },
  {
    id: 'history',
    title: 'History & Progress',
    desc: 'Lịch sử làm bài, biểu đồ tiến bộ và phân tích điểm yếu.',
    href: '/demo/history',
    icon: FileBarChart,
    color: 'bg-cyan-500/10 text-cyan-600',
  },
  {
    id: 'pricing',
    title: 'Subscription & Payment',
    desc: 'Các gói học, thanh toán VNPay/Momo/ZaloPay và kích hoạt tự động.',
    href: '/pricing',
    icon: CreditCard,
    color: 'bg-fuchsia-500/10 text-fuchsia-600',
  },
  {
    id: 'admin',
    title: 'Admin CMS',
    desc: 'Quản lý học viên, kho câu hỏi, gói học và doanh thu.',
    href: '/demo/admin',
    icon: Settings,
    color: 'bg-slate-500/10 text-slate-600',
  },
  {
    id: 'support',
    title: 'Support',
    desc: 'FAQ, contact form và chat widget.',
    href: '/pte/support',
    icon: HelpCircle,
    color: 'bg-indigo-500/10 text-indigo-600',
  },
  {
    id: 'ai-coach',
    title: 'AI Coach',
    desc: 'Gợi ý luyện tập cá nhân hóa dựa trên điểm yếu.',
    href: '/pte/ai-coach',
    icon: Bot,
    color: 'bg-teal-500/10 text-teal-600',
  },
]

export default function DemoHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              PTE
            </div>
            <span className="font-bold text-lg">Talents Demo</span>
            <Badge variant="secondary">Gói 2 Full AI</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">Landing</Button>
            </Link>
            <Link href="/pte/dashboard">
              <Button size="sm">App Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-3">Demo toàn bộ Frontend</h1>
          <p className="text-muted-foreground">
            Các màn hình chính của PTE Talents được ghép từ các repo recommend
            (NeN-Exams, grademeapp, echoic, shadcn-admin-kit, pte-simulator).
            Dữ liệu là demo để khách xem giao diện và luồng ngay hôm nay.
          </p>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {modules.map((m) => {
            const Icon = m.icon
            return (
              <motion.div
                key={m.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${m.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-base">{m.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 min-h-[40px]">
                      {m.desc}
                    </CardDescription>
                    <Link href={m.href} className="w-full">
                      <Button variant="outline" className="w-full">
                        Xem demo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </main>
    </div>
  )
}
