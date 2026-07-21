'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mic, Headphones, BookOpen, PenTool } from 'lucide-react'

const sections = [
  {
    id: 'all',
    label: 'All 20 tasks (PTE Simulator)',
    icon: BookOpen,
    desc: 'Mô phỏng đầy đủ 20 dạng bài PTE Academic với ghi âm, đếm giờ và chấm điểm.',
  },
  {
    id: 'speaking',
    label: 'Speaking',
    icon: Mic,
    desc: 'Read Aloud, Repeat Sentence, Describe Image, Retell Lecture, Answer Short Question.',
  },
  {
    id: 'writing',
    label: 'Writing',
    icon: PenTool,
    desc: 'Summarize Written Text, Write Essay.',
  },
  {
    id: 'reading',
    label: 'Reading',
    icon: BookOpen,
    desc: 'MCQ, Re-order Paragraphs, Fill in the Blanks (×2).',
  },
  {
    id: 'listening',
    label: 'Listening',
    icon: Headphones,
    desc: 'SST, MCQ, HCS, SMW, HIW, WFD và các dạng khác.',
  },
]

export default function DemoPracticePage() {
  const [active, setActive] = useState('all')
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/demo">← Demo hub</a>
            </Button>
            <h1 className="font-bold text-lg">Practice 4 kỹ năng</h1>
            <Badge variant="outline">pte-simulator</Badge>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Tabs value={active} onValueChange={setActive} className="space-y-4">
          <TabsList className="flex-wrap h-auto">
            {sections.map((s) => (
              <TabsTrigger key={s.id} value={s.id} className="gap-2">
                <s.icon className="w-4 h-4" />
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((s) => (
            <TabsContent key={s.id} value={s.id}>
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="px-0">
                  <CardTitle>{s.label}</CardTitle>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardHeader>
                <CardContent className="p-0">
                  {s.id === 'all' ? (
                    <iframe
                      src="/pte-simulator/index.html"
                      className="w-full rounded-xl border"
                      style={{ height: 'calc(100vh - 240px)' }}
                      title="PTE Simulator"
                    />
                  ) : (
                    <div className="rounded-xl border bg-muted/30 p-10 text-center">
                      <p className="text-muted-foreground mb-4">
                        Vui lòng dùng tab <strong>All 20 tasks</strong> để trải nghiệm đầy đủ các dạng bài {s.label}.
                      </p>
                      <Button onClick={() => setActive('all')}>Mở simulator</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
