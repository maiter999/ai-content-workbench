'use client'

import { useState } from 'react'
import { Sparkles, FileText, Copy, CheckCircle, Lightbulb } from 'lucide-react'

const rewriteModes = ['保留风格改写', '换人设改写', '精简缩写', '扩写丰富', '口语化改写', '书面化改写', '反转角色改写']
const titleStyles = ['悬念好奇型', '数字吸引型', '情感共鸣型', '干货分享型', '热点借势型']
const platforms = ['小红书', '公众号', '朋友圈', '抖音']

export default function RewritePage() {
  // 内容改写状态
  const [originalText, setOriginalText] = useState('')
  const [rewriteMode, setRewriteMode] = useState('保留风格改写')
  const [rewriteTarget, setRewriteTarget] = useState('小红书')
  const [rewriteRequirements, setRewriteRequirements] = useState('')
  const [isRewriting, setIsRewriting] = useState(false)
  const [rewriteResults, setRewriteResults] = useState<string[]>([])
  const [rewriteCopied, setRewriteCopied] = useState(false)

  // 爆款标题状态
  const [titleTopic, setTitleTopic] = useState('')
  const [titleIndustry, setTitleIndustry] = useState('')
  const [titlePlatform, setTitlePlatform] = useState('小红书')
  const [titleStyle, setTitleStyle] = useState('悬念好奇型')
  const [titleCount, setTitleCount] = useState('10个')
  const [isTitleGenerating, setIsTitleGenerating] = useState(false)
  const [titleResults, setTitleResults] = useState<string[]>([])
  const [titleCopied, setTitleCopied] = useState(false)

  // 内容改写
  const handleRewrite = async () => {
    if (!originalText) return
    setIsRewriting(true)
    setRewriteResults([])

    setTimeout(() => {
      setRewriteResults([
        `【改写版本1】\n\n这是根据原文重新改写的版本，保留了核心信息但表达方式更加生动...`,
        `【改写版本2】\n\n换一种角度来表达同样的内容，让读者有全新的阅读体验...`,
        `【改写版本3】\n\n用更简洁有力的语言重新组织原文，突出重点...`,
      ])
      setIsRewriting(false)
    }, 2000)
  }

  // 爆款标题生成
  const handleTitleGenerate = async () => {
    if (!titleTopic) return
    setIsTitleGenerating(true)
    setTitleResults([])

    setTimeout(() => {
      setTitleResults([
        `${titleTopic}：99%的人都不知道的秘诀`,
        `震惊！${titleTopic}竟然可以这样...`,
        `${titleTopic}｜看完这篇你就懂了`,
        `为什么你的${titleTopic}总是做不好？`,
        `${titleTopic}的5个真相，看完沉默了`,
        `手把手教你${titleTopic}，新手也能学会`,
        `${titleTopic}：从入门到精通只需要3步`,
        `别再错了！${titleTopic}的正确打开方式`,
        `${titleTopic}｜业内人士不愿说的秘密`,
        `关于${titleTopic}，我花了3年才悟出的道理`,
      ])
      setIsTitleGenerating(false)
    }, 2000)
  }

  const copyRewriteResults = () => {
    navigator.clipboard.writeText(rewriteResults.join('\n\n'))
    setRewriteCopied(true)
    setTimeout(() => setRewriteCopied(false), 2000)
  }

  const copyTitleResults = () => {
    navigator.clipboard.writeText(titleResults.join('\n\n'))
    setTitleCopied(true)
    setTimeout(() => setTitleCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-5">
        {/* 标题 */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">爆款速改写</h1>
          <p className="text-sm text-gray-500 mt-1">爆款文章改写 + 爆款标题生成</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* 左侧 - 爆款文章改写 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-800">爆款文章改写</h2>
            </div>

            {/* 表单 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                原文内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="粘贴需要改写的文章..."
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">改写模式</label>
              <select
                value={rewriteMode}
                onChange={(e) => setRewriteMode(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {rewriteModes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">目标平台</label>
              <select
                value={rewriteTarget}
                onChange={(e) => setRewriteTarget(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">补充要求</label>
              <textarea
                value={rewriteRequirements}
                onChange={(e) => setRewriteRequirements(e.target.value)}
                placeholder="可选：其他特殊要求..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleRewrite}
              disabled={isRewriting || !originalText}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-base font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              <Sparkles className="w-5 h-5" />
              {isRewriting ? '改写中...' : '✏️ 开始改写'}
            </button>

            {/* 改写结果 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">改写结果</span>
                </div>
                {rewriteResults.length > 0 && (
                  <button
                    onClick={copyRewriteResults}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                  >
                    {rewriteCopied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {rewriteCopied ? '已复制' : '复制全部'}
                  </button>
                )}
              </div>
              <div className="border border-gray-200 rounded-lg min-h-[200px] p-4 bg-gray-50">
                {isRewriting ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-center">
                      <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-500">AI正在改写中...</p>
                    </div>
                  </div>
                ) : rewriteResults.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {rewriteResults.map((r, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{r}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 text-gray-400">
                    <div className="text-center">
                      <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">输入原文后点击改写</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧 - 爆款标题生成 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-semibold text-gray-800">爆款标题生成</h2>
            </div>

            {/* 表单 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主题/关键词 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={titleTopic}
                onChange={(e) => setTitleTopic(e.target.value)}
                placeholder="输入主题关键词..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">行业领域</label>
              <select
                value={titleIndustry}
                onChange={(e) => setTitleIndustry(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              >
                <option value="">请选择行业</option>
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

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">目标平台</label>
              <select
                value={titlePlatform}
                onChange={(e) => setTitlePlatform(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              >
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">标题风格</label>
              <select
                value={titleStyle}
                onChange={(e) => setTitleStyle(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              >
                {titleStyles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">生成数量</label>
              <select
                value={titleCount}
                onChange={(e) => setTitleCount(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              >
                <option value="5个">5个</option>
                <option value="10个">10个</option>
                <option value="20个">20个</option>
              </select>
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleTitleGenerate}
              disabled={isTitleGenerating || !titleTopic}
              className="w-full py-3 bg-amber-500 text-white rounded-xl text-base font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-amber-200"
            >
              <Sparkles className="w-5 h-5" />
              {isTitleGenerating ? '生成中...' : '💡 生成标题'}
            </button>

            {/* 标题结果 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">生成结果</span>
                </div>
                {titleResults.length > 0 && (
                  <button
                    onClick={copyTitleResults}
                    className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700"
                  >
                    {titleCopied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {titleCopied ? '已复制' : '复制全部'}
                  </button>
                )}
              </div>
              <div className="border border-gray-200 rounded-lg min-h-[200px] p-4 bg-gray-50">
                {isTitleGenerating ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-center">
                      <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-500">AI正在生成标题...</p>
                    </div>
                  </div>
                ) : titleResults.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {titleResults.map((r, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-sm text-gray-700">{r}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 text-gray-400">
                    <div className="text-center">
                      <Lightbulb className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">输入主题后点击生成</p>
                    </div>
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
