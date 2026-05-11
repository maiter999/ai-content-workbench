// 文档解析工具（客户端版本 - 通过 API Route 调用）
// 真实的文档解析在服务器端进行，支持 PDF 和 Word 文档

const API_BASE = '/api'

export interface ParsedDocument {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  content: string
  chunks: string[]
  chunkCount: number
  parsedAt: string
  status: 'parsing' | 'completed' | 'error'
  error?: string
}

// 解析文档（通过 API Route）
export async function parseDocument(file: File): Promise<ParsedDocument> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE}/parse-document`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `文档解析失败: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    id: generateId(),
    fileName: data.fileName,
    fileType: data.fileType,
    fileSize: data.fileSize,
    content: data.content,
    chunks: data.chunks,
    chunkCount: data.chunkCount,
    parsedAt: data.parsedAt,
    status: 'completed'
  }
}

// 保存解析后的文档到 localStorage
export function saveParsedDocument(doc: ParsedDocument): void {
  try {
    const stored = localStorage.getItem('parsedDocuments')
    const docs: ParsedDocument[] = stored ? JSON.parse(stored) : []

    // 添加新文档到列表头部
    docs.unshift(doc)

    // 最多保存 50 个文档
    if (docs.length > 50) {
      docs.length = 50
    }

    localStorage.setItem('parsedDocuments', JSON.stringify(docs))
  } catch (error) {
    console.error('保存文档失败:', error)
  }
}

// 获取所有已解析的文档
export function getParsedDocuments(): ParsedDocument[] {
  try {
    const stored = localStorage.getItem('parsedDocuments')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// 根据 ID 获取文档
export function getParsedDocumentById(id: string): ParsedDocument | null {
  const docs = getParsedDocuments()
  return docs.find(doc => doc.id === id) || null
}

// 删除文档
export function deleteParsedDocument(id: string): void {
  try {
    const docs = getParsedDocuments()
    const filtered = docs.filter(doc => doc.id !== id)
    localStorage.setItem('parsedDocuments', JSON.stringify(filtered))
  } catch (error) {
    console.error('删除文档失败:', error)
  }
}

// 生成简单 ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// 导出为可复用的内容块
export function exportChunksAsContent(doc: ParsedDocument): string {
  return doc.chunks.map((chunk, index) => `## 内容块 ${index + 1}\n\n${chunk}`).join('\n\n---\n\n')
}

export default {
  parseDocument,
  saveParsedDocument,
  getParsedDocuments,
  getParsedDocumentById,
  deleteParsedDocument,
  exportChunksAsContent
}
