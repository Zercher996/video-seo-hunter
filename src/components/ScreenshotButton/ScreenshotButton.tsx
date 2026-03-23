import { useState, useCallback, useRef } from 'react'
import html2canvas from 'html2canvas'
import styles from './ScreenshotButton.module.css'

interface Props {
  targetRef?: React.RefObject<HTMLElement | null>
}

export default function ScreenshotButton({ targetRef }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const capture = useCallback(async () => {
    setStatus('loading')

    try {
      const element = targetRef?.current ?? document.documentElement

      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
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
    }
  }, [targetRef])

  const getTooltipText = () => {
    switch (status) {
      case 'loading':
        return 'Capturing...'
      case 'success':
        return 'Screenshot saved!'
      case 'error':
        return 'Capture failed'
      default:
        return 'Save screenshot'
    }
  }

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${status === 'loading' ? styles.capturing : ''}`}
        onClick={capture}
        disabled={status === 'loading'}
        aria-label="Take screenshot"
        aria-busy={status === 'loading'}
      >
        <span className={styles.icon}>
          {status === 'loading' ? '⏳' : status === 'success' ? '✅' : status === 'error' ? '❌' : '📸'}
        </span>
        <span>Screenshot</span>
        <span className={`${styles.tooltip} ${styles[status]}`}>{getTooltipText()}</span>
      </button>
    </div>
  )
}
