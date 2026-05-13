import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  
  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error('Failed to get user:', error)
  }

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
