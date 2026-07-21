import { db } from '@/lib/db/drizzle'
import { paymentTransactions, users } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/admin/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sql } from 'drizzle-orm'

export default async function AdminDashboardPage() {
  await requireAdmin()

  const [userCount, paymentStats] = await Promise.all([
    db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(users),
    db
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
        paid: sql<number>`count(*) filter (where status = 'paid')`.mapWith(Number),
        revenue: sql<number>`coalesce(sum(amount) filter (where status = 'paid'), 0)`.mapWith(Number),
      })
      .from(paymentTransactions),
  ])

  const totalUsers = userCount[0]?.count ?? 0
  const totalPayments = paymentStats[0]?.total ?? 0
  const paidPayments = paymentStats[0]?.paid ?? 0
  const revenue = paymentStats[0]?.revenue ?? 0

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{paidPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue (VND)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(revenue)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
