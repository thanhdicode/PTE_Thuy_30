import { db } from '@/lib/db/drizzle'
import { paymentTransactions, users } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/admin/auth'
import { desc, eq } from 'drizzle-orm'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function AdminPaymentsPage() {
  await requireAdmin()

  const payments = await db
    .select({
      id: paymentTransactions.id,
      orderId: paymentTransactions.orderId,
      email: users.email,
      tier: paymentTransactions.tier,
      gateway: paymentTransactions.gateway,
      amount: paymentTransactions.amount,
      status: paymentTransactions.status,
      createdAt: paymentTransactions.createdAt,
    })
    .from(paymentTransactions)
    .leftJoin(users, eq(paymentTransactions.userId, users.id))
    .orderBy(desc(paymentTransactions.createdAt))
    .limit(100)

  const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'outline',
    paid: 'default',
    cancelled: 'secondary',
    failed: 'destructive',
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.orderId}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell className="capitalize">{p.tier}</TableCell>
                  <TableCell className="uppercase">{p.gateway}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN').format(p.amount || 0)}đ
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[p.status || 'pending']}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString('vi-VN')
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
