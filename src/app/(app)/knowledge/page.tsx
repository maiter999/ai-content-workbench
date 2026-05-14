'use client'

import { useState } from 'react'

export default function KnowledgePage() {
  const [docs, setDocs] = useState([
    { id: 1, name: '产品知识库.txt', size: '12KB', status: '就绪' },
    { id: 2, name: '品牌故事.md', size: '5KB', status: '就绪' },
  ])

  const handleUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.md,.pdf,.doc,.docx'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          setDocs(prev => [...prev, {
            id: Date.now(),
            name: file.name,
            size: `${Math.round(file.size / 1024)}KB`,
            status: '就绪'
          }])
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleDelete = (id: number) => {
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-5">
        {/* 标题 */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">📚 专业知识库</h1>
          <p className="text-sm text-gray-500 mt-1">上传和管理您的参考文档</p>
        </div>

      {/* 上传区域 */}
      <div
        onClick={handleUpload}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 mb-6"
      >
        <p className="text-4xl mb-2">📁</p>
        <p className="text-gray-600">点击上传知识库文件</p>
        <p className="text-sm text-gray-400 mt-1">支持 TXT、MD、PDF、Word 格式</p>
      </div>

      {/* 文档列表 */}
      <div className="bg-white rounded-xl">
        <div className="p-4 border-b">
          <h2 className="font-semibold">已上传文档 ({docs.length})</h2>
        </div>

        {docs.length > 0 ? (
          docs.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-4 border-b last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">{doc.status}</span>
                <button onClick={() => handleDelete(doc.id)} className="text-red-500">删除</button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-400">
            暂无文档
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
