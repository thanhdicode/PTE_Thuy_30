import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

interface UserWithRole {
  id: string
  email?: string | null
  name?: string | null
  image?: string | null
  role?: string | null
}

export async function requireAdmin() {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as { user?: UserWithRole | null } | null

  if (!session?.user) {
    redirect('/sign-in')
  }

  if (session.user.role !== 'admin') {
    redirect('/pte/dashboard')
  }

  return session.user
}

export async function isAdmin(): Promise<boolean> {
  try {
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as { user?: UserWithRole | null } | null
    return session?.user?.role === 'admin'
  } catch {
    return false
  }
}
