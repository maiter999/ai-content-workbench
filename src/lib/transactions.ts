import { prisma } from './prisma'

export async function createTransaction(
  userId: string,
  type: 'charge' | 'consume',
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

// 计算内容生成所需积分
export function calculateCreditsNeeded(
  platforms: string[],
  hasImage: boolean = false
): number {
  let credits = 0
  
  // 每个平台消耗10积分
  credits += platforms.length * 10
  
  // 如果生成图片，每个平台额外消耗20积分
  if (hasImage) {
    credits += platforms.length * 20
  }
  
  return credits
}
