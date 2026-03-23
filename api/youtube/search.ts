import type { VercelRequest, VercelResponse } from '@vercel/node'

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3'
const MIN_DURATION_SECONDS = 2 * 60
const MAX_DURATION_SECONDS = 20 * 60

interface YouTubeSearchItem {
  id: { videoId: string }
  snippet: {
    title: string
    thumbnails: { medium: { url: string } }
    channelTitle: string
    publishedAt: string
  }
}

interface YouTubeVideoItem {
  id: string
  statistics: { viewCount: string }
  contentDetails: { duration: string }
}

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || '0', 10)
  const minutes = parseInt(match[2] || '0', 10)
  const seconds = parseInt(match[3] || '0', 10)
  return hours * 3600 + minutes * 60 + seconds
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'YouTube API Key 未配置' })
  }

  const keyword = req.query.keyword
  if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
    return res.status(400).json({ error: '缺少 keyword 参数' })
  }

  // 限制关键词长度，防止滥用
  if (keyword.length > 200) {
    return res.status(400).json({ error: '关键词过长' })
  }

  try {
    // Step 1: 搜索视频
    const searchParams = new URLSearchParams({
      key: apiKey,
      part: 'snippet',
      q: keyword.trim(),
      type: 'video',
      order: 'viewCount',
      maxResults: '50',
    })

    const searchRes = await fetch(`${YOUTUBE_BASE_URL}/search?${searchParams}`)

    if (!searchRes.ok) {
      if (searchRes.status === 403) {
        return res.status(429).json({ error: 'YouTube API 配额已用完，请明天再试' })
      }
      return res.status(searchRes.status).json({ error: `YouTube 搜索失败 (${searchRes.status})` })
    }

    const searchData = await searchRes.json()

    if (!searchData.items || searchData.items.length === 0) {
      return res.status(200).json({ videos: [] })
    }

    // Step 2: 获取视频统计和时长
    const videoIds = searchData.items.map((item: YouTubeSearchItem) => item.id.videoId).join(',')
    const statsParams = new URLSearchParams({
      key: apiKey,
      part: 'statistics,contentDetails',
      id: videoIds,
    })

    const statsRes = await fetch(`${YOUTUBE_BASE_URL}/videos?${statsParams}`)

    if (!statsRes.ok) {
      return res.status(statsRes.status).json({ error: `获取视频统计数据失败 (${statsRes.status})` })
    }

    const statsData = await statsRes.json()

    const viewCountMap = new Map<string, number>()
    const durationMap = new Map<string, number>()
    for (const item of statsData.items as YouTubeVideoItem[]) {
      viewCountMap.set(item.id, parseInt(item.statistics.viewCount, 10) || 0)
      durationMap.set(item.id, parseDuration(item.contentDetails.duration))
    }

    // Step 3: 过滤、排序、返回
    const videos = (searchData.items as YouTubeSearchItem[])
      .filter((item) => {
        const duration = durationMap.get(item.id.videoId) ?? 0
        return duration >= MIN_DURATION_SECONDS && duration <= MAX_DURATION_SECONDS
      })
      .map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        viewCount: viewCountMap.get(item.id.videoId) ?? 0,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 6)

    // 设置缓存头：相同关键词 5 分钟内复用
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    return res.status(200).json({ videos })
  } catch (err) {
    console.error('YouTube API proxy error:', err)
    return res.status(500).json({ error: '服务器内部错误' })
  }
}
