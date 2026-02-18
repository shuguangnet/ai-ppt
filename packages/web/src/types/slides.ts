export interface TextStyle {
  bold?: boolean
  italic?: boolean
  fontSize?: number
  color?: string // hex without #
}

export interface Slide {
  id: string
  layout: 'title' | 'content' | 'section' | 'thanks' | 'image'
  title: string
  subtitle?: string
  bullets?: string[]
  imageUrl?: string
  imageKeyword?: string
  notes?: string
  // Text styles
  titleStyle?: TextStyle
  subtitleStyle?: TextStyle
  bulletStyle?: TextStyle
}

export interface PptData {
  title: string
  theme?: string
  slides: Slide[]
}

export interface ThemeConfig {
  name: string
  label: string
  bg: string // fallback solid color
  bgGradient?: string // gradient CSS
  primary: string
  text: string
  muted: string
  // 布局装饰配置
  layout?: 'full' | 'sidebar' | 'card' // 布局风格
  sidebarWidth?: string // 左侧装饰区宽度，如 '30%'
  sidebarColor?: string // 左侧装饰区颜色
  decoration?: 'none' | 'shape' | 'gradient' | 'image' // 装饰类型
}

export interface AIConfig {
  apiKey: string
  baseUrl: string
  model: string
}

export interface ImageConfig {
  apiKey: string
  provider: 'pexels' | 'unsplash'
}
