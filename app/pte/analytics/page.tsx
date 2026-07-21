import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/server'
import { db } from '@/lib/db/drizzle'
import {
  listeningAttempts,
  readingAttempts,
  speakingAttempts,
  writingAttempts,
} from '@/lib/db/schema'
import { and, gte, sql } from 'drizzle-orm'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

const SCORE_RANGES = [
  { label: 'Excellent', min: 80, color: 'bg-green-100 text-green-800' },
  { label: 'Good', min: 65, color: 'bg-blue-100 text-blue-800' },
  { label: 'Average', min: 50, color: 'bg-yellow-100 text-yellow-800' },
  { label: 'Needs Practice', min: 0, color: 'bg-red-100 text-red-800' },
]

function scoreLabel(score: number) {
  return SCORE_RANGES.find((r) => score >= r.min) || SCORE_RANGES[3]
}

async function getAnalytics(userId: string) {
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

  const [speaking, writing, reading, listening] = await Promise.all([
    db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
        avg: sql<number>`coalesce(avg(overall_score), 0)`.mapWith(Number),
        best: sql<number>`coalesce(max(overall_score), 0)`.mapWith(Number),
      })
      .from(speakingAttempts)
      .where(
        and(
          sql`${speakingAttempts.userId} = ${userId}`,
          gte(speakingAttempts.createdAt, since)
        )
      ),
    db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
        avg: sql<number>`coalesce(avg(overall_score), 0)`.mapWith(Number),
        best: sql<number>`coalesce(max(overall_score), 0)`.mapWith(Number),
      })
      .from(writingAttempts)
      .where(
        and(
          sql`${writingAttempts.userId} = ${userId}`,
          gte(writingAttempts.createdAt, since)
        )
      ),
    db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
        avg: sql<number>`coalesce(avg(score), 0)`.mapWith(Number),
        best: sql<number>`coalesce(max(score), 0)`.mapWith(Number),
      })
      .from(readingAttempts)
      .where(
        and(
          sql`${readingAttempts.userId} = ${userId}`,
          gte(readingAttempts.createdAt, since)
        )
      ),
    db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
        avg: sql<number>`coalesce(avg(score), 0)`.mapWith(Number),
        best: sql<number>`coalesce(max(score), 0)`.mapWith(Number),
      })
      .from(listeningAttempts)
      .where(
        and(
          sql`${listeningAttempts.userId} = ${userId}`,
          gte(listeningAttempts.createdAt, since)
        )
      ),
  ])

  const recentAttempts = await Promise.all([
    db
      .select({
        type: sql<string>`'Speaking'`,
        score: speakingAttempts.overallScore,
        createdAt: speakingAttempts.createdAt,
      })
      .from(speakingAttempts)
      .where(sql`${speakingAttempts.userId} = ${userId}`)
      .orderBy(sql`${speakingAttempts.createdAt} desc`)
      .limit(5),
    db
      .select({
        type: sql<string>`'Writing'`,
        score: writingAttempts.overallScore,
        createdAt: writingAttempts.createdAt,
      })
      .from(writingAttempts)
      .where(sql`${writingAttempts.userId} = ${userId}`)
      .orderBy(sql`${writingAttempts.createdAt} desc`)
      .limit(5),
    db
      .select({
        type: sql<string>`'Reading'`,
        score: readingAttempts.score,
        createdAt: readingAttempts.createdAt,
      })
      .from(readingAttempts)
      .where(sql`${readingAttempts.userId} = ${userId}`)
      .orderBy(sql`${readingAttempts.createdAt} desc`)
      .limit(5),
    db
      .select({
        type: sql<string>`'Listening'`,
        score: listeningAttempts.score,
        createdAt: listeningAttempts.createdAt,
      })
      .from(listeningAttempts)
      .where(sql`${listeningAttempts.userId} = ${userId}`)
      .orderBy(sql`${listeningAttempts.createdAt} desc`)
      .limit(5),
  ])

  const recent = recentAttempts
    .flat()
    .filter((a) => a.createdAt)
    .sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    )
    .slice(0, 10)

  const stats = [
    { skill: 'Speaking', ...speaking[0] },
    { skill: 'Writing', ...writing[0] },
    { skill: 'Reading', ...reading[0] },
    { skill: 'Listening', ...listening[0] },
  ]

  const overallAvg =
    stats.reduce((acc, s) => acc + (s.avg || 0), 0) / (stats.length || 1)

  return {
    stats,
    overallAvg: Math.round(overallAvg),
    recent,
    totalAttempts: stats.reduce((acc, s) => acc + (s.count || 0), 0),
  }
}

export default async function AnalyticsPage() {
  const session = await getSession()
  if (!session?.user?.id) {
    redirect('/sign-in')
  }

  const { stats, overallAvg, recent, totalAttempts } = await getAnalytics(
    session.user.id
  )

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Performance</h1>
        <p className="text-muted-foreground">
          Real stats from your PTE practice attempts (last 90 days)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overallAvg}/90</div>
            <p className="text-sm text-muted-foreground">
              Average across all skills
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAttempts}</div>
            <p className="text-sm text-muted-foreground">
              In the last 90 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skills Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-sm text-muted-foreground">
              Speaking, Writing, Reading, Listening
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.skill}>
            <CardHeader>
              <CardTitle className="text-base">{s.skill}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg</span>
                <span className="font-semibold">{Math.round(s.avg || 0)}/90</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best</span>
                <span className="font-semibold">{Math.round(s.best || 0)}/90</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attempts</span>
                <span className="font-semibold">{s.count}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {recent.length === 0 && (
              <p className="text-muted-foreground py-4">
                No attempts yet. Start practicing to see your progress.
              </p>
            )}
            {recent.map((attempt, idx) => {
              const score = attempt.score ?? 0
              const label = scoreLabel(score)
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{attempt.type}</span>
                    <span className="text-sm text-muted-foreground">
                      {attempt.createdAt
                        ? format(new Date(attempt.createdAt), 'MMM d, yyyy HH:mm')
                        : '-'}
                    </span>
                  </div>
                  <Badge className={label.color}>{score}/90</Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
