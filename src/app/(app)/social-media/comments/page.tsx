'use client'

import { useState, useEffect } from 'react'

// 平台配置
const platforms = [
  { id: 'XIAOHONGSHU', name: '小红书', icon: '📕', color: '#FE2C55', bg: 'bg-pink-50', text: 'text-pink-600' },
  { id: 'WECHAT_OFFICIAL', name: '微信公众号', icon: '💬', color: '#07C160', bg: 'bg-green-50', text: 'text-green-600' },
  { id: 'WECHAT_VIDEO', name: '微信视频号', icon: '📹', color: '#07C160', bg: 'bg-green-50', text: 'text-green-600' },
  { id: 'DOUYIN', name: '抖音', icon: '🎵', color: '#000000', bg: 'bg-gray-900', text: 'text-gray-900' },
  { id: 'BILIBILI', name: '哔哩哔哩', icon: '📺', color: '#00A1D6', bg: 'bg-blue-50', text: 'text-blue-600' },
  { id: 'KUAISHOU', name: '快手', icon: '⚡', color: '#FF5000', bg: 'bg-orange-50', text: 'text-orange-600' },
]

// 模拟账号数据
const mockAccounts = [
  { id: '1', name: '卢杰AI工具库', platform: 'DOUYIN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
  { id: '2', name: '卢杰AI工具库', platform: 'XIAOHONGSHU', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
  { id: '3', name: '杰哥AI电商', platform: 'XIAOHONGSHU', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
  { id: '4', name: '卢杰AI逆袭', platform: 'BILIBILI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
  { id: '5', name: '卢杰AI逆袭', platform: 'DOUYIN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
  { id: '6', name: '卢杰AI逆袭', platform: 'WECHAT_OFFICIAL', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6' },
  { id: '7', name: '杰哥AI电商', platform: 'WECHAT_VIDEO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7' },
  { id: '8', name: '卢杰谈AI', platform: 'WECHAT_VIDEO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8' },
  { id: '9', name: 'AI电商杰哥', platform: 'KUAISHOU', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9' },
  { id: '10', name: '数字方舟', platform: 'WECHAT_OFFICIAL', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10' },
  { id: '11', name: '杰说康养密码', platform: 'WECHAT_OFFICIAL', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11' },
  { id: '12', name: 'AI电商杰哥', platform: 'WECHAT_OFFICIAL', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12' },
]

// 模拟评论数据
const mockComments = [
  {
    id: '1',
    userName: '用户A',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    content: '这个AI工具真的很好用，推荐！',
    time: '10分钟前',
    likes: 23,
    replies: 5,
    status: 'unread',
  },
  {
    id: '2',
    userName: '用户B',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    content: '请问这个工具怎么下载？',
    time: '30分钟前',
    likes: 12,
    replies: 3,
    status: 'unread',
  },
  {
    id: '3',
    userName: '用户C',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    content: '已关注，期待更多内容',
    time: '1小时前',
    likes: 45,
    replies: 0,
    status: 'read',
  },
  {
    id: '4',
    userName: '用户D',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
    content: '这个教程太详细了，感谢分享',
    time: '2小时前',
    likes: 67,
    replies: 8,
    status: 'read',
  },
]

// 模拟私信数据
const mockMessages = [
  {
    id: '1',
    userName: '合作咨询',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg1',
    content: '您好，想咨询一下合作事宜',
    time: '5分钟前',
    unread: true,
  },
  {
    id: '2',
    userName: '粉丝小王',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg2',
    content: '博主，这个工具怎么用啊？',
    time: '1小时前',
    unread: false,
  },
]

export default function CommentsPage() {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'comments' | 'messages'>('comments')
  const [searchQuery, setSearchQuery] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  // 获取平台信息
  const getPlatformInfo = (platformId: string) => {
    return platforms.find(p => p.id === platformId) || platforms[0]
  }

  // 过滤账号
  const filteredAccounts = mockAccounts.filter(account =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 获取当前选中的账号
  const currentAccount = selectedAccount
    ? mockAccounts.find(a => a.id === selectedAccount)
    : null

  // 处理回复
  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return
    alert(`回复成功: ${replyContent}`)
    setReplyContent('')
    setReplyingTo(null)
  }

  return (
    <div className="flex h-full bg-white">
      {/* 左侧 - 账号列表 */}
      <div className="w-72 border-r border-gray-200 flex flex-col">
        {/* 搜索 */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索账号"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* 账号列表 */}
        <div className="flex-1 overflow-y-auto">
          {filteredAccounts.map((account) => {
            const platform = getPlatformInfo(account.platform)
            const isSelected = selectedAccount === account.id
            return (
              <div
                key={account.id}
                onClick={() => setSelectedAccount(account.id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                  isSelected
                    ? 'bg-purple-50 border-l-4 border-purple-600'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <img
                  src={account.avatar}
                  alt={account.name}
                  className="w-10 h-10 rounded-full bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{account.name}</div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${platform.bg} ${platform.text}`}>
                    <span>{platform.icon}</span>
                    <span>{platform.name}</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 右侧 - 内容区域 */}
      <div className="flex-1 flex flex-col">
        {currentAccount ? (
          <>
            {/* 顶部标签栏 */}
            <div className="flex items-center border-b border-gray-200">
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-6 py-4 text-sm font-medium transition relative ${
                  activeTab === 'comments'
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                评论
                {activeTab === 'comments' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-6 py-4 text-sm font-medium transition relative ${
                  activeTab === 'messages'
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                私信
                {activeTab === 'messages' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></span>
                )}
              </button>

              {/* 平台标识 */}
              <div className="ml-auto mr-6 flex items-center gap-2">
                {(() => {
                  const platform = getPlatformInfo(currentAccount.platform)
                  return (
                    <>
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="font-medium">{platform.name}</span>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-auto p-6">
              {activeTab === 'comments' ? (
                <div className="space-y-4">
                  {mockComments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-lg border ${
                        comment.status === 'unread'
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-10 h-10 rounded-full bg-gray-100"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.userName}</span>
                            <span className="text-xs text-gray-400">{comment.time}</span>
                            {comment.status === 'unread' && (
                              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                新
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-gray-700">{comment.content}</p>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <span>❤️</span>
                              <span>{comment.likes}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span>💬</span>
                              <span>{comment.replies}条回复</span>
                            </span>
                          </div>

                          {/* 回复区域 */}
                          {replyingTo === comment.id ? (
                            <div className="mt-3 flex gap-2">
                              <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="请输入回复内容..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                autoFocus
                              />
                              <button
                                onClick={() => handleReply(comment.id)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
                              >
                                回复
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingTo(null)
                                  setReplyContent('')
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition"
                              >
                                取消
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReplyingTo(comment.id)}
                              className="mt-3 text-purple-600 text-sm hover:text-purple-700"
                            >
                              回复评论
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border ${
                        message.unread
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={message.userAvatar}
                          alt={message.userName}
                          className="w-10 h-10 rounded-full bg-gray-100"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{message.userName}</span>
                            <span className="text-xs text-gray-400">{message.time}</span>
                            {message.unread && (
                              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                新
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-gray-700">{message.content}</p>
                          <button
                            onClick={() => setReplyingTo(message.id)}
                            className="mt-3 text-purple-600 text-sm hover:text-purple-700"
                          >
                            回复私信
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p>请从左侧选择一个账号查看评论和私信</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
