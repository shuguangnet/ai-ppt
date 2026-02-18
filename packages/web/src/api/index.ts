import type { PptData, AIConfig } from '@/types/slides'

const BASE = '/api'

export async function aiGenerate(topic: string, aiConfig?: AIConfig): Promise<PptData> {
  const res = await fetch(`${BASE}/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, aiConfig }),
  })
  if (!res.ok) throw new Error((await res.json()).error)
  return res.json()
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
