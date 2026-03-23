import { useState } from 'react'
import styles from './TitleInput.module.css'

interface Props {
  onAnalyze: (title: string) => void
}

export default function TitleInput({ onAnalyze }: Props) {
  const [title, setTitle] = useState('')

  const handleSubmit = () => {
    const trimmed = title.trim()
    if (trimmed) {
      onAnalyze(trimmed)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your video title here..."
        />
        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={!title.trim()}
        >
          Split Words
        </button>
      </div>
    </div>
  )
}
