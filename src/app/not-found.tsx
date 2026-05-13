export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">页面未找到</h2>
        <p className="text-gray-600 mb-4">抱歉，您访问的页面不存在。</p>
        <a
          href="/"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-block"
        >
          返回首页
        </a>
      </div>
    </div>
  )
}
