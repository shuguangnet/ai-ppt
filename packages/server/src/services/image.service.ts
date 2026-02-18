import 'dotenv/config'

interface ImageConfig {
  apiKey?: string
  provider?: 'pexels' | 'unsplash'
}

async function fetchAsBase64(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) return ''
  const buf = Buffer.from(await res.arrayBuffer())
  const mime = res.headers.get('content-type') || 'image/jpeg'
  return `data:${mime};base64,${buf.toString('base64')}`
}

async function searchPexels(keyword: string, apiKey?: string): Promise<string> {
  const key = apiKey || process.env.PEXELS_API_KEY
  if (!key) return ''
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=3&size=medium`,
      { headers: { Authorization: key } },
    )
    if (!res.ok) return ''
    const data = await res.json()
    const photos = data.photos || []
    const photo = photos[Math.floor(Math.random() * photos.length)]
    return photo?.src?.large || ''
  } catch {
    return ''
  }
}

async function searchUnsplash(keyword: string, apiKey?: string): Promise<string> {
  const key = apiKey || process.env.UNSPLASH_API_KEY
  if (!key) return ''
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=3&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` } },
    )
    if (!res.ok) return ''
    const data = await res.json()
    const photos = data.results || []
    if (!photos.length) return ''
    const photo = photos[Math.floor(Math.random() * photos.length)]
    return photo?.urls?.regular || ''
  } catch {
    return ''
  }
}

async function searchWikimedia(keyword: string): Promise<string> {
  try {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(keyword)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`
    const res = await fetch(api)
    if (!res.ok) return ''
    const data = await res.json()
    const pages = Object.values(data.query?.pages || {}) as any[]
    const imgs = pages.filter(p => p.imageinfo?.[0]?.thumburl).map(p => p.imageinfo[0].thumburl)
    if (!imgs.length) return ''
    return imgs[Math.floor(Math.random() * imgs.length)]
  } catch {
    return ''
  }
}

export async function searchImage(keyword: string, config?: ImageConfig): Promise<string> {
  const { apiKey, provider } = config || {}

  // 根据配置的 provider 或默认顺序搜索
  if (provider === 'unsplash') {
    let url = await searchUnsplash(keyword, apiKey)
    if (!url) url = await searchWikimedia(keyword)
    return url
  }

  // 默认 pexels
  let url = await searchPexels(keyword, apiKey)
  if (!url) url = await searchWikimedia(keyword)
  return url
}

export async function downloadImage(url: string): Promise<string> {
  if (!url) return ''
  if (url.startsWith('data:')) return url
  try {
    return await fetchAsBase64(url)
  } catch {
    return ''
  }
}
