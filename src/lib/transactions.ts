import { prisma } from '@/lib/prisma'

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
