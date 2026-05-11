'use client'

import { useState } from 'react'

const inviteCodes = [
  { id: '1', code: 'ABC123', used: 45, total: 50, rate: '90%', createdAt: '2024-01-10' },
  { id: '2', code: 'DEF456', used: 28, total: 50, rate: '56%', createdAt: '2024-01-12' },
  { id: '3', code: 'GHI789', used: 12, total: 50, rate: '24%', createdAt: '2024-01-14' },
]

const users = [
  { id: '1', name: '张三', phone: '138****1234', invitedBy: 'ABC123', registerTime: '2024-01-15', status: 'active' },
  { id: '2', name: '李四', phone: '139****5678', invitedBy: 'ABC123', registerTime: '2024-01-15', status: 'active' },
  { id: '3', name: '王五', phone: '137****9012', invitedBy: 'DEF456', registerTime: '2024-01-14', status: 'active' },
  { id: '4', name: '赵六', phone: '136****3456', invitedBy: 'DEF456', registerTime: '2024-01-13', status: 'inactive' },
  { id: '5', name: '钱七', phone: '135****7890', invitedBy: 'GHI789', registerTime: '2024-01-12', status: 'active' },
]

const promotionalMaterials = [
  { id: '1', name: '朋友圈分享图', type: '图片', size: '2.5MB', preview: '🖼️' },
  { id: '2', name: '海报模板', type: 'PSD', size: '15MB', preview: '🎨' },
  { id: '3', name: '文案素材', type: 'TXT', size: '50KB', preview: '📝' },
  { id: '4', name: '推广链接', type: '链接', size: '-', preview: '🔗' },
]

export default function AgentPage() {
  const [activeTab, setActiveTab] = useState('invite')
  const [newCodeCount, setNewCodeCount] = useState(10)

  const tabs = [
    { id: 'invite', label: '邀请码管理' },
    { id: 'users', label: '我的用户' },
    { id: 'materials', label: '推广物料' },
    { id: 'earnings', label: '收益统计' },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">代理后台</h1>
            <p className="text-gray-600 mt-1">管理邀请码、查看用户、下载推广物料</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-lg">
            <span className="text-sm">累计收益</span>
            <span className="font-bold text-xl ml-2">¥1,280</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-sm text-gray-500 mb-1">邀请码总数</div>
          <div className="text-2xl font-bold text-gray-900">150</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-sm text-gray-500 mb-1">已使用</div>
          <div className="text-2xl font-bold text-purple-600">85</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-sm text-gray-500 mb-1">注册用户</div>
          <div className="text-2xl font-bold text-green-600">128</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-sm text-gray-500 mb-1">本月新增</div>
          <div className="text-2xl font-bold text-blue-600">23</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Invite Codes Tab */}
          {activeTab === 'invite' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">生成数量</label>
                    <input
                      type="number"
                      value={newCodeCount}
                      onChange={(e) => setNewCodeCount(parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                      min="1"
                      max="100"
                    />
                  </div>
                  <button className="mt-5 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                    生成邀请码
                  </button>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  导出全部
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 border-b">
                      <th className="pb-3 font-medium">邀请码</th>
                      <th className="pb-3 font-medium">已使用/总数</th>
                      <th className="pb-3 font-medium">使用率</th>
                      <th className="pb-3 font-medium">创建时间</th>
                      <th className="pb-3 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inviteCodes.map((code) => (
                      <tr key={code.id} className="border-b border-gray-100">
                        <td className="py-4">
                          <span className="font-mono font-bold text-purple-600">{code.code}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span>{code.used}/{code.total}</span>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: code.rate }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-green-600 font-medium">{code.rate}</span>
                        </td>
                        <td className="py-4 text-gray-500">{code.createdAt}</td>
                        <td className="py-4">
                          <button className="text-purple-600 hover:text-purple-800">复制链接</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="搜索用户名或手机号"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-64"
                  />
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>全部状态</option>
                    <option>活跃</option>
                    <option>不活跃</option>
                  </select>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  导出用户
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 border-b">
                      <th className="pb-3 font-medium">用户</th>
                      <th className="pb-3 font-medium">手机号</th>
                      <th className="pb-3 font-medium">邀请码</th>
                      <th className="pb-3 font-medium">注册时间</th>
                      <th className="pb-3 font-medium">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-4 font-medium text-gray-900">{user.name}</td>
                        <td className="py-4 text-gray-500">{user.phone}</td>
                        <td className="py-4">
                          <span className="font-mono text-purple-600">{user.invitedBy}</span>
                        </td>
                        <td className="py-4 text-gray-500">{user.registerTime}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {user.status === 'active' ? '活跃' : '不活跃'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div>
              <p className="text-gray-600 mb-6">下载推广物料，分享给好友</p>
              <div className="grid grid-cols-2 gap-4">
                {promotionalMaterials.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-400 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{item.preview}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.type} · {item.size}</p>
                      </div>
                      <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200">
                        下载
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-purple-600 mb-1">累计收益</div>
                  <div className="text-2xl font-bold text-purple-700">¥1,280</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-600 mb-1">本月收益</div>
                  <div className="text-2xl font-bold text-green-700">¥450</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600 mb-1">待结算</div>
                  <div className="text-2xl font-bold text-blue-700">¥180</div>
                </div>
              </div>
              <p className="text-gray-500 text-center py-12">
                收益明细图表将在此处显示
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
