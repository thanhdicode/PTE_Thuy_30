'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mic, Headphones, BookOpen, PenTool, Clock, Maximize, RotateCcw } from 'lucide-react'

const sections = ['Speaking', 'Writing', 'Reading', 'Listening'] as const

interface DemoQuestion {
  id: string
  section: (typeof sections)[number]
  type: string
  prompt: string
  duration: number
  options?: string[]
}

const DEMO_QUESTIONS: DemoQuestion[] = [
  { id: 's1', section: 'Speaking', type: 'Read Aloud', prompt: 'Read this passage aloud clearly and at a natural pace.\n\n“Climate change is one of the most pressing issues facing the world today. Governments and individuals must work together to reduce carbon emissions.”', duration: 40 },
  { id: 's2', section: 'Speaking', type: 'Repeat Sentence', prompt: 'You will hear a sentence. Please repeat the sentence exactly as you hear it.', duration: 15 },
  { id: 's3', section: 'Speaking', type: 'Describe Image', prompt: 'Describe the image in detail. The chart shows monthly sales increasing from January to June.', duration: 40 },
  { id: 'w1', section: 'Writing', type: 'Summarize Written Text', prompt: 'Summarize the following text in one sentence (5-75 words).\n\n“Renewable energy sources such as solar and wind are becoming cheaper and more reliable. Many countries are investing in clean energy to reduce pollution.”', duration: 600 },
  { id: 'w2', section: 'Writing', type: 'Write Essay', prompt: 'Write an essay (200-300 words) on the following topic:\n\n“Do the benefits of studying abroad outweigh the drawbacks?”', duration: 1200 },
  { id: 'r1', section: 'Reading', type: 'Multiple Choice', prompt: 'Choose the correct answer.\n\nWhat is the main idea of the passage?', options: ['A. The history of the internet', 'B. The impact of social media', 'C. The future of AI', 'D. The economy'], duration: 120 },
  { id: 'r2', section: 'Reading', type: 'Fill in the Blanks', prompt: 'Drag the correct word into each blank.\n\n“The company ___ (announced/annoyed) a new product ___ (launch/lunch) next month.”', duration: 120 },
  { id: 'l1', section: 'Listening', type: 'Summarize Spoken Text', prompt: 'You will hear a short lecture. Summarize it in one sentence.', duration: 600 },
  { id: 'l2', section: 'Listening', type: 'Write from Dictation', prompt: 'Type the sentence you hear.', duration: 120 },
]

export default function DemoMockTestPage() {
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [index, setIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [tabSwitches, setTabSwitches] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleNext = useCallback(() => {
    setIndex((i) => {
      if (i < DEMO_QUESTIONS.length - 1) {
        return i + 1
      }
      setFinished(true)
      return i
    })
  }, [])

  useEffect(() => {
    if (!started || finished) return
    const duration = DEMO_QUESTIONS[index].duration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(duration)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const onVisibility = () => {
      if (document.hidden) {
        setTabSwitches((c) => c + 1)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', onKey)
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [started, finished, index, handleNext])

  const start = () => {
    setStarted(true)
    setFinished(false)
    setIndex(0)
    setTimeLeft(DEMO_QUESTIONS[0].duration)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true))
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false))
    }
  }

  const current = DEMO_QUESTIONS[index]

  const iconMap = {
    Speaking: Mic,
    Writing: PenTool,
    Reading: BookOpen,
    Listening: Headphones,
  }
  const SectionIcon = iconMap[current.section]

  if (finished) {
    const sectionScores = { Speaking: 70, Writing: 75, Reading: 73, Listening: 70 }
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Mock Test Completed</CardTitle>
            <CardDescription>Demo result — backend AI scoring will be integrated in build week 4.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Estimated Overall</p>
                <p className="text-3xl font-bold">72</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Tab switches detected</p>
                <p className="text-3xl font-bold">{tabSwitches}</p>
              </div>
            </div>
            <div className="space-y-2">
              {sections.map((s) => (
                <div key={s} className="flex items-center justify-between text-sm">
                  <span>{s}</span>
                  <span className="font-medium">{sectionScores[s]}/90</span>
                </div>
              ))}
            </div>
            <Button onClick={() => { setStarted(false); setFinished(false); setAnswers({}); setTabSwitches(0) }} className="w-full gap-2">
              <RotateCcw className="w-4 h-4" /> Retake demo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">PTE Academic Full Mock Test</CardTitle>
            <CardDescription>Thứ tự: Speaking → Writing → Reading → Listening. Timer server-side, autosave, anti-cheat.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border p-3"><strong>9</strong> demo questions</div>
              <div className="rounded-lg border p-3"><strong>~30</strong> minutes estimated</div>
              <div className="rounded-lg border p-3">Auto-submit khi hết giờ</div>
              <div className="rounded-lg border p-3">Cảnh báo khi chuyển tab</div>
            </div>
            <Button onClick={start} className="w-full">Start Demo Mock Test</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progress = ((index) / DEMO_QUESTIONS.length) * 100
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="bg-background border-b px-4 h-14 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <SectionIcon className="w-5 h-5 text-primary" />
          <span className="font-semibold">{current.section}</span>
          <Badge variant="outline">{current.type}</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 font-mono text-lg ${timeLeft <= 10 ? 'text-destructive' : ''}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          <Button variant="outline" size="sm" onClick={toggleFullscreen} className="gap-2">
            <Maximize className="w-4 h-4" /> Fullscreen
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <Progress value={progress} className="mb-4" />

        {tabSwitches > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>Cảnh báo anti-cheat: bạn đã chuyển tab {tabSwitches} lần.</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Question {index + 1} of {DEMO_QUESTIONS.length}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-6 whitespace-pre-line">
              {current.prompt}
            </div>

            {current.options ? (
              <div className="space-y-2">
                {current.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers((a) => ({ ...a, [current.id]: opt }))}
                    className={`w-full text-left rounded-lg border p-3 transition-colors ${answers[current.id] === opt ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full min-h-[160px] rounded-md border p-3 bg-background"
                placeholder="Type your answer here..."
                value={answers[current.id] || ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [current.id]: e.target.value }))}
              />
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>Previous</Button>
              <Button onClick={handleNext}>
                {index === DEMO_QUESTIONS.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
