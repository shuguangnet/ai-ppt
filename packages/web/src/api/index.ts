import type { PptData, AIConfig } from '@/types/slides'

const BASE = '/api'

export async function aiGenerateStream(
  topic: string,
  aiConfig: AIConfig | undefined,
  onChunk: (text: string) => void,
): Promise<PptData> {
  const res = await fetch(`${BASE}/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, aiConfig }),
  })

  if (!res.ok) throw new Error((await res.json()).error)

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let result: PptData | null = null
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n\n')
    // 最后一段可能不完整，留在 buffer 里
    buffer = parts.pop()!

    for (const part of parts) {
      const line = part.trim()
      if (!line.startsWith('data: ')) continue
      try {
        const msg = JSON.parse(line.slice(6))
        if (msg.error) throw new Error(msg.error)
        if (msg.chunk) onChunk(msg.chunk)
        if (msg.done) result = msg.data
      } catch (e: any) {
        if (e.message?.includes('Unterminated')) continue
        throw e
      }
    }
  }

  if (!result) throw new Error('生成失败')
  return result
}

export async function searchImage(keyword: string): Promise<string> {
  const res = await fetch(`${BASE}/image/search?q=${encodeURIComponent(keyword)}`)
  if (!res.ok) return ''
  const data = await res.json()
  return data.url || ''
}

export async function exportPptx(data: PptData) {
  const res = await fetch(`${BASE}/ppt/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).error)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.title}.pptx`
  a.click()
  URL.revokeObjectURL(url)
}
