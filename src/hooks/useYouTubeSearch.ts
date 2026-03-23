import { useState, useCallback, useRef } from 'react'
import type { KeywordResult } from '../types'
import { searchVideos } from '../services/youtube'

export function useYouTubeSearch() {
  const [results, setResults] = useState<KeywordResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const abortRef = useRef(false)

  const startSearch = useCallback(async (keywords: string[]) => {
    abortRef.current = false
    setIsSearching(true)

    // Initialize all keyword results
    const initial: KeywordResult[] = keywords.map((keyword) => ({
      keyword,
      videos: [],
      status: 'idle',
    }))
    setResults(initial)

    // Search sequentially
    for (let i = 0; i < keywords.length; i++) {
      if (abortRef.current) break

      // Mark current keyword as loading
      setResults((prev) =>
        prev.map((r, idx) =>
          idx === i ? { ...r, status: 'loading' } : r
        )
      )

      try {
        const videos = await searchVideos(keywords[i])
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, videos, status: 'success' } : r
          )
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: 'error', error: message } : r
          )
        )
      }
    }

    setIsSearching(false)
  }, [])

  const clearResults = useCallback(() => {
    abortRef.current = true
    setResults([])
    setIsSearching(false)
  }, [])

  const progress = {
    current: results.filter((r) => r.status === 'success' || r.status === 'error').length,
    total: results.length,
  }

  return {
    results,
    isSearching,
    progress,
    startSearch,
    clearResults,
  }
}
