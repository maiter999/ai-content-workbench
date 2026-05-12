'use client'

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ 设置</h1>

      <div className="bg-white rounded-xl p-6 space-y-6 max-w-xl">
        <div>
          <h2 className="font-semibold mb-4">个人信息</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">邮箱</label>
              <input type="email" placeholder="your@email.com" className="w-full mt-1 px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-gray-500">密码</label>
              <input type="password" placeholder="••••••••" className="w-full mt-1 px-4 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-4">AI设置</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">默认模型</label>
              <select className="w-full mt-1 px-4 py-2 border rounded-lg">
                <option>DeepSeek (推荐)</option>
                <option>通义千问</option>
                <option>文心一言</option>
              </select>
            </div>
          </div>
        </div>

        <button className="w-full py-3 bg-purple-600 text-white rounded-lg">
          保存设置
        </button>
      </div>
    </div>
  )
}
