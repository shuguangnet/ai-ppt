import type { ThemeConfig } from '@/types/slides'

export const themes: ThemeConfig[] = [
  // === 经典纯色 ===
  { name: 'dark', label: '深空蓝', bg: '0F172A', primary: '3B82F6', text: 'FFFFFF', muted: '94A3B8' },
  { name: 'light', label: '纯净白', bg: 'FFFFFF', primary: '2563EB', text: '1E293B', muted: '64748B' },

  // === WPS 风格主题 (带装饰布局) ===

  // 蓝色商务 - 左侧深蓝装饰条
  { name: 'blue-business', label: '商务蓝', bg: 'F5F7FA', primary: '2563EB', text: '1E293B', muted: '64748B', layout: 'sidebar', sidebarWidth: '28%', sidebarColor: '1E40AF', decoration: 'gradient' },
  // 绿色清新 - 顶部绿色装饰
  { name: 'green-fresh', label: '清新绿', bg: 'F0FDF4', primary: '16A34A', text: '166534', muted: '86EFAC', layout: 'full', decoration: 'shape' },
  // 橙色活力 - 左侧橙色装饰
  { name: 'orange-energy', label: '活力橙', bg: 'FFFBEB', primary: 'EA580C', text: '7C2D12', muted: 'FDBA74', layout: 'sidebar', sidebarWidth: '25%', sidebarColor: 'EA580C', decoration: 'gradient' },
  // 紫色优雅 - 全屏渐变
  { name: 'purple-elegant', label: '优雅紫', bg: 'FAF5FF', primary: '9333EA', text: '581C87', muted: 'D8B4FE', layout: 'full', decoration: 'gradient' },
  // 红色正式 - 顶部红色条
  { name: 'red-official', label: '正式红', bg: 'FEF2F2', primary: 'DC2626', text: '7F1D1D', muted: 'FCA5A5', layout: 'full', decoration: 'shape' },
  // 青色科技 - 左侧青色装饰
  { name: 'cyan-tech', label: '科技青', bg: 'ECFEFF', primary: '0891B2', text: '164E63', muted: '67E8F9', layout: 'sidebar', sidebarWidth: '30%', sidebarColor: '0891B2', decoration: 'gradient' },
  // 金色奢华 - 全屏金色渐变
  { name: 'gold-luxury', label: '奢华金', bg: 'FFFBEB', primary: 'CA8A04', text: '713F12', muted: 'FDE047', layout: 'full', decoration: 'gradient' },
  // 粉色甜美 - 左侧粉色装饰
  { name: 'pink-sweet', label: '甜美粉', bg: 'FDF2F8', primary: 'DB2777', text: '831843', muted: 'F9A8D4', layout: 'sidebar', sidebarWidth: '22%', sidebarColor: 'DB2777', decoration: 'gradient' },
  // 灰色专业 - 左侧灰色装饰
  { name: 'gray-professional', label: '专业灰', bg: 'F8FAFC', primary: '475569', text: '1E293B', muted: '94A3B8', layout: 'sidebar', sidebarWidth: '26%', sidebarColor: '334155', decoration: 'gradient' },
  // 蓝紫渐变 - 全屏装饰
  { name: 'blue-purple', label: '蓝紫渐变', bg: 'EEF2FF', primary: '4F46E5', text: '312E81', muted: 'A5B4FC', layout: 'full', decoration: 'gradient' },
  // 绿色自然 - 顶部绿色块
  { name: 'green-nature', label: '自然绿', bg: 'F0FDF4', primary: '15803D', text: '14532D', muted: '86EFAC', layout: 'full', decoration: 'shape' },
  // 橙色渐变 - 右侧橙色装饰
  { name: 'orange-gradient', label: '橙色渐变', bg: 'FFF7ED', primary: 'C2410C', text: '7C2D12', muted: 'FDBA74', layout: 'full', decoration: 'gradient' },
]

export function getTheme(name?: string): ThemeConfig {
  return themes.find(t => t.name === name) || themes[0]
}
