'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Mic, Square, Play, RotateCcw, Loader2 } from 'lucide-react'

type Phase = 'idle' | 'recording' | 'recorded'

const criteria = [
  { label: 'Pronunciation', score: 74 },
  { label: 'Fluency', score: 68 },
  { label: 'Content', score: 80 },
  { label: 'Grammar', score: 70 },
  { label: 'Vocabulary', score: 72 },
]

export default function DemoAISpeakingPage() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [seconds, setSeconds] = useState(0)
  const [graded, setGraded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [transcript] = useState(
    'I believe studying abroad has many benefits. It helps students improve language skills and become more independent.'
  )
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (phase === 'recording') {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase])

  const start = () => {
    setSeconds(0)
    setGraded(false)
    setPhase('recording')
  }

  const stop = () => {
    setPhase('recorded')
  }

  const grade = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setGraded(true)
    }, 1500)
  }

  const overall = Math.round(criteria.reduce((a, c) => a + c.score, 0) / criteria.length)
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/demo">← Demo hub</a>
            </Button>
            <h1 className="font-bold text-lg">AI Speaking Grading</h1>
            <Badge variant="outline">echoic pattern</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Read Aloud</CardTitle>
            <CardDescription>
              Read the passage clearly. AI will transcribe (Whisper) and score pronunciation, fluency and content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-muted/30 p-6 leading-relaxed">
              “Climate change is one of the most pressing issues facing the world today. Governments and individuals must work together to reduce carbon emissions and protect the environment for future generations.”
            </div>

            <div className="flex flex-col items-center gap-4">
              {phase === 'idle' && (
                <button onClick={start} className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90">
                  <Mic className="w-7 h-7" />
                </button>
              )}
              {phase === 'recording' && (
                <button onClick={stop} className="w-16 h-16 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg animate-pulse">
                  <Square className="w-6 h-6" />
                </button>
              )}
              {(phase === 'recorded' || phase === 'grading') && (
                <div className="flex items-center gap-3">
                  <button disabled className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Play className="w-6 h-6" />
                  </button>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {phase === 'idle' && 'Click the mic to start recording'}
                {phase === 'recording' && `Recording... ${formatTime(seconds)}`}
                {phase === 'recorded' && !isLoading && `Recorded ${formatTime(seconds)}`}
                {phase === 'recorded' && isLoading && 'AI is transcribing and grading...'}
              </p>
              {phase === 'recorded' && !graded && (
                <Button onClick={grade} disabled={isLoading} className="gap-2">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                  {isLoading ? 'AI is grading...' : 'Grade with AI'}
                </Button>
              )}
              {phase === 'recorded' && (
                <Button variant="outline" onClick={() => { setPhase('idle'); setSeconds(0); setGraded(false); setIsLoading(false) }} className="gap-2">
                  <RotateCcw className="w-4 h-4" /> Re-record
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {graded && (
          <Card>
            <CardHeader>
              <CardTitle>AI Speaking Feedback</CardTitle>
              <CardDescription>Transcript + score breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg border p-4 bg-muted/20 text-sm">
                <p className="font-medium mb-1">Transcript</p>
                <p className="text-muted-foreground">{transcript}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Overall</span>
                <span className="text-3xl font-bold">{overall}/90</span>
              </div>
              <Progress value={(overall / 90) * 100} className="h-3" />

              <div className="grid gap-4 sm:grid-cols-2">
                {criteria.map((c) => (
                  <div key={c.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{c.label}</span>
                      <span className="font-medium">{c.score}</span>
                    </div>
                    <Progress value={(c.score / 90) * 100} />
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>Phát âm tổng thể tốt, một số nguyên âm dài chưa chuẩn.</p>
                <p>Cần giảm tốc độ ở những câu dài để fluency cao hơn.</p>
                <p>Nội dung đọc đủ và chính xác.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
