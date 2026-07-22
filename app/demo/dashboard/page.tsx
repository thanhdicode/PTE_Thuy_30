'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import {
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  Trophy,
  Target,
  Calendar,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

const skillData = [
  { name: 'Tuần 1', Speaking: 42, Writing: 50, Reading: 58, Listening: 55 },
  { name: 'Tuần 2', Speaking: 50, Writing: 54, Reading: 60, Listening: 58 },
  { name: 'Tuần 3', Speaking: 58, Writing: 60, Reading: 62, Listening: 61 },
  { name: 'Tuần 4', Speaking: 64, Writing: 66, Reading: 68, Listening: 65 },
  { name: 'Tuần 5', Speaking: 70, Writing: 68, Reading: 72, Listening: 69 },
  { name: 'Tuần 6', Speaking: 72, Writing: 74, Reading: 70, Listening: 73 },
]

const weekly = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 60 },
  { day: 'Wed', minutes: 30 },
  { day: 'Thu', minutes: 90 },
  { day: 'Fri', minutes: 50 },
  { day: 'Sat', minutes: 120 },
  { day: 'Sun', minutes: 80 },
]

const skills = [
  { name: 'Speaking', score: 72, target: 79, icon: Mic, color: 'text-rose-500' },
  { name: 'Writing', score: 74, target: 79, icon: PenTool, color: 'text-amber-500' },
  { name: 'Reading', score: 70, target: 79, icon: BookOpen, color: 'text-emerald-500' },
  { name: 'Listening', score: 73, target: 79, icon: Headphones, color: 'text-violet-500' },
]

const suggestions = [
  {
    title: 'Luyện Describe Image',
    reason: 'Điểm Speaking thấp nhất, cần cải thiện phần phát âm và từ vựng mô tả.',
    link: '/demo/practice',
  },
  {
    title: 'Write Essay drill',
    reason: 'Ngữ pháp và structure chưa ổn định, nên làm 2 bài WE mỗi ngày.',
    link: '/demo/ai-writing',
  },
]

export default function DemoDashboardPage() {
  const overall = 72
  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/demo">← Demo hub</a>
            </Button>
            <h1 className="font-bold text-lg">Student Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="gap-1">
              <Trophy className="w-3 h-3" /> Premium
            </Badge>
            <span className="text-muted-foreground">Hi, Minh</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" /> Target Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">79</div>
              <p className="text-xs text-muted-foreground">PTE Academic 30/90</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" /> Overall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overall}</div>
              <Progress value={(overall / 90) * 100} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Exam in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">14</div>
              <p className="text-xs text-muted-foreground">days remaining</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Study time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">18h</div>
              <p className="text-xs text-muted-foreground">this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Progress over time</CardTitle>
              <CardDescription>Điểm trung bình 4 kỹ năng 6 tuần qua</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={skillData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 90]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Speaking" stroke="#f43f5e" strokeWidth={2} />
                    <Line type="monotone" dataKey="Writing" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="Reading" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="Listening" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill breakdown</CardTitle>
              <CardDescription>So sánh với target 79</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {skills.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Icon className={`w-4 h-4 ${s.color}`} />
                        {s.name}
                      </div>
                      <span className="text-sm font-semibold">{s.score}</span>
                    </div>
                    <Progress value={(s.score / 90) * 100} />
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: {s.target}
                    </p>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Study time this week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="minutes" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>AI suggestion</CardTitle>
              <CardDescription>Gợi ý bài tập tiếp theo dựa trên điểm yếu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-4 rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-sm text-muted-foreground">{s.reason}</p>
                  </div>
                  <Link href={s.link}>
                    <Button size="sm">Start</Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
