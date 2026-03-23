const CHINESE_REGEX = /[\u4e00-\u9fff]/

/** Check if text contains Chinese characters */
function containsChinese(text: string): boolean {
  return CHINESE_REGEX.test(text)
}

/** Check if a single character is Chinese */
function isChineseChar(char: string): boolean {
  return CHINESE_REGEX.test(char)
}

/**
 * Segment Chinese text using Intl.Segmenter.
 * Falls back to per-character splitting if Segmenter is not available.
 */
function segmentChinese(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
    const segments = segmenter.segment(text)
    return Array.from(segments)
      .filter((s) => s.isWordLike)
      .map((s) => s.segment)
  }

  // Fallback: extract continuous Chinese character blocks and alphanumeric blocks
  return text.match(/[\u4e00-\u9fff]+|[a-zA-Z0-9]+/g) ?? []
}

/**
 * Segment a title into words.
 * - English/numeric tokens: split by whitespace (same as before)
 * - Chinese tokens: use Intl.Segmenter for word-level segmentation
 */
export function segmentTitle(title: string): string[] {
  // First pass: split by whitespace
  const tokens = title.split(/\s+/).filter(Boolean)
  const result: string[] = []

  for (const token of tokens) {
    if (containsChinese(token)) {
      result.push(...segmentChinese(token))
    } else {
      result.push(token)
    }
  }

  return result.filter(Boolean)
}

/**
 * Intelligently join words into a keyword string.
 * - Chinese + Chinese: no space (e.g. "无线遥控")
 * - Otherwise: space-separated (e.g. "wireless remote")
 */
export function joinWords(words: string[]): string {
  if (words.length === 0) return ''
  if (words.length === 1) return words[0]

  let result = words[0]
  for (let i = 1; i < words.length; i++) {
    const prevLastChar = result[result.length - 1]
    const currFirstChar = words[i][0]

    if (isChineseChar(prevLastChar) && isChineseChar(currFirstChar)) {
      result += words[i]
    } else {
      result += ' ' + words[i]
    }
  }

  return result
}
