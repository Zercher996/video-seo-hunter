import { useState, useCallback, useRef } from 'react'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import styles from './ScreenshotButton.module.css'

export default function ScreenshotButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const captureFullPage = useCallback(async () => {
    setStatus('loading')

    if (containerRef.current) {
      containerRef.current.style.visibility = 'hidden'
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 100))

      const canvas = await html2canvas(document.documentElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0f0f0f',
        scale: 2,
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `video-seo-hunter-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      link.click()

      setStatus('success')

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setStatus('idle')
      }, 2000)
    } catch {
      setStatus('error')

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setStatus('idle')
      }, 3000)
    } finally {
      if (containerRef.current) {
        containerRef.current.style.visibility = 'visible'
      }
    }
  }, [])

  const captureByKeywords = useCallback(async () => {
    setStatus('loading')
    setProgress({ current: 0, total: 0 })

    try {
      const resultGroups = document.querySelectorAll('[data-keyword-group]')
      const total = resultGroups.length

      if (total === 0) {
        throw new Error('No keyword results found')
      }

      setProgress({ current: 0, total })

      const zip = new JSZip()
      const timestamp = Date.now()

      for (let i = 0; i < resultGroups.length; i++) {
        const group = resultGroups[i] as HTMLElement
        const keyword = group.getAttribute('data-keyword') || `keyword-${i + 1}`

        const canvas = await html2canvas(group, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#0f0f0f',
          scale: 2,
          logging: false,
        })

        const dataUrl = canvas.toDataURL('image/png', 1.0)
        const base64 = dataUrl.split(',')[1]
        const fileName = `video-seo-hunter-${keyword.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.png`
        zip.file(fileName, base64, { base64: true })

        setProgress({ current: i + 1, total })
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.download = `video-seo-hunter-screenshots-${timestamp}.zip`
      link.href = URL.createObjectURL(zipBlob)
      link.click()
      URL.revokeObjectURL(link.href)

      setStatus('success')

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setStatus('idle')
        setProgress({ current: 0, total: 0 })
      }, 3000)
    } catch {
      setStatus('error')

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setStatus('idle')
        setProgress({ current: 0, total: 0 })
      }, 3000)
    }
  }, [])

  const getTooltipText = () => {
    switch (status) {
      case 'loading':
        return progress.total > 0
          ? `Capturing ${progress.current}/${progress.total}...`
          : 'Capturing...'
      case 'success':
        return progress.total > 0
          ? `Saved ${progress.total} screenshots!`
          : 'Screenshot saved!'
      case 'error':
        return 'Capture failed'
      default:
        return 'Save screenshots'
    }
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        className={`${styles.button} ${status === 'loading' ? styles.capturing : ''}`}
        onClick={captureFullPage}
        disabled={status === 'loading'}
        aria-label="Take full page screenshot"
        aria-busy={status === 'loading'}
      >
        <span className={styles.icon}>
          {status === 'loading' ? '⏳' : status === 'success' ? '✅' : status === 'error' ? '❌' : '📸'}
        </span>
        <span>Screenshot</span>
        <span className={`${styles.tooltip} ${styles[status]}`}>{getTooltipText()}</span>
      </button>
      <button
        className={`${styles.button} ${styles.secondary} ${status === 'loading' ? styles.capturing : ''}`}
        onClick={captureByKeywords}
        disabled={status === 'loading'}
        aria-label="Capture by keywords"
        aria-busy={status === 'loading'}
      >
        <span className={styles.icon}>🔍</span>
        <span>By Keyword</span>
      </button>
    </div>
  )
}