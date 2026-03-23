import type { Video } from '../types'

export async function searchVideos(keyword: string): Promise<Video[]> {
  const params = new URLSearchParams({ keyword })
  const res = await fetch(`/api/youtube/search?${params}`)

  if (!res.ok) {
    const text = await res.text()
    let message = `搜索失败 (${res.status})`
    try {
      const data = JSON.parse(text)
      message = data.error || message
    } catch {
      if (text.includes('const YOUT') || text.includes('require')) {
        message = 'API 服务器未启动。请运行 "vercel dev" 或 "npm run dev:api"'
      }
    }
    throw new Error(message)
  }

  const data: { videos: Video[] } = await res.json()
  return data.videos
}
