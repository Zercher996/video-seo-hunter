import type { Video } from '../../types'
import styles from './VideoCard.module.css'

function formatViewCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M views`
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K views`
  }
  return `${count} views`
}

interface Props {
  video: Video
}

export default function VideoCard({ video }: Props) {
  return (
    <a
      className={styles.card}
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.thumbnailWrap}>
        <img
          className={styles.thumbnail}
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
        />
        <span className={styles.views}>{formatViewCount(video.viewCount)}</span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{video.title}</h3>
        <p className={styles.channel}>{video.channelTitle}</p>
      </div>
    </a>
  )
}
