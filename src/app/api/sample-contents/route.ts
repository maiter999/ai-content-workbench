import { NextResponse } from 'next/server'

// 示例/推荐文章数据
const sampleContents = [
  {
    id: 1,
    title: 'ChatGPT写作技巧｜如何让AI写出爆款文案',
    hot: '🔥 10w+阅读',
    platform: '小红书'
  },
  {
    id: 2,
    title: '2024内容营销趋势分析报告',
    hot: '🔥 8.5w阅读',
    platform: '公众号'
  },
  {
    id: 3,
    title: '短视频脚本公式｜3秒抓住观众眼球',
    hot: '🔥 6.2w阅读',
    platform: '抖音'
  },
  {
    id: 4,
    title: '朋友圈高转化文案模板，直接套用',
    hot: '🔥 5.8w阅读',
    platform: '朋友圈'
  },
  {
    id: 5,
    title: '小红书起号攻略｜从0到1完整教程',
    hot: '🔥 5.1w阅读',
    platform: '小红书'
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      contents: sampleContents,
      count: sampleContents.length
    })
  } catch (error) {
    console.error('Get sample contents error:', error)
    return NextResponse.json(
      { error: '获取示例内容失败', contents: [] },
      { status: 500 }
    )
  }
}
