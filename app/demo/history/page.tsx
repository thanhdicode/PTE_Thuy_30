'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { Calendar, Filter, RotateCcw, TrendingUp } from 'lucide-react'

const attempts = [
  { id: 1, type: 'Mock Test 1', date: '21/07', overall: 72, reading: 70, writing: 75, listening: 70, speaking: 70, status: 'Completed' },
  { id: 2, type: 'Read Aloud', date: '20/07', overall: 68, reading: '-', writing: '-', listening: '-', speaking: 68, status: 'Completed' },
  { id: 3, type: 'Write Essay', date: '19/07', overall: 74, reading: '-', writing: 74, listening: '-', speaking: '-', status: 'Completed' },
  { id: 4, type: 'Mock Test 2', date: '14/07', overall: 68, reading: 70, writing: 70, listening: 67, speaking: 65, status: 'Reviewed' },
  { id: 5, type: 'Listening WFD', date: '13/07', overall: 80, reading: '-', writing: '-', listening: 80, speaking: '-', status: 'Completed' },
]

const weakness = [
  { skill: 'Speaking', score: 68, fullMark: 90 },
  { skill: 'Writing', score: 74, fullMark: 90 },
  { skill: 'Reading', score: 70, fullMark: 90 },
  { skill: 'Listening', score: 73, fullMark: 90 },
]

const monthly = [
  { month: 'Jun', score: 58 },
  { month: 'Jul', score: 68 },
  { month: 'Aug', score: 72 },
]

export default function DemoHistoryPage() {
  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/demo">← Demo hub</a>
            </Button>
            <h1 className="font-bold text-lg">History & Progress</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" /> Last 30 days
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Overall progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 90]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weakness analysis</CardTitle>
              <CardDescription>Skill radar so với target 79</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={weakness}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={30} domain={[0, 90]} />
                    <Radar name="Current" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attempt history</CardTitle>
            <CardDescription>Filter by week/month/course, resume unfinished sessions, compare history.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Overall</TableHead>
                  <TableHead>R</TableHead>
                  <TableHead>W</TableHead>
                  <TableHead>L</TableHead>
                  <TableHead>S</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.type}</TableCell>
                    <TableCell>{a.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{a.overall}</span>
                        <Progress value={(a.overall / 90) * 100} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{a.reading}</TableCell>
                    <TableCell>{a.writing}</TableCell>
                    <TableCell>{a.listening}</TableCell>
                    <TableCell>{a.speaking}</TableCell>
                    <TableCell><Badge variant="secondary">{a.status}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <RotateCcw className="w-3 h-3" /> Retry
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
