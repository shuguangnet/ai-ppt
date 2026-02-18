import type { ThemeConfig } from '@/types/slides'

export const themes: ThemeConfig[] = [
  { name: 'dark', label: '深色商务', bg: '0F172A', primary: '3B82F6', text: 'FFFFFF', muted: '94A3B8' },
  { name: 'light', label: '浅色简约', bg: 'FFFFFF', primary: '2563EB', text: '1E293B', muted: '64748B' },
  { name: 'green', label: '自然绿', bg: '022C22', primary: '10B981', text: 'ECFDF5', muted: '6EE7B7' },
  { name: 'purple', label: '科技紫', bg: '1E1B4B', primary: '8B5CF6', text: 'F5F3FF', muted: 'A78BFA' },
  { name: 'warm', label: '暖色调', bg: '1C1917', primary: 'F59E0B', text: 'FEFCE8', muted: 'FCD34D' },
]

export function getTheme(name?: string): ThemeConfig {
  return themes.find(t => t.name === name) || themes[0]
}
