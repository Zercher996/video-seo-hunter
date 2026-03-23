export interface Video {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  viewCount: number
  publishedAt: string
  url: string
}

export interface KeywordResult {
  keyword: string
  videos: Video[]
  status: 'idle' | 'loading' | 'success' | 'error'
  error?: string
}
