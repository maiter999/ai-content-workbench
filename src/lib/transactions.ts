import { prisma } from '@/lib/prisma'

/**
 * 计算AI生成所需的积分
 */
export function calculateCreditsNeeded(platforms: string[] = ['default'], isImage: boolean = false): number {
  // 根据平台和类型计算积分消耗
  const baseCredits: Record<string, number> = {
    'default': 10,
    'deepseek': 10,
    'qwen': 8,
    'wenxin': 10,
    'spark': 10,
    'glm': 10
  }

  // 基础积分
  let credits = baseCredits['default']
  for (const platform of platforms) {
    if (baseCredits[platform]) {
      credits = Math.max(credits, baseCredits[platform])
    }
  }

  // 图片生成消耗更多积分
  if (isImage) {
    credits *= 2
  }

  return credits
}

/**
 * 创建交易记录（内部调用）
 */
export async function createTransaction(
  userId: string,
  type: 'recharge' | 'consume',
  amount: number,
  description: string,
  platform?: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('用户不存在')
  }

  const balance = user.credits + amount
  if (balance < 0) {
    throw new Error('积分不足')
  }

  // 更新用户积分
  await prisma.user.update({
    where: { id: userId },
    data: { credits: balance }
  })

  // 创建交易记录
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type,
      amount,
      balance,
      description,
      platform
    }
  })

  return transaction
}
