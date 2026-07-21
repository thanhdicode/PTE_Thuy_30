import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Admin - PTE Talents',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAdmin()

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-lg">
              PTE Talents Admin
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-muted-foreground hover:text-foreground">
                Users
              </Link>
              <Link href="/admin/questions" className="text-muted-foreground hover:text-foreground">
                Questions
              </Link>
              <Link href="/admin/payments" className="text-muted-foreground hover:text-foreground">
                Payments
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{user.email}</span>
            <Link href="/pte/dashboard">
              <Button variant="outline" size="sm">
                Exit Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
