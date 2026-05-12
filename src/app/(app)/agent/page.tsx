'use client'

import { useState } from 'react'
import {
  Users, Link, Copy, CheckCircle, QrCode, Download, FileText,
  UserCheck, TrendingUp, DollarSign, ShoppingCart, Plus
} from 'lucide-react'

type TabType = 'codes' | 'materials' | 'users'

// 模拟邀请码数据
const mockInviteCodes = [
  { code: 'CLAW-D7QA', status: '有效', selected: true, invited: 0, type: '永久无限使用', recharge: 0 },
  { code: 'CLAW-YGCL', status: '有效', selected: false, invited: 3, type: '永久无限使用', recharge: 0 },
  { code: 'CLAW-99AN', status: '有效', selected: false, invited: 1, type: '永久无限使用', recharge: 0 },
  { code: 'CLAW-2PBA', status: '有效', selected: false, invited: 22, type: '永久无限使用', recharge: 177.00 },
]

// 模拟用户数据
const mockUsers = [
  { name: 'baowen111', email: '132111-111@163.com', code: 'CLAW-2PBA', codeInfo: '22人 · ¥177.00充值', balance: 0, totalRecharge: 0, totalSpend: 0, registerTime: '2026/5/11' },
  { name: '李彦宏', email: '3859261449@qq.com', code: 'CLAW-YGCL', codeInfo: '3人 · ¥0.00充值', balance: 0, totalRecharge: 0, totalSpend: 0, registerTime: '2026/4/29' },
  { name: '涂油踏', email: '593441913@qq.com', code: 'CLAW-YGCL', codeInfo: '3人 · ¥0.00充值', balance: 0, totalRecharge: 0, totalSpend: 0, registerTime: '2026/4/24' },
  { name: '怀慧', email: 'liy_20260301@qq.com', code: 'CLAW-2PBA', codeInfo: '22人 · ¥177.00充值', balance: 0, totalRecharge: 0, totalSpend: 0, registerTime: '2026/4/21' },
  { name: '德芙', email: '2534590641@qq.com', code: 'CLAW-2PBA', codeInfo: '22人 · ¥177.00充值', balance: 0, totalRecharge: 0, totalSpend: 0, registerTime: '2026/4/17' },
  { name: '安俊成', email: '350137612@qq.com', code: 'CLAW-YGCL', codeInfo: '3人 · ¥0.00充值', balance: 0, totalRecharge: 0, totalSpend: 0, registerTime: '2026/4/16' },
  { name: '朋良文化', email: '355616537@qq.com', code: 'CLAW-2PBA', codeInfo: '22人 · ¥177.00充值', balance: 0, totalRecharge: 59.00, totalSpend: 60.06, registerTime: '2026/4/15' },
  { name: '有你精彩', email: '406518023@qq.com', code: 'CLAW-2PBA', codeInfo: '22人 · ¥177.00充值', balance: 0, totalRecharge: 0, totalSpend: 0, registerTime: '2026/4/13' },
  { name: '半卷小小', email: 'zz339469@126.com', code: 'CLAW-99AN', codeInfo: '1人 · ¥0.00充值', balance: 0, totalRecharge: 0, totalSpend: 0, registerTime: '2026/4/12' },
  { name: 'cnhaon', email: '', code: 'CLAW-2PBA', codeInfo: '22人 · ¥177.00充值', balance: 0, totalRecharge: 0, totalSpend: 0, registerTime: '2026/4/12' },
]

// 推广文案模板
const promoTemplates = [
  '🔥 自媒体人必备神器！AI 30秒生成爆款文案，小红书/公众号/小绿书一键搞定。覆盖19个行业，30种专属写手人设，写出来的文章完全不像AI！扫码免费体验 →',
  '还在为写文案头疼？试试这个 AI 工具，选几下就出爆文，已经帮我省了 80% 的时间。支持热点追踪+一键二创，看到爆款直接仿写。扫码注册 →',
]

export default function AgentPage() {
  const [activeTab, setActiveTab] = useState<TabType>('codes')
  const [inviteCodes, setInviteCodes] = useState(mockInviteCodes)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [copiedTemplate, setCopiedTemplate] = useState<number | null>(null)

  const selectedCode = inviteCodes.find(c => c.selected) || inviteCodes[0]

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const copyLink = (code: string) => {
    const link = `https://www.baowenclaw.com/register?code=${code}`
    navigator.clipboard.writeText(link)
    setCopiedLink(code)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const copyTemplate = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTemplate(index)
    setTimeout(() => setCopiedTemplate(null), 2000)
  }

  const selectCode = (code: string) => {
    setInviteCodes(prev => prev.map(c => ({ ...c, selected: c.code === code })))
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let newCode = 'CLAW-'
    for (let i = 0; i < 4; i++) {
      newCode += chars[Math.floor(Math.random() * chars.length)]
    }
    setInviteCodes(prev => [...prev, { code: newCode, status: '有效', selected: false, invited: 0, type: '永久无限使用', recharge: 0 }])
  }

  // 统计数据
  const totalInvited = inviteCodes.reduce((sum, c) => sum + c.invited, 0)
  const totalRecharge = inviteCodes.reduce((sum, c) => sum + c.recharge, 0)
  const totalSpend = mockUsers.reduce((sum, u) => sum + u.totalSpend, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-5">
        {/* 标题 */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">代理后台</h1>
          <p className="text-sm text-gray-500 mt-1">邀请码管理 · 推广物料 · 用户数据</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">邀请人数</p>
            <p className="text-2xl font-bold text-gray-900">{totalInvited}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">用户总充值</p>
            <p className="text-2xl font-bold text-emerald-600">¥{totalRecharge.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">用户总消费</p>
            <p className="text-2xl font-bold text-amber-600">¥{totalSpend.toFixed(2)}</p>
          </div>
        </div>

        {/* Tab切换 */}
        <div className="flex gap-1 mb-5 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('codes')}
            className={`px-5 py-3 text-sm font-medium transition border-b-2 ${
              activeTab === 'codes'
                ? 'text-amber-600 border-amber-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              邀请码管理
            </div>
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-5 py-3 text-sm font-medium transition border-b-2 ${
              activeTab === 'materials'
                ? 'text-amber-600 border-amber-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              推广物料
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-3 text-sm font-medium transition border-b-2 ${
              activeTab === 'users'
                ? 'text-amber-600 border-amber-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              我的用户
            </div>
          </button>
        </div>

        {/* 邀请码管理 */}
        {activeTab === 'codes' && (
          <div>
            {/* 生成按钮 */}
            <div className="flex justify-end mb-4">
              <button
                onClick={generateCode}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
              >
                <Plus className="w-4 h-4" />
                生成邀请码
              </button>
            </div>

            {/* 邀请码列表 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">我的邀请码</h3>
              {inviteCodes.map((item) => (
                <div
                  key={item.code}
                  onClick={() => selectCode(item.code)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer transition ${
                    item.selected ? 'border-amber-500 ring-1 ring-amber-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-medium text-gray-900">{item.code}</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{item.status}</span>
                          {item.selected && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">当前选中</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          已邀请 {item.invited} 人 · {item.type}
                          {item.recharge > 0 && (
                            <span className="text-emerald-600 ml-1">· 充值 ¥{item.recharge.toFixed(2)}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyCode(item.code) }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                      >
                        {copiedCode === item.code ? <CheckCircle className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        {copiedCode === item.code ? '已复制' : '复制码'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyLink(item.code) }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                      >
                        {copiedLink === item.code ? <CheckCircle className="w-3 h-3 text-green-600" /> : <Link className="w-3 h-3" />}
                        {copiedLink === item.code ? '已复制' : '复制链接'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 推广物料 */}
        {activeTab === 'materials' && (
          <div className="space-y-5">
            {/* 邀请二维码 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-600" />
                邀请二维码
              </h3>
              <div className="flex gap-6">
                {/* 二维码占位 */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <QrCode className="w-20 h-20 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">扫码注册 · 邀请码自动填充</p>
                </div>
                {/* 邀请信息 */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">邀请码</label>
                    <p className="text-lg font-medium text-amber-600">{selectedCode.code}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">邀请链接</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`https://www.baowenclaw.com/register?code=${selectedCode.code}`}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
                      />
                      <button
                        onClick={() => copyLink(selectedCode.code)}
                        className="px-4 py-2 text-sm text-amber-600 hover:text-amber-700 transition"
                      >
                        {copiedLink === selectedCode.code ? '已复制' : '复制'}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                      <Download className="w-4 h-4" />
                      保存二维码
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition">
                      <FileText className="w-4 h-4" />
                      生成推广海报
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 推广文案模板 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                推广文案模板
              </h3>
              <p className="text-xs text-gray-500 mb-4">选一条文案复制，配合二维码/海报发到朋友圈或群里</p>
              <div className="space-y-3">
                {promoTemplates.map((template, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <p className="flex-1 text-sm text-gray-700 leading-relaxed">{template}</p>
                    <button
                      onClick={() => copyTemplate(index, template)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-amber-600 hover:text-amber-700 transition flex-shrink-0"
                    >
                      {copiedTemplate === index ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedTemplate === index ? '已复制' : '复制'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 我的用户 */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">用户</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">邀请码</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">余额</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">总充值</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">总消费</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">注册时间</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          {user.email && <p className="text-xs text-gray-400">{user.email}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-gray-700">{user.code}</p>
                          <p className="text-xs text-gray-400">{user.codeInfo}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-700">¥{user.balance.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-sm text-emerald-600">¥{user.totalRecharge.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-sm text-amber-600">¥{user.totalSpend.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-500">{user.registerTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
