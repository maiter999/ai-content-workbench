'use client'

import { useState } from 'react'

const sizes = [
  { value: '1024*1024', label: '方形' },
  { value: '720*1280', label: '竖版' },
  { value: '1280*720', label: '横版' },
]

const styles = ['写实', '卡通', '油画', '水彩']

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState('1024*1024')
  const [style, setStyle] = useState('写实')
  const [images, setImages] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt) return

    setIsGenerating(true)
    setImages([])
    setError('')

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size, style, numImages: 1 })
      })
      const data = await res.json()

      if (data.success && data.images) {
        setImages(data.images)
      } else {
        setError(data.error || '生成失败')
      }
    } catch (err) {
      setError('生成失败')
    }

    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-5">
        {/* 标题 */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">🎨 AI图片生成</h1>
          <p className="text-sm text-gray-500 mt-1">输入描述，一键生成精美图片</p>
        </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 左侧 */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要生成的图片..."
            rows={5}
            className="w-full px-4 py-3 border rounded-lg resize-none"
          />

          <div className="grid grid-cols-4 gap-2">
            {sizes.map(s => (
              <button
                key={s.value}
                onClick={() => setSize(s.value)}
                className={`p-3 rounded-lg border ${size === s.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {styles.map(s => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-4 py-2 rounded-lg ${style === s ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50"
          >
            {isGenerating ? '生成中...' : '🎨 生成图片'}
          </button>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>

        {/* 右侧 */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="font-semibold mb-4">生成结果</h2>

          {images.length > 0 ? (
            <div className="space-y-4">
              {images.map((img, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden">
                  <img src={img} alt={`图片${i + 1}`} className="w-full" />
                  <a href={img} download className="absolute bottom-2 right-2 px-4 py-2 bg-white rounded shadow">
                    下载
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-20">
              描述图片后点击生成
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
