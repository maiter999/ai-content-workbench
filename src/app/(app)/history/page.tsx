'use client'

import { useState } from 'react'

export default function HistoryPage() {
  const [history, setHistory] = useState([
    { id: 1, title: '职场穿搭技巧分享', platform: '小红书', time: '2小时前' },
    { id: 2, title: '2024年理财规划指南', platform: '公众号', time: '5小时前' },
    { id: 3, title: '新手健身一周计划', platform: '小红书', time: '1天前' },
    { id: 4, title: '如何写出爆款标题', platform: '爆文改写', time: '2天前' },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-5">
        {/* 标题 */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">📜 生成文章</h1>
          <p className="text-sm text-gray-500 mt-1">查看历史生成记录</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
        {history.length > 0 ? (
          history.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-sm">
                  {item.platform}
                </span>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(item.title)}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                复制
              </button>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-400">
            <p className="text-5xl mb-4">📭</p>
            <p>暂无生成记录</p>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
