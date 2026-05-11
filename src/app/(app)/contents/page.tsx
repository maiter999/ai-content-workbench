'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { platformNames, platformIcons } from '@/lib/utils'

interface Content {
  id: string
  title: string
  topic: string
  platforms: string
  status: string
  createdAt: string
}

export default function ContentsPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const res = await fetch('/api/contents')
      const data = await res.json()
      setContents(data.contents || [])
    } catch (err) {
      console.error('Failed to fetch contents:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条内容吗？')) return

    try {
      const res = await fetch(`/api/contents?id=${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        alert('删除成功')
        fetchContents() // 重新加载列表
      }
    } catch (err) {
      alert('删除失败')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">内容管理</h1>
          <p className="text-gray-600 mt-1">查看和管理你生成的所有内容</p>
        </div>
        <Link
          href="/generate"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2"
        >
          <span>✨</span>
          <span>新建内容</span>
        </Link>
      </div>

      {/* Contents List */}
      {contents.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">主题</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">平台</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">状态</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">创建时间</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contents.map((content) => {
                const platforms = JSON.parse(content.platforms || '[]')
                return (
                  <tr key={content.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{content.title}</div>
                      <div className="text-sm text-gray-500">{content.topic}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {platforms.map((p: string) => (
                          <span
                            key={p}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
                          >
                            {platformIcons[p]} {platformNames[p]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          content.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {content.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(content.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/contents/${content.id}`}
                          className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded transition"
                        >
                          查看
                        </Link>
                        <button
                          onClick={() => handleDelete(content.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <span className="text-6xl">📝</span>
          <h3 className="text-xl font-medium text-gray-900 mt-4">还没有内容</h3>
          <p className="text-gray-500 mt-2">开始创建你的第一个内容吧</p>
          <Link
            href="/generate"
            className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
          >
            去生成内容
          </Link>
        </div>
      )}
    </div>
  )
}
