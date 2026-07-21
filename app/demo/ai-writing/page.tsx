'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PenTool, Loader2, RefreshCw } from 'lucide-react'

const criteria = [
  { key: 'content', label: 'Content', score: 75 },
  { key: 'structure', label: 'Structure', score: 68 },
  { key: 'coherence', label: 'Coherence', score: 72 },
  { key: 'grammar', label: 'Grammar', score: 64 },
  { key: 'vocabulary', label: 'Vocabulary', score: 70 },
  { key: 'spelling', label: 'Spelling', score: 88 },
]

const feedback = [
  'Nội dung trả lời đúng trọng tâm nhưng cần thêm ví dụ cụ thể.',
  'Cấu trúc bài cơ bản rõ ràng, introduction và conclusion đầy đủ.',
  'Một số câu dài gây khó đọc, nên tách nhỏ để coherence tốt hơn.',
  'Lỗi ngữ pháp: "study abroad have" → "studying abroad has"; "many benefit" → "many benefits".',
  'Từ vựng ổn nhưng nên dùng thêm academic words như "furthermore", "nevertheless", "consequently".',
]

export default function DemoAIWritingPage() {
  const [text, setText] = useState('')
  const [grading, setGrading] = useState(false)
  const [graded, setGraded] = useState(false)
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  const handleGrade = () => {
    setGrading(true)
    setTimeout(() => {
      setGrading(false)
      setGraded(true)
    }, 1500)
  }

  const overall = Math.round(criteria.reduce((a, c) => a + c.score, 0) / criteria.length)

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/demo">← Demo hub</a>
            </Button>
            <h1 className="font-bold text-lg">AI Writing Grading</h1>
            <Badge variant="outline">grademeapp pattern</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5" /> Write Essay
              </CardTitle>
              <CardDescription>
                Topic: Do the benefits of studying abroad outweigh the drawbacks? (200-300 words)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="w-full min-h-[320px] rounded-md border p-4 bg-background leading-relaxed"
                placeholder="Type your essay here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{wordCount} words</span>
                <Button onClick={handleGrade} disabled={grading || wordCount < 10} className="gap-2">
                  {grading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {grading ? 'AI is grading...' : 'Grade with AI'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Feedback</CardTitle>
              <CardDescription>Demo output — backend GPT-4 rubric sẽ được tích hợp trong tuần 4.</CardDescription>
            </CardHeader>
            <CardContent>
              {!graded ? (
                <div className="text-center text-muted-foreground py-12">
                  Nhập bài viết và nhấn "Grade with AI" để xem demo phản hồi.
                </div>
              ) : (
                <Tabs defaultValue="scores" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="scores">Scores</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    <TabsTrigger value="corrections">Corrections</TabsTrigger>
                  </TabsList>
                  <TabsContent value="scores" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Overall</span>
                      <span className="text-3xl font-bold">{overall}/90</span>
                    </div>
                    <Progress value={(overall / 90) * 100} className="h-3" />
                    <div className="space-y-3 pt-2">
                      {criteria.map((c) => (
                        <div key={c.key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{c.label}</span>
                            <span className="font-medium">{c.score}</span>
                          </div>
                          <Progress value={(c.score / 90) * 100} />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="feedback" className="space-y-2 text-sm text-muted-foreground">
                    {feedback.map((f, i) => (
                      <p key={i} className="border-l-2 pl-3 py-1">{f}</p>
                    ))}
                  </TabsContent>
                  <TabsContent value="corrections" className="text-sm space-y-2">
                    <p><span className="text-red-500 line-through">study abroad have</span> → <span className="text-green-600">studying abroad has</span></p>
                    <p><span className="text-red-500 line-through">many benefit</span> → <span className="text-green-600">many benefits</span></p>
                    <p><span className="text-red-500 line-through">it is good</span> → <span className="text-green-600">it is advantageous</span></p>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
