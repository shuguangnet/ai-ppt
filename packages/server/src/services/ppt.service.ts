import PptxGenJS from 'pptxgenjs'
import { downloadImage } from './image.service.js'

interface TextStyle {
  bold?: boolean
  italic?: boolean
  fontSize?: number
  color?: string
}

interface Slide {
  layout: 'title' | 'content' | 'section' | 'thanks' | 'image'
  title: string
  subtitle?: string
  bullets?: string[]
  imageUrl?: string
  imageKeyword?: string
  titleStyle?: TextStyle
  subtitleStyle?: TextStyle
  bulletStyle?: TextStyle
}

interface PptData {
  title: string
  theme?: string
  slides: Slide[]
}

interface ThemeStyle {
  bg: string
  bgGradient?: string
  primary: string
  text: string
  muted: string
  layout?: 'full' | 'sidebar'
  sidebarWidth?: number
  sidebarColor?: string
  decoration?: 'none' | 'shape' | 'gradient'
}

const THEMES: Record<string, ThemeStyle> = {
  // 经典
  dark:   { bg: '0F172A', primary: '3B82F6', text: 'FFFFFF', muted: '94A3B8' },
  light:  { bg: 'FFFFFF', primary: '2563EB', text: '1E293B', muted: '64748B' },
  // WPS 风格
  'blue-business': { bg: 'F5F7FA', primary: '2563EB', text: '1E293B', muted: '64748B', layout: 'sidebar', sidebarWidth: 28, sidebarColor: '1E40AF' },
  'green-fresh': { bg: 'F0FDF4', primary: '16A34A', text: '166534', muted: '86EFAC', layout: 'full', decoration: 'shape' },
  'orange-energy': { bg: 'FFFBEB', primary: 'EA580C', text: '7C2D12', muted: 'FDBA74', layout: 'sidebar', sidebarWidth: 25, sidebarColor: 'EA580C' },
  'purple-elegant': { bg: 'FAF5FF', primary: '9333EA', text: '581C87', muted: 'D8B4FE', layout: 'full', decoration: 'gradient' },
  'red-official': { bg: 'FEF2F2', primary: 'DC2626', text: '7F1D1D', muted: 'FCA5A5', layout: 'full', decoration: 'shape' },
  'cyan-tech': { bg: 'ECFEFF', primary: '0891B2', text: '164E63', muted: '67E8F9', layout: 'sidebar', sidebarWidth: 30, sidebarColor: '0891B2' },
  'gold-luxury': { bg: 'FFFBEB', primary: 'CA8A04', text: '713F12', muted: 'FDE047', layout: 'full', decoration: 'gradient' },
  'pink-sweet': { bg: 'FDF2F8', primary: 'DB2777', text: '831843', muted: 'F9A8D4', layout: 'sidebar', sidebarWidth: 22, sidebarColor: 'DB2777' },
  'gray-professional': { bg: 'F8FAFC', primary: '475569', text: '1E293B', muted: '94A3B8', layout: 'sidebar', sidebarWidth: 26, sidebarColor: '334155' },
  'blue-purple': { bg: 'EEF2FF', primary: '4F46E5', text: '312E81', muted: 'A5B4FC', layout: 'full', decoration: 'gradient' },
  'green-nature': { bg: 'F0FDF4', primary: '15803D', text: '14532D', muted: '86EFAC', layout: 'full', decoration: 'shape' },
  'orange-gradient': { bg: 'FFF7ED', primary: 'C2410C', text: '7C2D12', muted: 'FDBA74', layout: 'full', decoration: 'gradient' },
}

export async function generatePptx(data: PptData): Promise<Buffer> {
  const T = THEMES[data.theme || 'dark'] || THEMES.dark
  // Calculate content offset for sidebar layout (sidebarWidth is in percentage, convert to inches)
  // For sidebarWidth like 30 (meaning 30%), the actual sidebar width in inches is: 30/100 * 10 = 3 inches
  const sidebarWidthInches = T.layout === 'sidebar' && T.sidebarWidth ? (T.sidebarWidth / 100) * 10 : 0
  const contentOffset = sidebarWidthInches > 0 ? sidebarWidthInches + 0.5 : 0.8

  // Pre-download all images as base64
  const imageMap = new Map<string, string>()
  await Promise.all(
    data.slides.filter(s => s.imageUrl).map(async (s) => {
      const b64 = await downloadImage(s.imageUrl!)
      if (b64) imageMap.set(s.imageUrl!, b64)
    }),
  )

  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'AI PPT Platform'
  pptx.title = data.title

  for (const slide of data.slides) {
    const s = pptx.addSlide()
    // Set background
    s.background = { color: T.bg }

    // Add sidebar decoration if theme has sidebar layout
    if (T.layout === 'sidebar' && T.sidebarWidth) {
      const sidebarW = T.sidebarWidth / 100 * 10 // Convert percentage to inches (10 is slide width)
      s.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: sidebarW, h: 5.4,
        fill: { color: T.sidebarColor || T.primary },
      })
    }

    // Add top decoration bar if theme has shape decoration
    if (T.decoration === 'shape') {
      s.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 10, h: 0.15,
        fill: { color: T.primary },
      })
    }
    const imgData = slide.imageUrl ? imageMap.get(slide.imageUrl) : undefined

    switch (slide.layout) {
      case 'title':
        // Calculate content width based on sidebar
        const titleContentW = sidebarWidthInches > 0 ? 10 - sidebarWidthInches - 0.6 : 8.5
        s.addText(slide.title, {
          x: sidebarWidthInches > 0 ? sidebarWidthInches + 0.3 : 0.8, y: 2.0, w: titleContentW, h: 1.5,
          fontSize: slide.titleStyle?.fontSize || 36,
          bold: slide.titleStyle?.bold ?? true,
          italic: slide.titleStyle?.italic || false,
          color: slide.titleStyle?.color || T.text,
          align: 'center',
        })
        if (slide.subtitle) {
          s.addText(slide.subtitle, {
            x: sidebarWidthInches > 0 ? sidebarWidthInches + 0.3 : 0.8, y: 3.8, w: titleContentW, h: 0.8,
            fontSize: slide.subtitleStyle?.fontSize || 18,
            bold: slide.subtitleStyle?.bold || false,
            italic: slide.subtitleStyle?.italic || false,
            color: slide.subtitleStyle?.color || T.muted,
            align: 'center',
          })
        }
        // Center the underline relative to content
        const underlineX = sidebarWidthInches > 0 ? sidebarWidthInches + 0.3 + (titleContentW / 2) - 2.15 : 4.5
        s.addShape(pptx.ShapeType.rect, {
          x: underlineX, y: 5.2, w: 4.3, h: 0.06, fill: { color: T.primary },
        })
        break

      case 'content':
        s.addText(slide.title, {
          x: contentOffset, y: 0.4, w: '85%', h: 0.8,
          fontSize: slide.titleStyle?.fontSize || 28,
          bold: slide.titleStyle?.bold ?? true,
          italic: slide.titleStyle?.italic || false,
          color: slide.titleStyle?.color || T.text,
        })
        s.addShape(pptx.ShapeType.rect, {
          x: contentOffset, y: 1.2, w: 2.0, h: 0.06, fill: { color: T.primary },
        })
        if (slide.bullets) {
          const bw = slide.imageUrl ? '45%' : '85%'
          const bulletText = slide.bullets.map(b => ({
            text: b,
            options: { bullet: { code: '25CF' }, indentLevel: 0 },
          }))
          s.addText(bulletText, {
            x: contentOffset, y: 1.6, w: bw, h: 4.5,
            fontSize: slide.bulletStyle?.fontSize || 18,
            bold: slide.bulletStyle?.bold || false,
            italic: slide.bulletStyle?.italic || false,
            color: slide.bulletStyle?.color || T.text,
            lineSpacingMultiple: 1.5,
          })
        }
        if (imgData) {
          s.addImage({
            data: imgData,
            x: 7.2, y: 1.4, w: 5.2, h: 4.2,
            sizing: { type: 'cover', w: 5.2, h: 4.2 },
            rounding: true,
          })
        }
        break

      case 'image':
        s.addText(slide.title, {
          x: 0.8, y: 0.4, w: '85%', h: 0.8,
          fontSize: slide.titleStyle?.fontSize || 24,
          bold: slide.titleStyle?.bold ?? true,
          italic: slide.titleStyle?.italic || false,
          color: slide.titleStyle?.color || T.text,
        })
        if (imgData) {
          s.addImage({
            data: imgData,
            x: 0.8, y: 1.4, w: 7.5, h: 4.2,
            sizing: { type: 'contain', w: 7.5, h: 4.2 },
          })
        }
        if (slide.bullets?.length) {
          s.addText(slide.bullets.join(' | '), {
            x: 0.8, y: 5.8, w: '85%', h: 0.5,
            fontSize: 12, color: T.muted,
          })
        }
        break

      case 'section':
        const sectionContentW = sidebarWidthInches > 0 ? 10 - sidebarWidthInches - 0.6 : 8.5
        s.addText(slide.title, {
          x: sidebarWidthInches > 0 ? sidebarWidthInches + 0.3 : 0.8, y: 2.5, w: sectionContentW, h: 1.2,
          fontSize: slide.titleStyle?.fontSize || 32,
          bold: slide.titleStyle?.bold ?? true,
          italic: slide.titleStyle?.italic || false,
          color: slide.titleStyle?.color || T.text,
          align: 'center',
        })
        const sectionUnderlineX = sidebarWidthInches > 0 ? sidebarWidthInches + 0.3 + (sectionContentW / 2) - 1.65 : 5.0
        s.addShape(pptx.ShapeType.rect, {
          x: sectionUnderlineX, y: 3.8, w: 3.3, h: 0.06, fill: { color: T.primary },
        })
        break

      case 'thanks':
        const thanksContentW = sidebarWidthInches > 0 ? 10 - sidebarWidthInches - 0.6 : 8.5
        s.addText(slide.title, {
          x: sidebarWidthInches > 0 ? sidebarWidthInches + 0.3 : 0.8, y: 2.0, w: thanksContentW, h: 1.5,
          fontSize: slide.titleStyle?.fontSize || 36,
          bold: slide.titleStyle?.bold ?? true,
          italic: slide.titleStyle?.italic || false,
          color: slide.titleStyle?.color || T.text,
          align: 'center',
        })
        if (slide.subtitle) {
          s.addText(slide.subtitle, {
            x: sidebarWidthInches > 0 ? sidebarWidthInches + 0.3 : 0.8, y: 3.8, w: thanksContentW, h: 0.8,
            fontSize: slide.subtitleStyle?.fontSize || 16,
            bold: slide.subtitleStyle?.bold || false,
            italic: slide.subtitleStyle?.italic || false,
            color: slide.subtitleStyle?.color || T.muted,
            align: 'center',
          })
        }
        break
    }
  }

  return pptx.write({ outputType: 'nodebuffer' }) as Promise<Buffer>
}
