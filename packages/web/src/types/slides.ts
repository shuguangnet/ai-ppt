export interface Slide {
  id: string
  layout: 'title' | 'content' | 'section' | 'thanks'
  title: string
  subtitle?: string
  bullets?: string[]
}

export interface PptData {
  title: string
  slides: Slide[]
}
