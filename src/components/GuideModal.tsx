'use client'

import { useState } from 'react'
import { X, BookOpen, Search, PenTool, MessageSquare, Database, Lightbulb, Zap, Clock, ChevronRight } from 'lucide-react'

interface GuideModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  if (!isOpen) return null

  const sections = [
    {
      id: 'what',
      title: '豹纹工坊 AI 是什么？',
      icon: <BookOpen className="w-5 h-5 text-amber-500" />,
      content: '聚焦多平台内容创作与运营的 AI 工作台，覆盖小红书、公众号等主流渠道，从爆款调研、一键仿改爆款文章到评论互动、私域运营，一站式解决内容人从选题到落地的所有需求，让内容创作效率翻倍。'
    },
    {
      id: 'research',
      title: '爆款调研',
      subtitle: '找方向再动笔',
      icon: <Search className="w-5 h-5 text-orange-500" />,
      items: [
        { icon: '🔥', title: '爆款查看', desc: '各平台爆款内容逻辑一目了然，快速捕捉热点、找选题灵感' },
        { icon: '💡', title: '爆款标题', desc: '针对不同平台生成吸睛标题，适配小红书、抖音等渠道' }
      ]
    },
    {
      id: 'create',
      title: '内容创作与改写',
      subtitle: '一键复刻爆款不用愁',
      icon: <PenTool className="w-5 h-5 text-blue-500" />,
      items: [
        { icon: '📕', title: '小红书 / 公众号', desc: '专属渠道入口，自动生成适配平台风格的文案' },
        { icon: '⚡', title: '一键生成', desc: '输入关键词，一次性产出多平台适配文案' },
        { icon: '✏️', title: '内容改写', desc: '粘贴爆款链接或文本，AI 一键模仿结构、风格、逻辑进行改写' }
      ]
    },
    {
      id: 'interact',
      title: '评论互动',
      subtitle: '搞定全场景沟通',
      icon: <MessageSquare className="w-5 h-5 text-green-500" />,
      items: [
        { icon: '💬', title: '评论回复', desc: '自动生成适配不同场景的评论区互动文案' },
        { icon: '📢', title: '私域话术', desc: '生成社群、私信等私域场景的沟通话术' }
      ]
    },
    {
      id: 'manage',
      title: '素材与管理',
      subtitle: '创作更有条理',
      icon: <Database className="w-5 h-5 text-purple-500" />,
      items: [
        { icon: '📚', title: '知识库', desc: '存储创作素材、设定品牌规范，AI 创作更贴合品牌调性' },
        { icon: '📜', title: '生成记录', desc: '历史创作内容可复用、修改，避免重复工作' },
        { icon: '📝', title: '心得计划', desc: '制定内容创作计划，规划发布节奏' }
      ]
    }
  ]

  const quickStartSteps = [
    '打开 baowenclaw.com 完成注册 / 登录进入首页',
    '点击「爆款查看」筛选行业爆款，选定心仪的爆款文章',
    '将爆款文本 / 链接粘贴至「内容改写」，AI 自动完成仿改',
    '也可选「小红书 / 公众号」或「一键生成」，输入主题直接产出',
    '通过「评论回复」「私域话术」完成用户沟通',
    '将常用素材存入「知识库」，让 AI 更懂你的品牌'
  ]

  const tips = [
    { icon: '🔍', title: '使用「爆款查看」时', desc: '精准筛选行业 / 平台，选题更贴合目标受众' },
    { icon: '✏️', title: '使用「内容改写」时', desc: '补充指令（如"仿改完美日记种草文案"），AI 输出更精准' },
    { icon: '📚', title: '在「知识库」上传品牌手册 / 产品资料', desc: 'AI 仿改的内容会更贴合品牌调性' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">豹纹工坊 AI 使用指南</h2>
            <p className="text-sm text-gray-500">全新完整使用指南，新手也能秒上手</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 什么是豹纹工坊 AI */}
          <div className="bg-amber-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-gray-900">豹纹工坊 AI 是什么？</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              聚焦多平台内容创作与运营的 AI 工作台，覆盖小红书、公众号等主流渠道，从<span className="text-amber-600 font-medium">爆款调研、一键仿改爆款文章</span>到评论互动、私域运营，一站式解决内容人从选题到落地的所有需求，让内容创作效率翻倍。
            </p>
          </div>

          {/* 核心功能全解析 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              核心功能全解析
            </h3>
            <div className="space-y-3">
              {sections.filter(s => s.id !== 'what').map(section => (
                <div key={section.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {section.icon}
                    <div>
                      <h4 className="font-semibold text-gray-900">{section.title}</h4>
                      {section.subtitle && <p className="text-xs text-gray-500">{section.subtitle}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {section.items?.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <span className="shrink-0">{item.icon}</span>
                        <div>
                          <span className="font-medium text-gray-700">{item.title}</span>
                          <span className="text-gray-500">：{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3分钟快速上手 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              3 分钟快速上手
            </h3>
            <div className="space-y-3">
              {quickStartSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-gray-600">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 实用小技巧 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              实用小技巧
            </h3>
            <div className="space-y-3">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <span className="shrink-0">{tip.icon}</span>
                  <div>
                    <span className="font-medium text-gray-700">{tip.title}</span>
                    <span className="text-gray-500">，{tip.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部标语 */}
          <div className="text-center py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              豹纹工坊 AI，让内容创作从"繁琐"变"省心"
            </p>
            <p className="text-xs text-gray-400 mt-1">助力每一位内容人高效出爆款</p>
          </div>

          {/* 开始创作按钮 */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition flex items-center justify-center gap-2"
          >
            开始创作
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
