import { joinWords } from '../../utils/segmenter'
import styles from './KeywordBuilder.module.css'

interface Props {
  selectedWords: string[]
  onConfirm: () => void
  onClear: () => void
}

export default function KeywordBuilder({ selectedWords, onConfirm, onClear }: Props) {
  if (selectedWords.length === 0) return null

  const preview = joinWords(selectedWords)

  return (
    <div className={styles.container}>
      <div className={styles.preview}>
        <span className={styles.label}>Current keyword:</span>
        <span className={styles.keyword}>{preview}</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.confirmBtn} onClick={onConfirm}>
          + Add Keyword
        </button>
        <button className={styles.clearBtn} onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  )
}
