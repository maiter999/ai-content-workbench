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
      {/* PC 端侧边栏：只在 md 及以上屏幕显示 */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        {/* 移动端：底部多留 64px 给底部导航栏 */}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
