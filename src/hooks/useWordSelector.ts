import { useState, useCallback, useMemo } from 'react'
import { segmentTitle, joinWords } from '../utils/segmenter'

export function useWordSelector() {
  const [words, setWords] = useState<string[]>([])
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())
  const [keywords, setKeywords] = useState<string[]>([])

  const currentKeywordPreview = useMemo(() => {
    const sorted = Array.from(selectedIndices).sort((a, b) => a - b)
    return joinWords(sorted.map((i) => words[i]))
  }, [selectedIndices, words])

  const analyzeTitle = useCallback((title: string) => {
    const result = segmentTitle(title)
    setWords(result)
    setSelectedIndices(new Set())
    setKeywords([])
  }, [])

  const toggleWord = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }, [])

  const confirmKeyword = useCallback(() => {
    if (selectedIndices.size === 0) return

    const sorted = Array.from(selectedIndices).sort((a, b) => a - b)
    const keyword = joinWords(sorted.map((i) => words[i]))

    setKeywords((prev) => {
      if (prev.includes(keyword)) return prev
      return [...prev, keyword]
    })
    setSelectedIndices(new Set())
  }, [selectedIndices, words])

  const clearSelection = useCallback(() => {
    setSelectedIndices(new Set())
  }, [])

  const removeKeyword = useCallback((index: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const resetAll = useCallback(() => {
    setWords([])
    setSelectedIndices(new Set())
    setKeywords([])
  }, [])

  return {
    words,
    selectedIndices,
    currentKeywordPreview,
    keywords,
    analyzeTitle,
    toggleWord,
    confirmKeyword,
    clearSelection,
    removeKeyword,
    resetAll,
  }
}
