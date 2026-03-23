import styles from './WordBubbles.module.css'

const BUBBLE_COLORS = [
  '#6C5CE7',
  '#00B894',
  '#FD79A8',
  '#FDCB6E',
  '#74B9FF',
  '#FF7675',
]

interface Props {
  words: string[]
  selectedIndices: Set<number>
  onToggle: (index: number) => void
}

export default function WordBubbles({ words, selectedIndices, onToggle }: Props) {
  if (words.length === 0) return null

  return (
    <div className={styles.container}>
      <p className={styles.hint}>Click words to compose a keyword:</p>
      <div className={styles.bubbles}>
        {words.map((word, index) => {
          const isSelected = selectedIndices.has(index)
          const color = BUBBLE_COLORS[index % BUBBLE_COLORS.length]

          return (
            <button
              key={index}
              className={`${styles.bubble} ${isSelected ? styles.selected : ''}`}
              style={{
                '--bubble-color': color,
                '--bubble-color-light': `${color}22`,
              } as React.CSSProperties}
              onClick={() => onToggle(index)}
              role="button"
              aria-pressed={isSelected}
            >
              {word}
            </button>
          )
        })}
      </div>
    </div>
  )
}
