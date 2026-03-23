import styles from './KeywordList.module.css'

interface Props {
  keywords: string[]
  onRemove: (index: number) => void
}

export default function KeywordList({ keywords, onRemove }: Props) {
  if (keywords.length === 0) return null

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        Keywords ({keywords.length})
      </p>
      <div className={styles.tags}>
        {keywords.map((kw, index) => (
          <span key={index} className={styles.tag}>
            {kw}
            <button
              className={styles.removeBtn}
              onClick={() => onRemove(index)}
              aria-label={`Remove ${kw}`}
            >
              x
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
