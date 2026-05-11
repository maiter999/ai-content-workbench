// 知识库共享数据 - 用于跨页面共享上传的文档列表
// 实际项目中应替换为 API 调用

export interface KnowledgeDoc {
  id: string
  name: string
  size: string
  type: string
  uploadedAt: string
  status: 'ready' | 'processing' | 'error'
}

// 模拟全局状态（实际项目中应使用 context/store 或 API）
const KNOWLEDGE_DOCS_KEY = 'knowledge_docs'

export function getKnowledgeDocs(): KnowledgeDoc[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(KNOWLEDGE_DOCS_KEY)
  if (!stored) {
    // 返回默认值
    return [
      { id: '1', name: '产品手册.pdf', size: '2.5MB', type: 'PDF', uploadedAt: '2024-01-15', status: 'ready' },
      { id: '2', name: '营销话术.docx', size: '1.2MB', type: 'Word', uploadedAt: '2024-01-14', status: 'ready' },
      { id: '3', name: '行业报告.pdf', size: '5.8MB', type: 'PDF', uploadedAt: '2024-01-13', status: 'ready' },
    ]
  }
  return JSON.parse(stored)
}

export function saveKnowledgeDocs(docs: KnowledgeDoc[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KNOWLEDGE_DOCS_KEY, JSON.stringify(docs))
}
