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

const THEMES: Record<string, { bg: string; primary: string; text: string; muted: string }> = {
  dark:   { bg: '0F172A', primary: '3B82F6', text: 'FFFFFF', muted: '94A3B8' },
  light:  { bg: 'FFFFFF', primary: '2563EB', text: '1E293B', muted: '64748B' },
  green:  { bg: '022C22', primary: '10B981', text: 'ECFDF5', muted: '6EE7B7' },
  purple: { bg: '1E1B4B', primary: '8B5CF6', text: 'F5F3FF', muted: 'A78BFA' },
  warm:   { bg: '1C1917', primary: 'F59E0B', text: 'FEFCE8', muted: 'FCD34D' },
}

export async function generatePptx(data: PptData): Promise<Buffer> {
  const T = THEMES[data.theme || 'dark'] || THEMES.dark

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
    s.background = { color: T.bg }
    const imgData = slide.imageUrl ? imageMap.get(slide.imageUrl) : undefined

    switch (slide.layout) {
      case 'title':
        s.addText(slide.title, {
          x: 0.8, y: 2.0, w: '85%', h: 1.5,
          fontSize: slide.titleStyle?.fontSize || 36,
          bold: slide.titleStyle?.bold ?? true,
          italic: slide.titleStyle?.italic || false,
          color: slide.titleStyle?.color || T.text,
          align: 'center',
        })
        if (slide.subtitle) {
          s.addText(slide.subtitle, {
            x: 0.8, y: 3.8, w: '85%', h: 0.8,
            fontSize: slide.subtitleStyle?.fontSize || 18,
            bold: slide.subtitleStyle?.bold || false,
            italic: slide.subtitleStyle?.italic || false,
            color: slide.subtitleStyle?.color || T.muted,
            align: 'center',
          })
        }
        s.addShape(pptx.ShapeType.rect, {
          x: 4.5, y: 5.2, w: 4.3, h: 0.06, fill: { color: T.primary },
        })
        break

      case 'content':
        s.addText(slide.title, {
          x: 0.8, y: 0.4, w: '85%', h: 0.8,
          fontSize: slide.titleStyle?.fontSize || 28,
          bold: slide.titleStyle?.bold ?? true,
          italic: slide.titleStyle?.italic || false,
          color: slide.titleStyle?.color || T.text,
        })
        s.addShape(pptx.ShapeType.rect, {
          x: 0.8, y: 1.2, w: 2.0, h: 0.06, fill: { color: T.primary },
        })
        if (slide.bullets) {
          const bw = slide.imageUrl ? '45%' : '85%'
          const bulletText = slide.bullets.map(b => ({
            text: b,
            options: { bullet: { code: '25CF' }, indentLevel: 0 },
          }))
          s.addText(bulletText, {
            x: 0.8, y: 1.6, w: bw, h: 4.5,
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
        s.addText(slide.title, {
          x: 0.8, y: 2.5, w: '85%', h: 1.2,
          fontSize: slide.titleStyle?.fontSize || 32,
          bold: slide.titleStyle?.bold ?? true,
          italic: slide.titleStyle?.italic || false,
          color: slide.titleStyle?.color || T.text,
          align: 'center',
        })
        s.addShape(pptx.ShapeType.rect, {
          x: 5.0, y: 3.8, w: 3.3, h: 0.06, fill: { color: T.primary },
        })
        break

      case 'thanks':
        s.addText(slide.title, {
          x: 0.8, y: 2.0, w: '85%', h: 1.5,
          fontSize: slide.titleStyle?.fontSize || 36,
          bold: slide.titleStyle?.bold ?? true,
          italic: slide.titleStyle?.italic || false,
          color: slide.titleStyle?.color || T.text,
          align: 'center',
        })
        if (slide.subtitle) {
          s.addText(slide.subtitle, {
            x: 0.8, y: 3.8, w: '85%', h: 0.8,
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
