'use client'

import { useState, useRef } from 'react'

// 支持的平台
const platforms = [
  { id: 'DOUYIN', name: '抖音', icon: '🎵', color: '#000000', bg: 'bg-gray-900' },
  { id: 'XIAOHONGSHU', name: '小红书', icon: '📕', color: '#FE2C55', bg: 'bg-pink-500' },
  { id: 'WECHAT_OFFICIAL', name: '公众号', icon: '💬', color: '#07C160', bg: 'bg-green-500' },
  { id: 'TOUTIAO', name: '头条号', icon: '🔴', color: '#ED4040', bg: 'bg-red-500' },
  { id: 'WEIBO', name: '微博', icon: '👁', color: '#E6162D', bg: 'bg-red-600' },
  { id: 'BAIJIA', name: '百家号', icon: '🔵', color: '#2932E1', bg: 'bg-blue-600' },
  { id: 'ZHIHU', name: '知乎', icon: '🔷', color: '#0084FF', bg: 'bg-blue-500' },
  { id: 'KUAISHOU', name: '快手', icon: '⚡', color: '#FF5000', bg: 'bg-orange-500' },
  { id: 'BILIBILI', name: 'B站', icon: '📺', color: '#00A1D6', bg: 'bg-blue-400' },
  { id: 'WECHAT_VIDEO', name: '视频号', icon: '📹', color: '#07C160', bg: 'bg-green-500' },
]

// 模拟账号数据
const mockAccounts = [
  { id: '1', name: '卢杰AI工具库', platform: 'XIAOHONGSHU', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
  { id: '2', name: '杰哥AI电商', platform: 'WECHAT_OFFICIAL', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
  { id: '3', name: '卢杰AI逆袭', platform: 'DOUYIN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
  { id: '4', name: '卢杰谈AI', platform: 'ZHIHU', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
  { id: '5', name: 'AI电商杰哥', platform: 'KUAISHOU', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
]

export default function PublishPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [shortContent, setShortContent] = useState('')
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [aiTitle, setAiTitle] = useState('')
  const [aiDesc, setAiDesc] = useState('')
  const [editorTools, setEditorTools] = useState({
    bold: false,
    italic: false,
    underline: false,
  })

  const contentRef = useRef<HTMLTextAreaElement>(null)

  // 获取平台信息
  const getPlatformInfo = (platformId: string) => {
    return platforms.find(p => p.id === platformId) || platforms[0]
  }

  // 切换账号选择
  const toggleAccount = (accountId: string) => {
    setSelectedAccounts(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    )
  }

  // 应用编辑器样式
  const applyStyle = (style: string) => {
    // 简化实现，实际应该使用富文本编辑器库
    console.log('Apply style:', style)
  }

  // 一键发布
  const handlePublish = () => {
    if (selectedAccounts.length === 0) {
      alert('请先选择发布账号')
      return
    }
    if (!title && !content && !shortContent) {
      alert('请输入标题和内容')
      return
    }
    alert(`发布成功！已选择 ${selectedAccounts.length} 个账号`)
  }

  // 一键清空
  const handleClear = () => {
    if (confirm('确定要清空所有内容吗？')) {
      setTitle('')
      setContent('')
      setShortContent('')
      setAiTitle('')
      setAiDesc('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 上方内容区域 */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
          {/* 长文发布 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 标题 */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">长文发布</h2>
          </div>

          {/* 编辑器工具栏 */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 bg-gray-50">
            <button onClick={() => applyStyle('undo')} className="p-1.5 hover:bg-gray-200 rounded" title="撤销">↩️</button>
            <button onClick={() => applyStyle('redo')} className="p-1.5 hover:bg-gray-200 rounded" title="重做">↪️</button>
            <div className="w-px h-5 bg-gray-300 mx-2"></div>
            <button onClick={() => applyStyle('fontSize')} className="p-1.5 hover:bg-gray-200 rounded text-sm" title="字号">字号 ▼</button>
            <button onClick={() => applyStyle('bold')} className="p-1.5 hover:bg-gray-200 rounded font-bold" title="加粗">B</button>
            <button onClick={() => applyStyle('italic')} className="p-1.5 hover:bg-gray-200 rounded italic" title="斜体">I</button>
            <button onClick={() => applyStyle('underline')} className="p-1.5 hover:bg-gray-200 rounded underline" title="下划线">U</button>
            <div className="w-px h-5 bg-gray-300 mx-2"></div>
            <button onClick={() => applyStyle('color')} className="p-1.5 hover:bg-gray-200 rounded" title="文字颜色">A</button>
            <button onClick={() => applyStyle('bgColor')} className="p-1.5 hover:bg-gray-200 rounded" title="背景色">🎨</button>
            <div className="w-px h-5 bg-gray-300 mx-2"></div>
            <button onClick={() => applyStyle('alignLeft')} className="p-1.5 hover:bg-gray-200 rounded" title="左对齐">⬅️</button>
            <button onClick={() => applyStyle('alignCenter')} className="p-1.5 hover:bg-gray-200 rounded" title="居中">↔️</button>
            <button onClick={() => applyStyle('alignRight')} className="p-1.5 hover:bg-gray-200 rounded" title="右对齐">➡️</button>
            <div className="w-px h-5 bg-gray-300 mx-2"></div>
            <button onClick={() => applyStyle('list')} className="p-1.5 hover:bg-gray-200 rounded" title="列表">☰</button>
            <button onClick={() => applyStyle('image')} className="p-1.5 hover:bg-gray-200 rounded" title="插入图片">🖼️</button>
            <button onClick={() => applyStyle('link')} className="p-1.5 hover:bg-gray-200 rounded" title="插入链接">🔗</button>
          </div>

          {/* 标题输入 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入标题"
                className="flex-1 text-xl font-medium placeholder-gray-400 border-none focus:outline-none focus:ring-0"
              />
              <button className="text-blue-500 text-sm hover:text-blue-600 ml-4">智能标题</button>
            </div>
            <div className="text-right text-xs text-gray-400">
              {title.length} / 30
            </div>
          </div>

          {/* 正文编辑区 */}
          <div className="flex-1 flex relative">
            {/* 左侧工具栏 */}
            <div className="w-12 border-r border-gray-200 flex flex-col items-center py-4 gap-3 bg-gray-50">
              <button className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded text-xs font-medium hover:bg-orange-600">
                按URL导入
              </button>
            </div>

            {/* 编辑区域 */}
            <div className="flex-1 p-6">
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="从这里开始写正文"
                className="w-full h-full resize-none border-none focus:outline-none focus:ring-0 text-gray-700 leading-relaxed"
              />
            </div>

            {/* 右侧辅助工具 */}
            <div className="w-12 border-l border-gray-200 flex flex-col items-center py-4 gap-4 bg-gray-50">
              <button className="flex flex-col items-center gap-1 text-orange-500 hover:text-orange-600">
                <span className="text-lg">🔥</span>
                <span className="text-xs">报文数改写</span>
              </button>
            </div>
          </div>

          {/* 底部统计 */}
          <div className="px-6 py-2 border-t border-gray-200 text-xs text-gray-400 flex items-center gap-4">
            <span>正文字数：{content.length}</span>
            <span>图片：0</span>
          </div>
        </div>

        {/* 短文发布 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 标题 */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">短文发布</h2>
          </div>

          {/* 上传区域 */}
          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center cursor-pointer hover:bg-orange-50 transition">
              <div className="w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⬆️</span>
              </div>
              <button className="px-4 py-1.5 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition">
                本地上传
              </button>
            </div>
            <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center cursor-pointer hover:bg-green-50 transition">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">☁️</span>
              </div>
              <button className="px-4 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition">
                素材云盘上传
              </button>
            </div>
          </div>

          {/* 通用发布设置 */}
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">通用发布设置</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                  笔记记录导入
                </button>
                <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
                  同步至右侧 →
                </button>
              </div>
            </div>

            {/* AI 标题 */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">一键设置标题</span>
                <button className="text-xs text-blue-500 hover:text-blue-600">AI 智能标题</button>
              </div>
              <input
                type="text"
                value={aiTitle}
                onChange={(e) => setAiTitle(e.target.value)}
                placeholder="标题"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* AI 简介 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">一键设置简介</span>
                <button className="text-xs text-blue-500 hover:text-blue-600">AI 文案改写</button>
              </div>
              <textarea
                value={aiDesc}
                onChange={(e) => setAiDesc(e.target.value)}
                placeholder="请输入简介"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {aiDesc.length} / 1000
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 下半部分：支持平台 + 发布账号 - 垂直排列 */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 space-y-4">
          {/* 第一行：支持平台 */}
          <div className="flex items-center gap-4">
            {/* 支持平台 */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">支持平台</span>
              <div className="flex items-center gap-2">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: platform.color }}
                    title={platform.name}
                  >
                    {platform.icon}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-px h-8 bg-gray-200"></div>

            {/* 发布账号 */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-gray-700">发布账号</span>

              {selectedAccounts.length === 0 ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowAccountModal(true)}
                    className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
                  >
                    + 选择发布账号
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-medium">1</span>
                      <span className="text-xs text-gray-500">选择发布账号</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-medium">2</span>
                      <span className="text-xs text-gray-500">调整发文规则</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {selectedAccounts.slice(0, 5).map((accountId) => {
                      const account = mockAccounts.find(a => a.id === accountId)
                      if (!account) return null
                      return (
                        <img
                          key={accountId}
                          src={account.avatar}
                          alt={account.name}
                          className="w-8 h-8 rounded-full border-2 border-white"
                          title={account.name}
                        />
                      )
                    })}
                    {selectedAccounts.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                        +{selectedAccounts.length - 5}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{selectedAccounts.length} 个账号</span>
                  <button
                    onClick={() => setShowAccountModal(true)}
                    className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  >
                    修改
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 第二行：操作按钮 */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
              <span>👁️</span>
              <span>预览</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              <span>🗑️</span>
              <span>一键清空</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
              <span>🛡️</span>
              <span>违规检查</span>
            </button>
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
            >
              <span>🚀</span>
              <span>一键发布</span>
            </button>
          </div>
        </div>
      </div>

      {/* 选择账号弹窗 */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold">选择发布账号</h3>
              <button
                onClick={() => setShowAccountModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {mockAccounts.map((account) => {
                  const platform = getPlatformInfo(account.platform)
                  const isSelected = selectedAccounts.includes(account.id)
                  return (
                    <div
                      key={account.id}
                      onClick={() => toggleAccount(account.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                        isSelected ? 'bg-purple-50 border-2 border-purple-500' : 'border-2 border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <img src={account.avatar} alt={account.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <div className="font-medium">{account.name}</div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${platform.bg} bg-opacity-20`}>
                          <span>{platform.icon}</span>
                          <span>{platform.name}</span>
                        </span>
                      </div>
                      {isSelected && (
                        <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                          ✓
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAccountModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => setShowAccountModal(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
              >
                确定 ({selectedAccounts.length})
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
    </div>
  )
}
