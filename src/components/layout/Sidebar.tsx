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
function NavItem({ item, onClick }: { item: { href: string; label: string; icon: string }; onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <Link
      key={item.href}
      href={item.href}
      onClick={onClick}
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

// PC 端侧边栏（桌面端显示）
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

        <div className="mb-2"></div>
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

// 移动端抽屉式侧边栏
export function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const allItems = [...contentTools, ...accountManagement, ...personalCenter]

  return (
    <>
      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* 抽屉 */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* 品牌区 + 关闭按钮 */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <Link href={brandSection.href} className="flex items-center gap-3" onClick={onClose}>
            <img src={brandSection.icon} alt={brandSection.label} className="w-9 h-9 rounded-lg object-cover" />
            <div>
              <h1 className="font-bold text-gray-900 text-base flex items-center gap-2">
                {brandSection.label}
                <span className="text-xs font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">V2.1</span>
              </h1>
              <p className="text-xs text-gray-500">{brandSection.subtitle}</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* 导航内容区 */}
        <div className="overflow-y-auto py-2 flex-1">
          <SectionTitle title="内容创作" />
          <div className="px-3 space-y-0.5">
            {contentTools.map((item) => (
              <NavItem key={item.href} item={item} onClick={onClose} />
            ))}
          </div>

          <div className="mx-4 border-t border-gray-200 my-3" />

          <SectionTitle title="账号运营" />
          <div className="px-3 space-y-0.5">
            {accountManagement.map((item) => (
              <NavItem key={item.href} item={item} onClick={onClose} />
            ))}
          </div>
        </div>

        {/* 底部：个人中心 */}
        <div className="border-t border-gray-200 p-3">
          <SectionTitle title="个人中心" />
          <div className="px-3 space-y-0.5">
            {personalCenter.map((item) => (
              <NavItem key={item.href} item={item} onClick={onClose} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// 移动端底部导航栏（快捷入口）
export function MobileBottomNav() {
  const pathname = usePathname()

  // 只显示最常用的 5 个
  const quickItems = [
    { href: '/dashboard', label: '首页', icon: '🏠' },
    { href: '/one-click', label: '一键生成', icon: '⚡' },
    { href: '/xiaohongshu', label: '小红书', icon: '📕' },
    { href: '/wechat', label: '公众号', icon: '📰' },
    { href: '/account', label: '我的', icon: '💰' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {quickItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-lg transition',
                isActive ? 'text-purple-700' : 'text-gray-500'
              )}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className={cn('text-xs font-medium', isActive ? 'text-purple-700' : 'text-gray-500')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
