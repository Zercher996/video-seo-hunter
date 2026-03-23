import styles from './LoadingSpinner.module.css'

interface Props {
  message?: string
}

export default function LoadingSpinner({ message }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}
