'use client'

import { useState, useRef } from 'react'
import { Sparkles, Upload, Download, Copy, CheckCircle, Trash2, Image, RefreshCw } from 'lucide-react'

// 图片尺寸选项
const sizes = [
  { value: '1024*1024', label: '方形 1:1', desc: '适合头像、封面' },
  { value: '720*1280', label: '竖版 9:16', desc: '适合手机壁纸、小红书' },
  { value: '1280*720', label: '横版 16:9', desc: '适合电脑壁纸、横版海报' },
  { value: '1024*1792', label: '竖版 2:3', desc: '适合小红书笔记' },
  { value: '1792*1024', label: '横版 3:2', desc: '适合横版文章配图' },
]

// 通义万象支持的风格
const styles = [
  { value: 'photographic', label: '📷 写实摄影', desc: '真实照片风格' },
  { value: 'anime', label: '🎬 动漫风格', desc: '二次元动漫风格' },
  { value: 'oil_painting', label: '🖼️ 油画', desc: '古典油画质感' },
  { value: 'watercolor', label: '💧 水彩', desc: '水彩画风格' },
  { value: 'chinese_painting', label: '🖌️ 国风', desc: '中国水墨画风' },
  { value: 'sketch', label: '✏️ 素描', desc: '铅笔素描风格' },
]

// 预设风格场景
const presetScenes = [
  { label: '🎁 种草安利', prompt: '精美产品图，纯白背景，高品质商业摄影，光线柔和' },
  { label: '🏠 家居装修', prompt: '现代简约家居空间，明亮自然光，室内设计杂志风格' },
  { label: '🍜 美食餐饮', prompt: '诱人的美食摄影，金色暖色调，专业美食拍摄' },
  { label: '💄 美妆护肤', prompt: '高端美妆产品摄影，精致光影，商业广告风格' },
  { label: '✈️ 旅游攻略', prompt: '绝美风景照片，自然光线，旅行杂志封面感' },
  { label: '👗 穿搭时尚', prompt: '时尚穿搭街拍，高级感，时尚杂志风格' },
]

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState('1024*1024')
  const [style, setStyle] = useState('photographic')
  const [numImages, setNumImages] = useState(1)
  const [images, setImages] = useState<{ url: string; loading?: boolean }[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<number | null>(null)
  const [refImage, setRefImage] = useState<string | null>(null)
  const [refImageStrength, setRefImageStrength] = useState(0.5)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [zoomImage, setZoomImage] = useState<string | null>(null)

  const handlePresetClick = (presetPrompt: string) => {
    setPrompt(prev => prev ? `${prev}\n${presetPrompt}` : presetPrompt)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setRefImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setImages([])
    setError('')

    // 创建加载中的占位图
    const loadingPlaceholders = Array(numImages).fill({ url: '', loading: true })
    setImages(loadingPlaceholders)

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          size, 
          style, 
          numImages,
          ref_image: refImage || undefined,
          ref_image_strength: refImage ? refImageStrength : undefined
        })
      })
      const data = await res.json()

      if (data.success && data.images) {
        setImages(data.images.map((url: string) => ({ url })))
      } else {
        setError(data.error || '生成失败')
        setImages([])
      }
    } catch (err) {
      setError('生成失败，请稍后重试')
      setImages([])
    }

    setIsGenerating(false)
  }

  const handleRegenerateOne = async (index: number) => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setImages(prev => prev.map((img, i) => i === index ? { ...img, loading: true } : img))

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          size, 
          style, 
          numImages: 1
        })
      })
      const data = await res.json()

      if (data.success && data.images) {
        setImages(prev => prev.map((img, i) => i === index ? { url: data.images[0] } : img))
      }
    } catch (err) {
      console.error('重新生成失败:', err)
    }

    setIsGenerating(false)
  }

  const copyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  const downloadImage = (url: string, index: number) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `ai-image-${Date.now()}-${index + 1}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-5">
        {/* 标题 */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">🎨 AI图片生成</h1>
          <p className="text-sm text-gray-500 mt-1">基于AI生图大模型，支持多种风格和尺寸</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左侧配置 */}
          <div className="space-y-4">
            {/* 提示词 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图片描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要生成的图片，越详细效果越好..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* 快速场景 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">💡 快速场景</label>
              <select
                value=""
                onChange={(e) => handlePresetClick(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- 选择场景快速填充 --</option>
                {presetScenes.map((scene, i) => (
                  <option key={i} value={scene.prompt}>{scene.label}</option>
                ))}
              </select>
            </div>

            {/* 参考图 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">🖼️ 参考图（可选）</label>
              <div className="relative">
                {refImage ? (
                  <div className="relative">
                    <img src={refImage} alt="参考图" className="max-h-32 mx-auto rounded-lg" />
                    <button
                      onClick={() => setRefImage(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-lg py-6 text-center hover:border-purple-400 transition cursor-pointer"
                  >
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">点击上传参考图</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {refImage && (
                <div className="mt-2">
                  <label className="text-xs text-gray-500">参考强度</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={refImageStrength}
                    onChange={(e) => setRefImageStrength(parseFloat(e.target.value))}
                    className="w-full mt-1"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>保持原图</span>
                    <span>风格迁移</span>
                  </div>
                </div>
              )}
            </div>

            {/* 尺寸选择 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">📐 图片尺寸</label>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSize(s.value)}
                    className={`p-3 rounded-lg border text-left transition ${
                      size === s.value 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-xs text-gray-400">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 风格选择 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">🎨 图片风格</label>
              <div className="grid grid-cols-2 gap-2">
                {styles.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`p-3 rounded-lg border text-left transition ${
                      style === s.value 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-xs text-gray-400">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 生成数量 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">🔢 生成数量</label>
              <div className="flex gap-2">
                {[1, 2, 4].map(n => (
                  <button
                    key={n}
                    onClick={() => setNumImages(n)}
                    className={`flex-1 py-2 rounded-lg transition ${
                      numImages === n 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {n} 张
                  </button>
                ))}
              </div>
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 bg-purple-600 text-white rounded-xl text-base font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? '生成中...' : `🎨 生成图片（${numImages}张）`}
            </button>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* 图片放大弹窗 */}
          {zoomImage && (
            <div 
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8"
              onClick={() => setZoomImage(null)}
            >
              <div className="relative max-w-full max-h-full">
                <img 
                  src={zoomImage} 
                  alt="放大预览" 
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
                <button
                  onClick={() => setZoomImage(null)}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-white text-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 shadow-lg"
                >
                  ✕
                </button>
                <p className="text-center text-white/60 text-sm mt-2">点击任意处关闭</p>
              </div>
            </div>
          )}

          {/* 右侧结果 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">生成结果</span>
                {images.length > 0 && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                    {images.filter(i => !i.loading).length}/{images.length}
                  </span>
                )}
              </div>
              {images.length > 0 && !isGenerating && (
                <button
                  onClick={() => images.forEach((img, i) => img.url && downloadImage(img.url, i))}
                  className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  下载全部
                </button>
              )}
            </div>

            <div className="p-4">
              {isGenerating ? (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ))}
                </div>
              ) : images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      {img.loading ? (
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <>
                          <img 
                            src={img.url} 
                            alt={`图片${i + 1}`} 
                            className="w-full aspect-square object-cover rounded-lg cursor-zoom-in"
                            onDoubleClick={() => setZoomImage(img.url)}
                            title="双击放大"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-2">
                            <button
                              onClick={() => copyPrompt(img.url, i)}
                              className="p-2 bg-white rounded-full hover:bg-gray-100"
                              title="复制链接"
                            >
                              {copied === i ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => downloadImage(img.url, i)}
                              className="p-2 bg-white rounded-full hover:bg-gray-100"
                              title="下载"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRegenerateOne(i)}
                              className="p-2 bg-white rounded-full hover:bg-gray-100"
                              title="重新生成这张"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400">描述图片后点击生成</p>
                  <p className="text-xs text-gray-300 mt-1">支持小红书配图、公众号封面、产品图等多种场景</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
