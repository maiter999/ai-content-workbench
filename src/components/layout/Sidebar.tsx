'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

// 第一部分：品牌区（Logo）
const brandSection = {
  href: '/dashboard',
  label: '豹纹工坊',
  subtitle: '多平台内容生成',
  icon: '/logo.png'
}

// 第二部分：内容创作工具
const contentTools = [
  { href: '/hot-content', label: '爆文排行榜', icon: '🔥' },
  { href: '/one-click', label: 'AI一键生成', icon: '⚡' },
  { href: '/wechat', label: '公众号文章', icon: '📰' },
  { href: '/xiaohongshu', label: '小红书图文', icon: '📕' },
  { href: '/rewrite', label: '爆文速改写', icon: '✏️' },
  { href: '/generate-image', label: 'AI图片生成', icon: '🎨' },
  { href: '/knowledge', label: '专业知识库', icon: '📚' },
]

// 第三部分：账号运营管理
const accountManagement = [
  { href: '/social-media/accounts', label: '账号管理', icon: '📱' },
  { href: '/social-media/comments', label: '评论管理', icon: '💬' },
  { href: '/social-media/publish', label: '图文群发', icon: '🚀' },
  { href: '/social-media/data', label: '数据统计', icon: '📊' },
]

// 第四部分：个人中心
const personalCenter = [
  { href: '/account', label: '我的账号', icon: '💰' },
  { href: '/agent', label: '代理后台', icon: '🤝' },
]

// 通用导航项渲染组件
function NavItem({ item }: { item: { href: string; label: string; icon: string } }) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition',
        isActive
          ? 'bg-purple-50 text-purple-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <span>{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  )
}

// 分区标题组件
function SectionTitle({ title }: { title: string }) {
  return (
    <div className="px-4 py-2">
      <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">
        {title}
      </span>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* 第一部分：品牌区 */}
      <div className="p-5 border-b border-gray-200">
        <Link href={brandSection.href} className="flex items-center gap-3">
          <img src={brandSection.icon} alt={brandSection.label} className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <h1 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              {brandSection.label}
              <span className="text-xs font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">V2.1</span>
            </h1>
            <p className="text-xs text-gray-500">{brandSection.subtitle}</p>
          </div>
        </Link>
      </div>

      {/* 导航内容区 */}
      <div className="overflow-y-auto py-2">
        {/* 内容创作工具 */}
        <SectionTitle title="内容创作" />
        <div className="px-3 space-y-0.5">
          {contentTools.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>

        {/* 在专业知识库下方留适当空白 */}
        <div className="mb-2"></div>

        {/* 分隔线 */}
        <div className="mx-4 border-t border-gray-200 my-3" />

        {/* 账号运营管理 */}
        <SectionTitle title="账号运营" />
        <div className="px-3 space-y-0.5">
          {accountManagement.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </div>

      {/* 底部固定区：个人中心 */}
      <div className="border-t border-gray-200 p-3">
        <SectionTitle title="个人中心" />
        <div className="px-3 space-y-0.5">
          {personalCenter.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </div>
    </aside>
  )
}
