'use client'

import { useState } from 'react'
import { Sparkles, Upload, FileText, Image, Copy, CheckCircle, Trash2 } from 'lucide-react'

const contentStyles = ['专业深度', '故事叙事', '干货清单', '热点评论', '通知公告']

const modelLevels = [
  { id: 'fast', name: '⚡ 快速', desc: 'AI 快速模式', color: 'bg-green-500' },
  { id: 'standard', name: '📝 标准', desc: 'AI 专家模式', color: 'bg-green-600' },
  { id: 'think', name: '🧠 思考', desc: '深度思考 + 智能搜索', color: 'bg-green-700' },
]

const industries = ['房地产', '科技', '教育', '餐饮', '美妆', '旅游', '母婴', '健康', '金融', '医疗', '法律', '宠物', '汽车', '家居', '婚庆', '电商', '职场', '摄影', '农业']

export default function WechatPage() {
  const [topic, setTopic] = useState('')
  const [contentStyle, setContentStyle] = useState('专业深度')
  const [industry, setIndustry] = useState('')
  const [modelLevel, setModelLevel] = useState('standard')
  const [requirements, setRequirements] = useState('')
  const [materials, setMaterials] = useState('')
  const [knowledgeBase, setKnowledgeBase] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [result, setResult] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [copied, setCopied] = useState(false)
  const [imageError, setImageError] = useState('')
  const [error, setError] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setUploadedImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!topic) return
    setIsGenerating(true)
    setResult('')
    setError('')

    try {
      const response = await fetch('/api/wechat/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          contentStyle,
          industry,
          requirements,
          materials,
          modelLevel
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '生成失败')
        setIsGenerating(false)
        return
      }

      setResult(data.content)
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateCover = async () => {
    if (!result) return
    setIsGeneratingImage(true)
    setImageError('')

    try {
      const response = await fetch('/api/xiaohongshu/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleContent: result,
          contentStyle: contentStyle,
          imageSize: '720*1280'  // 公众号封面 9:16 竖版（通义万象支持）
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setImageError(data.error || '生成配图失败')
        setIsGeneratingImage(false)
        return
      }

      setCoverImage(data.imageUrl)
    } catch (err: any) {
      console.error('生成配图错误:', err)
      setImageError('网络错误，请稍后重试')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const copyContent = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-5">
        {/* 标题 */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">公众号文章生成</h1>
          <p className="text-sm text-gray-500 mt-1">撰写专业的公众号长文</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* 左侧表单 */}
          <div className="space-y-3">
            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-600 text-sm">
                <span className="shrink-0">⚠️</span>
                {error}
              </div>
            )}

            {/* 主题 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主题/关键词 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="输入文章主题..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* 内容风格 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容风格 <span className="text-red-500">*</span>
              </label>
              <select
                value={contentStyle}
                onChange={(e) => setContentStyle(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                {contentStyles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* 行业领域 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">行业领域</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="">通用</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            {/* 模型档位 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                模型档位 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {modelLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setModelLevel(level.id)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition ${
                      modelLevel === level.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium">{level.name}</div>
                    <div className={`text-xs mt-0.5 ${modelLevel === level.id ? 'text-green-200' : 'text-gray-400'}`}>
                      {level.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 补充要求 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">补充要求</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="输入补充要求..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 参考素材 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">参考素材</label>
              <textarea
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="输入参考素材链接或内容..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 上传参考图 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">上传参考图</label>
              <div className="relative">
                {uploadedImage ? (
                  <div className="relative">
                    <img src={uploadedImage} alt="预览" className="max-h-24 mx-auto rounded-lg" />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg py-6 text-center hover:border-green-400 transition cursor-pointer">
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">拖拽或点击上传</p>
                    <p className="text-xs text-gray-400">支持 JPG、PNG</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer top-0"
                />
              </div>
            </div>

            {/* 引用知识库 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">引用知识库</label>
              <select
                value={knowledgeBase}
                onChange={(e) => setKnowledgeBase(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="">选择参考文档</option>
                <option value="product">产品知识库</option>
                <option value="brand">品牌故事库</option>
                <option value="case">案例库</option>
              </select>
            </div>

            {/* 生成文章按钮 */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className="w-full py-3 bg-green-600 text-white rounded-xl text-base font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-green-200"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? '生成中...' : '📰 生成文章'}
            </button>
          </div>

          {/* 右侧输出 - 文章内容在上，配图在下 */}
          <div className="space-y-4">
            {/* 文章内容 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">文章内容</span>
                </div>
                {result && (
                  <button
                    onClick={copyContent}
                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 bg-green-50 px-2 py-1 rounded transition"
                  >
                    {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? '已复制' : '复制'}
                  </button>
                )}
              </div>
              <div className="p-4">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm text-gray-500">AI正在创作中...</p>
                  </div>
                ) : result ? (
                  <div className="text-sm whitespace-pre-wrap text-gray-700 max-h-60 overflow-y-auto">
                    {result}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">填写左侧表单，点击生成文章</p>
                  </div>
                )}
              </div>
            </div>

            {/* 配图区域 - 在文章内容下方 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">文章配图</span>
                </div>
                <button
                  onClick={handleGenerateCover}
                  disabled={!result || isGeneratingImage}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                >
                  <Image className="w-4 h-4" />
                  {isGeneratingImage ? '生成中...' : '🎨 生成配图'}
                </button>
              </div>
              <div className="p-4">
                {isGeneratingImage ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : coverImage ? (
                  <div className="rounded-lg overflow-hidden">
                    <img src={coverImage} alt="封面图" className="w-full h-40 object-cover" />
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <Image className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">先生成文章，再点击生成配图</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
