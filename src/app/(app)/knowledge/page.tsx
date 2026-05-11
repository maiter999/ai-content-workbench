'use client'

import { useState, useRef, useEffect } from 'react'
import { getKnowledgeDocs, saveKnowledgeDocs } from '@/lib/knowledge-share'
import { parseDocument, saveParsedDocument } from '@/lib/doc-parser'

interface DocItem {
  id: string
  name: string
  size: string
  type: string
  uploadedAt: string
  status: 'ready' | 'processing' | 'error'
}

export default function KnowledgePage() {
  const [docs, setDocs] = useState<DocItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 加载时读取共享数据
  useEffect(() => {
    setDocs(getKnowledgeDocs())
  }, [])


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    setIsUploading(true)
    setError('')

    // 检查文件大小 (限制 10MB)
    const oversizedFiles = files.filter(f => f.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError(`以下文件超过 10MB 限制: ${oversizedFiles.map(f => f.name).join(', ')}`)
      setIsUploading(false)
      return
    }

    // 处理每个文件
    const processFiles = async () => {
      const newDocs: DocItem[] = []

      for (const file of files) {
        const docItem: DocItem = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
          type: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'processing'
        }

        newDocs.push(docItem)
        setDocs(prev => [...prev, docItem])

        try {
          // 解析文档
          const parsed = await parseDocument(file)
          
          // 保存到 localStorage
          saveParsedDocument(parsed)
          
          // 更新状态为 ready
          setDocs(prev => prev.map(doc => 
            doc.id === docItem.id ? { ...doc, status: 'ready' as const } : doc
          ))
          
        } catch (err) {
          console.error('解析文档失败:', err)
          setDocs(prev => prev.map(doc => 
            doc.id === docItem.id ? { ...doc, status: 'error' as const } : doc
          ))
          setError(`解析 ${file.name} 失败: ${err instanceof Error ? err.message : '未知错误'}`)
        }
      }

      // 保存到共享存储
      const updatedDocs = [...docs, ...newDocs]
      saveKnowledgeDocs(updatedDocs)
      setIsUploading(false)
    }

    processFiles()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleDelete = (id: string) => {
    const updatedDocs = docs.filter(doc => doc.id !== id)
    setDocs(updatedDocs)
    saveKnowledgeDocs(updatedDocs)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">知识库</h1>
        <p className="text-gray-600 mt-1">上传文档，AI 自动解析建立知识索引</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left - Upload */}
        <div className="col-span-1 space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
            className={`bg-white rounded-xl shadow-sm p-8 border-2 border-dashed cursor-pointer transition ${
              isDragging
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center">
              <span className="text-6xl mb-4">📚</span>
              <p className="text-gray-900 font-medium mb-2">
                {isUploading ? '解析中...' : '点击或拖拽文件到此处'}
              </p>
              <p className="text-gray-500 text-sm">
                支持 PDF、Word、TXT、Markdown
              </p>
              <p className="text-gray-400 text-xs mt-2">
                单文件不超过 10MB
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">知识库统计</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">文档数量</span>
                <span className="font-bold text-purple-600">{docs.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">可用文档</span>
                <span className="font-bold text-green-600">
                  {docs.filter(d => d.status === 'ready').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">处理中</span>
                <span className="font-bold text-yellow-600">
                  {docs.filter(d => d.status === 'processing').length}
                </span>
              </div>
            </div>
          </div>

          {/* Usage Guide */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">使用说明</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p>上传文档到知识库</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p>AI 自动解析文档内容</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p>生成时引用知识库内容</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Documents */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">我的文档</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    搜索
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    排序
                  </button>
                </div>
              </div>
            </div>

            {docs.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {docs.map((doc) => (
                  <div key={doc.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">
                          {doc.type === 'PDF' ? '📄' : '📝'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{doc.name}</h3>
                          {doc.status === 'processing' && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                              处理中
                            </span>
                          )}
                          {doc.status === 'ready' && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                              可用
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.uploadedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
                          👁️
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                <span className="text-6xl mb-4">📂</span>
                <p>暂无文档</p>
                <p className="text-sm mt-1">上传文档开始构建知识库</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
