'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface GeneratedImage {
  url: string
  id: string
}

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [size, setSize] = useState<'1024*1024' | '720*1280' | '1280*720'>('1024*1024')
  const [style, setStyle] = useState<'photographic' | 'cartoon' | 'oil_painting' | 'watercolor'>('photographic')
  const [numImages, setNumImages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [error, setError] = useState('')
  const [credits, setCredits] = useState(0)

  // 获取用户积分
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCredits(data.user.credits)
        }
      })
      .catch(err => console.error('获取用户信息失败:', err))
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入图片描述')
      return
    }

    if (credits < numImages) {
      setError('积分不足')
      return
    }

    setError('')
    setLoading(true)
    setImages([])

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          negativePrompt: negativePrompt || undefined,
          size,
          style,
          numImages
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '生成失败')
        return
      }

      // 保存生成的图片
      if (data.images && data.images.length > 0) {
        const generatedImages = data.images.map((url: string, index: number) => ({
          id: `${Date.now()}-${index}`,
          url
        }))
        setImages(generatedImages)
        
        // 扣除积分（假设每张图片消耗1积分）
        setCredits(prev => prev - numImages)
      }

    } catch (err: any) {
      setError(err.message || '网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generated-image-${index + 1}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('下载失败:', err)
      alert('下载失败，请右键图片选择"图片另存为"')
    }
  }

  const sizeOptions = [
    { value: '1024*1024', label: '方形 1:1', desc: '适合社交媒体' },
    { value: '720*1280', label: '竖版 9:16', desc: '适合手机壁纸' },
    { value: '1280*720', label: '横版 16:9', desc: '适合封面图' }
  ]

  const styleOptions = [
    { value: 'photographic', label: '写实摄影', icon: '📷' },
    { value: 'cartoon', label: '卡通动漫', icon: '🎨' },
    { value: 'oil_painting', label: '油画风格', icon: '🖼️' },
    { value: 'watercolor', label: '水彩画', icon: '🎨' }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI 图片生成</h1>
        <p className="text-gray-600 mt-1">输入描述，生成高质量AI图片（通义万象）</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Generation Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              图片描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：一只可爱的橘猫坐在阳光下的窗台上，背景是模糊的城市风景，写实摄影风格..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              提示：描述越详细，生成的图片越符合预期
            </p>
          </div>

          {/* Negative Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              不希望出现的内容（可选）
            </label>
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="例如：模糊、变形、文字、水印"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              图片尺寸
            </label>
            <div className="space-y-2">
              {sizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSize(option.value as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition ${
                    size === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs opacity-70">{option.desc}</div>
                  </div>
                  {size === option.value && (
                    <span className="text-blue-500">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              图片风格
            </label>
            <div className="grid grid-cols-2 gap-3">
              {styleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStyle(option.value as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                    style === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{option.icon}</span>
                  <span className="font-medium text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              生成数量（{numImages} 张）
            </label>
            <input
              type="range"
              min="1"
              max="4"
              value={numImages}
              onChange={(e) => setNumImages(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1张</span>
              <span>4张</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Credits & Generate Button */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">剩余积分：</span>
              <span className="text-2xl font-bold text-blue-600">{credits}</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || credits < numImages}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <span>🎨</span>
                  <span>开始生成</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">生成结果</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">正在生成图片，请稍候...</p>
              <p className="text-sm text-gray-500">通常需要 10-30 秒</p>
            </div>
          ) : images.length > 0 ? (
            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={image.id} className="relative group">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image.url}
                      alt={`Generated image ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized // 通义万象返回的是外部URL
                    />
                  </div>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(image.url, index)}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                      >
                        📥 下载
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(image.url)
                          alert('图片链接已复制！')
                        }}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                      >
                        🔗 复制链接
                      </button>
                    </div>
                  </div>

                  {/* Image Number */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    图片 {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <span className="text-6xl mb-4">🖼️</span>
              <p>输入描述并点击"开始生成"</p>
              <p className="text-sm mt-1">AI将为你生成精美的图片</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-blue-900 mb-3">💡 提示词技巧</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>详细描述</strong>：包含主体、环境、风格、色彩等细节</li>
          <li>• <strong>使用质量词</strong>：如"高清"、"4K"、"大师级"、"精美"等</li>
          <li>• <strong>指定风格</strong>：如"写实摄影"、"水彩画"、"赛博朋克"等</li>
          <li>• <strong>避免歧义</strong>：描述越清晰，生成效果越好</li>
          <li>• <strong>负面提示词</strong>：告诉AI你不想要什么，如"模糊"、"变形"等</li>
        </ul>
      </div>

      {/* Example Prompts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-3">📝 示例描述</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            '一只可爱的橘猫坐在阳光下的窗台上，背景是模糊的城市风景，写实摄影风格，高清，8K',
            '未来科幻城市夜景，霓虹灯，赛博朋克风格，超高清，电影级画质',
            '樱花盛开的日本庭院，传统建筑，宁静氛围，水彩画风格',
            '美味的中国菜，红烧肉，色泽诱人，专业美食摄影，高清'
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition text-sm text-gray-700"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
