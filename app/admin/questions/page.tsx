import { requireAdmin } from '@/lib/admin/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const questionSections = [
  { label: 'Speaking', href: '/pte/academic/practice/speaking/read-aloud' },
  { label: 'Writing', href: '/pte/academic/practice/writing' },
  { label: 'Reading', href: '/pte/academic/practice/reading' },
  { label: 'Listening', href: '/pte/academic/practice/reading' }, // TODO: listening route
]

export default async function AdminQuestionsPage() {
  await requireAdmin()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Question Bank</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {questionSections.map((section) => (
          <Card key={section.label} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{section.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={section.href}
                className="text-primary hover:underline"
              >
                Manage {section.label.toLowerCase()} questions →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-muted-foreground text-sm mt-6">
        Full question CRUD will be added here. For now, use the practice pages to
        preview existing questions and seed JSON files under{' '}
        <code className="bg-muted px-1 rounded">lib/db/seeds</code> to add data.
      </p>
    </div>
  )
}
