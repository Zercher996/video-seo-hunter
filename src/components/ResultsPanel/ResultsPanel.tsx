import type { KeywordResult } from '../../types'
import VideoCard from '../VideoCard/VideoCard'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import styles from './ResultsPanel.module.css'

interface Props {
  results: KeywordResult[]
}

export default function ResultsPanel({ results }: Props) {
  if (results.length === 0) return null

  return (
    <div className={styles.container} data-results-container>
      {results.map((result) => (
        <section key={result.keyword} className={styles.group} data-keyword-group data-keyword={result.keyword}>
          <div className={styles.header}>
            <h2 className={styles.keyword}>{result.keyword}</h2>
            {result.status === 'success' && (
              <span className={styles.count}>{result.videos.length} videos</span>
            )}
          </div>

          {result.status === 'loading' && (
            <LoadingSpinner message={`Searching "${result.keyword}"...`} />
          )}

          {result.status === 'error' && (
            <div className={styles.error}>{result.error}</div>
          )}

          {result.status === 'success' && result.videos.length === 0 && (
            <div className={styles.empty}>No videos found</div>
          )}

          {result.status === 'success' && result.videos.length > 0 && (
            <div className={styles.grid} data-video-grid>
              {result.videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}