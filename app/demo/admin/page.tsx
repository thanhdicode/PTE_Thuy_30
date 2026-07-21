'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Plus, Upload, Trash2, Edit, CreditCard, BookOpen, Users, Package } from 'lucide-react'

const users = [
  { id: 1, name: 'Minh Nguyen', email: 'minh@example.com', role: 'student', plan: 'Premium', active: true },
  { id: 2, name: 'Lan Tran', email: 'lan@example.com', role: 'student', plan: 'Free', active: true },
  { id: 3, name: 'Admin', email: 'admin@ptetalents.vn', role: 'superadmin', plan: '-', active: true },
]

const questions = [
  { id: 1, section: 'Speaking', type: 'Read Aloud', title: 'Climate change passage', difficulty: 'Medium', status: 'Active' },
  { id: 2, section: 'Writing', type: 'Write Essay', title: 'Study abroad essay', difficulty: 'Hard', status: 'Active' },
  { id: 3, section: 'Reading', type: 'MCQ Single', title: 'Internet history', difficulty: 'Easy', status: 'Draft' },
]

const payments = [
  { id: 'P001', user: 'Minh Nguyen', amount: 990000, gateway: 'VNPay', status: 'Paid', date: '21/07' },
  { id: 'P002', user: 'Lan Tran', amount: 2990000, gateway: 'Momo', status: 'Pending', date: '20/07' },
]

const packages = [
  { name: 'Free', days: '-', price: 0, features: 'Limited practice' },
  { name: 'Basic', days: 30, price: 299000, features: 'Full practice' },
  { name: 'Premium', days: 90, price: 799000, features: '+ AI grading' },
  { name: 'VIP', days: 365, price: 2499000, features: 'All + priority support' },
]

export default function DemoAdminPage() {
  const [search, setSearch] = useState('')
  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/demo">← Demo hub</a>
            </Button>
            <h1 className="font-bold text-lg">Admin CMS</h1>
            <Badge variant="outline">shadcn-admin-kit pattern</Badge>
          </div>
          <div className="text-sm text-muted-foreground">Super Admin</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="users" className="gap-2"><Users className="w-4 h-4" /> Users</TabsTrigger>
            <TabsTrigger value="questions" className="gap-2"><BookOpen className="w-4 h-4" /> Questions</TabsTrigger>
            <TabsTrigger value="payments" className="gap-2"><CreditCard className="w-4 h-4" /> Payments</TabsTrigger>
            <TabsTrigger value="packages" className="gap-2"><Package className="w-4 h-4" /> Packages</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Student management</CardTitle>
                <CardDescription>CRUD, roles, activation, subscription.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map(u => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                        <TableCell>{u.plan}</TableCell>
                        <TableCell>{u.active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</TableCell>
                        <TableCell className="flex gap-2"><Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button><Button size="sm" variant="ghost"><Trash2 className="w-4 h-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Question bank</CardTitle>
                <CardDescription>Add/edit/hide/publish, media upload, bulk CSV import.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search questions..." className="pl-9" />
                  </div>
                  <Button className="gap-2"><Plus className="w-4 h-4" /> Add</Button>
                  <Button variant="outline" className="gap-2"><Upload className="w-4 h-4" /> CSV</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Section</TableHead><TableHead>Type</TableHead><TableHead>Title</TableHead><TableHead>Difficulty</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map(q => (
                      <TableRow key={q.id}>
                        <TableCell>{q.section}</TableCell>
                        <TableCell>{q.type}</TableCell>
                        <TableCell className="font-medium">{q.title}</TableCell>
                        <TableCell>{q.difficulty}</TableCell>
                        <TableCell><Badge variant={q.status === 'Active' ? 'default' : 'secondary'}>{q.status}</Badge></TableCell>
                        <TableCell className="flex gap-2"><Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button><Button size="sm" variant="ghost"><Trash2 className="w-4 h-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Orders & revenue</CardTitle>
                <CardDescription>Manage transactions, manual activation, e-invoice.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>ID</TableHead><TableHead>User</TableHead><TableHead>Amount</TableHead><TableHead>Gateway</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.id}</TableCell>
                        <TableCell>{p.user}</TableCell>
                        <TableCell>{new Intl.NumberFormat('vi-VN').format(p.amount)}₫</TableCell>
                        <TableCell>{p.gateway}</TableCell>
                        <TableCell><Badge variant={p.status === 'Paid' ? 'default' : 'secondary'}>{p.status}</Badge></TableCell>
                        <TableCell>{p.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle>Subscription packages</CardTitle>
                <CardDescription>Free/Basic/Premium/VIP with 30/90/365 days.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Name</TableHead><TableHead>Duration</TableHead><TableHead>Price</TableHead><TableHead>Features</TableHead><TableHead>Action</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {packages.map(p => (
                      <TableRow key={p.name}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.days}</TableCell>
                        <TableCell>{p.price === 0 ? 'Free' : new Intl.NumberFormat('vi-VN').format(p.price) + '₫'}</TableCell>
                        <TableCell>{p.features}</TableCell>
                        <TableCell><Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
