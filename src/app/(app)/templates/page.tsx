import Link from 'next/link'

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">模板中心</h1>
        <p className="text-gray-600 mt-1">使用模板快速生成内容</p>
      </div>

      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
        <span className="text-6xl">📋</span>
        <h3 className="text-xl font-medium text-gray-900 mt-4">模板功能开发中</h3>
        <p className="text-gray-500 mt-2">
          我们正在为你准备丰富的模板库，敬请期待
        </p>
        <Link
          href="/generate"
          className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
        >
          去生成内容
        </Link>
      </div>
    </div>
  )
}
