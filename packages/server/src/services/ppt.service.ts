import PptxGenJS from 'pptxgenjs'

interface Slide {
  layout: 'title' | 'content' | 'section' | 'thanks'
  title: string
  subtitle?: string
  bullets?: string[]
}

interface PptData {
  title: string
  slides: Slide[]
}

const THEME = {
  bg: '0F172A',
  primary: '3B82F6',
  text: 'FFFFFF',
  muted: '94A3B8',
}

export async function generatePptx(data: PptData): Promise<Buffer> {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'AI PPT Platform'
  pptx.title = data.title

  for (const slide of data.slides) {
    const s = pptx.addSlide()
    s.background = { color: THEME.bg }

    switch (slide.layout) {
      case 'title':
        s.addText(slide.title, {
          x: 0.8, y: 2.0, w: '85%', h: 1.5,
          fontSize: 36, bold: true, color: THEME.text, align: 'center',
        })
        if (slide.subtitle) {
          s.addText(slide.subtitle, {
            x: 0.8, y: 3.8, w: '85%', h: 0.8,
            fontSize: 18, color: THEME.muted, align: 'center',
          })
        }
        s.addShape(pptx.ShapeType.rect, {
          x: 4.5, y: 5.2, w: 4.3, h: 0.06, fill: { color: THEME.primary },
        })
        break

      case 'content':
        s.addText(slide.title, {
          x: 0.8, y: 0.4, w: '85%', h: 0.8,
          fontSize: 28, bold: true, color: THEME.text,
        })
        s.addShape(pptx.ShapeType.rect, {
          x: 0.8, y: 1.2, w: 2.0, h: 0.06, fill: { color: THEME.primary },
        })
        if (slide.bullets) {
          const bulletText = slide.bullets.map(b => ({
            text: b,
            options: { bullet: { code: '25CF' }, indentLevel: 0 },
          }))
          s.addText(bulletText, {
            x: 0.8, y: 1.6, w: '85%', h: 4.5,
            fontSize: 18, color: THEME.text, lineSpacingMultiple: 1.5,
          })
        }
        break

      case 'section':
        s.addText(slide.title, {
          x: 0.8, y: 2.5, w: '85%', h: 1.2,
          fontSize: 32, bold: true, color: THEME.text, align: 'center',
        })
        s.addShape(pptx.ShapeType.rect, {
          x: 5.0, y: 3.8, w: 3.3, h: 0.06, fill: { color: THEME.primary },
        })
        break

      case 'thanks':
        s.addText(slide.title, {
          x: 0.8, y: 2.0, w: '85%', h: 1.5,
          fontSize: 36, bold: true, color: THEME.text, align: 'center',
        })
        if (slide.subtitle) {
          s.addText(slide.subtitle, {
            x: 0.8, y: 3.8, w: '85%', h: 0.8,
            fontSize: 16, color: THEME.muted, align: 'center',
          })
        }
        break
    }
  }

  return pptx.write({ outputType: 'nodebuffer' }) as Promise<Buffer>
}
