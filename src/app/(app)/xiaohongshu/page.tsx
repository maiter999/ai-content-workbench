'use client'

import { useState } from 'react'
import { Sparkles, Upload, FileText, Image, Copy, CheckCircle, Trash2 } from 'lucide-react'

const contentStyles = ['种草安利', '攻略评测', '避坑指南', '实拍探店', '数据对比']

const modelLevels = [
  { id: 'fast', name: '快速', desc: '快速响应' },
  { id: 'standard', name: '标准', desc: '平衡速度与质量' },
  { id: 'think', name: '思考', desc: '深度思考更精准' },
]

export default function XiaohongshuPage() {
  const [topic, setTopic] = useState('')
  const [contentStyle, setContentStyle] = useState('种草安利')
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

    setTimeout(() => {
      setResult(`# ${topic}

姐妹们！这个${topic}真的太绝了！✨

最近我发现了一个超级好用的方法，专门针对${topic}，效果真的惊艳到我了！

**操作步骤：**
1. 第一步：准备好所有材料
2. 第二步：按照顺序进行操作
3. 第三步：等待效果显现

真的超级简单，新手也能轻松上手！💪

#${topic} #干货分享 #必看`)
      setIsGenerating(false)
    }, 2000)
  }

  const handleGenerateCover = async () => {
    if (!result) return
    setIsGeneratingImage(true)

    setTimeout(() => {
      setCoverImage(`https://picsum.photos/800/600?random=${Date.now()}`)
      setIsGeneratingImage(false)
    }, 2000)
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
          <h1 className="text-xl font-bold text-gray-900">小红书图文生成</h1>
          <p className="text-sm text-gray-500 mt-1">一键生成爆款笔记——标题、正文、标签</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* 左侧表单 */}
          <div className="space-y-3">
            {/* 主题 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主题/关键词 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="输入创作主题..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
              >
                {contentStyles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* 行业 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">行业</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
              >
                <option value="">通用</option>
                <option value="科技">科技</option>
                <option value="教育">教育</option>
                <option value="餐饮">餐饮</option>
                <option value="美妆">美妆</option>
                <option value="旅游">旅游</option>
                <option value="母婴">母婴</option>
                <option value="健康">健康</option>
                <option value="金融">金融</option>
                <option value="房产">房产</option>
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
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium">{level.name}</div>
                    <div className={`text-xs mt-0.5 ${modelLevel === level.id ? 'text-pink-200' : 'text-gray-400'}`}>
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
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
                  <div className="border-2 border-dashed border-gray-200 rounded-lg py-6 text-center hover:border-pink-400 transition cursor-pointer">
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
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
              className="w-full py-3 bg-pink-500 text-white rounded-xl text-base font-medium hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-pink-200"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? '生成中...' : '📕 生成图文'}
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
                    className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 bg-pink-50 px-2 py-1 rounded transition"
                  >
                    {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? '已复制' : '复制'}
                  </button>
                )}
              </div>
              <div className="p-4">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm text-gray-500">AI正在创作中...</p>
                  </div>
                ) : result ? (
                  <div className="text-sm whitespace-pre-wrap text-gray-700 max-h-60 overflow-y-auto">
                    {result}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">填写左侧表单，点击生成文案</p>
                  </div>
                )}
              </div>
            </div>

            {/* 配图区域 - 在文章内容下方 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">配图</span>
                </div>
                <button
                  onClick={handleGenerateCover}
                  disabled={!result || isGeneratingImage}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 transition"
                >
                  <Image className="w-4 h-4" />
                  {isGeneratingImage ? '生成中...' : '🎨 生成配图'}
                </button>
              </div>
              <div className="p-4">
                {isGeneratingImage ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : coverImage ? (
                  <div className="rounded-lg overflow-hidden">
                    <img src={coverImage} alt="封面图" className="w-full h-48 object-cover" />
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
