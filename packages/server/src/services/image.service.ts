import 'dotenv/config'

async function fetchAsBase64(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) return ''
  const buf = Buffer.from(await res.arrayBuffer())
  const mime = res.headers.get('content-type') || 'image/jpeg'
  return `data:${mime};base64,${buf.toString('base64')}`
}

async function searchPexels(keyword: string): Promise<string> {
  const key = process.env.PEXELS_API_KEY
  if (!key) return ''
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=3&size=medium`,
    { headers: { Authorization: key } },
  )
  if (!res.ok) return ''
  const data = await res.json()
  // Pick a random one from top 3 for variety
  const photos = data.photos || []
  const photo = photos[Math.floor(Math.random() * photos.length)]
  return photo?.src?.large || ''
}

export async function searchImage(keyword: string): Promise<string> {
  // Try Pexels first (relevant, high quality)
  let url = await searchPexels(keyword)
  // Fallback: Wikimedia Commons (free, no API key, keyword-based)
  if (!url) url = await searchWikimedia(keyword)
  return url
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

export async function downloadImage(url: string): Promise<string> {
  if (!url) return ''
  if (url.startsWith('data:')) return url
  try {
    return await fetchAsBase64(url)
  } catch {
    return ''
  }
}
