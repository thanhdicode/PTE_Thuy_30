import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })

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
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user?.role === 'admin'
  } catch {
    return false
  }
}
