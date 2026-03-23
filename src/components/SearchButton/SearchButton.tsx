import styles from './SearchButton.module.css'

interface Props {
  keywordCount: number
  loading: boolean
  onSearch: () => void
  progress?: { current: number; total: number }
}

export default function SearchButton({ keywordCount, loading, onSearch, progress }: Props) {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${loading ? styles.loading : ''}`}
        onClick={onSearch}
        disabled={keywordCount === 0 || loading}
        aria-busy={loading}
      >
        {loading
          ? `Searching... (${progress?.current ?? 0}/${progress?.total ?? 0})`
          : `Search YouTube (${keywordCount} keywords)`}
      </button>
    </div>
  )
}
