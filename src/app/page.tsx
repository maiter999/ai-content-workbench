import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📝</span>
          <span className="font-bold text-xl text-gray-900">豹纹工坊</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition"
          >
            登录
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
          >
            免费开始
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          一个主题，<br />
          <span className="text-purple-600">多平台</span>同时出稿
        </h1>
        <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
          告别繁琐的跨平台内容适配。输入一个主题，AI自动生成适配小红书、公众号、朋友圈、抖音等多个平台的内容。
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition text-lg shadow-lg shadow-purple-200"
          >
            立即免费开始 →
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition text-lg border border-gray-200"
          >
            已有账号？登录
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          为什么选择豹纹工坊？
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: '极速生成',
              desc: '几分钟内完成多平台内容创作，告别熬夜写稿'
            },
            {
              icon: '🎯',
              title: '平台适配',
              desc: 'AI 智能适配各平台风格，小红书更口语化，公众号更专业'
            },
            {
              icon: '💡',
              title: '创意激发',
              desc: '不知道写什么？AI 帮你头脑风暴，提供灵感'
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <span className="text-4xl">{feature.icon}</span>
              <h3 className="text-xl font-bold text-gray-900 mt-4">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            支持的主流平台
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: '📕', name: '小红书', color: 'text-pink-600' },
              { icon: '📰', name: '公众号', color: 'text-green-600' },
              { icon: '💬', name: '朋友圈', color: 'text-green-500' },
              { icon: '🎵', name: '抖音', color: 'text-gray-900' },
            ].map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm"
              >
                <span className="text-2xl">{platform.icon}</span>
                <span className="font-medium text-gray-700">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          准备好提升你的内容创作效率了吗？
        </h2>
        <p className="text-gray-600 mb-8">
          注册即送 100 积分，可生成多篇内容
        </p>
        <Link
          href="/register"
          className="inline-block px-10 py-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition text-lg"
        >
          立即免费开始
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <span className="font-medium text-gray-700">豹纹工坊</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 豹纹工坊. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
