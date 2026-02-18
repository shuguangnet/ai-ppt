export interface Slide {
  id: string
  layout: 'title' | 'content' | 'section' | 'thanks' | 'image'
  title: string
  subtitle?: string
  bullets?: string[]
  imageUrl?: string
  notes?: string
}

export interface PptData {
  title: string
  theme?: string
  slides: Slide[]
}

export interface ThemeConfig {
  name: string
  label: string
  bg: string
  primary: string
  text: string
  muted: string
}

export interface AIConfig {
  apiKey: string
  baseUrl: string
  model: string
}
