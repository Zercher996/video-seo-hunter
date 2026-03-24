import { useMemo } from 'react'
import { useWordSelector } from './hooks/useWordSelector'
import { useYouTubeSearch } from './hooks/useYouTubeSearch'
import TitleInput from './components/TitleInput/TitleInput'
import WordBubbles from './components/WordBubbles/WordBubbles'
import KeywordBuilder from './components/KeywordBuilder/KeywordBuilder'
import KeywordList from './components/KeywordList/KeywordList'
import SearchButton from './components/SearchButton/SearchButton'
import ResultsPanel from './components/ResultsPanel/ResultsPanel'
import ScreenshotButton from './components/ScreenshotButton/ScreenshotButton'
import styles from './App.module.css'

export default function App() {
  const {
    words,
    selectedIndices,
    keywords,
    analyzeTitle,
    toggleWord,
    confirmKeyword,
    clearSelection,
    removeKeyword,
    resetAll,
  } = useWordSelector()

  const { results, isSearching, progress, startSearch, clearResults } = useYouTubeSearch()

  const selectedWords = useMemo(() => {
    return Array.from(selectedIndices)
      .sort((a, b) => a - b)
      .map((i) => words[i])
  }, [selectedIndices, words])

  const handleAnalyze = (title: string) => {
    clearResults()
    resetAll()
    analyzeTitle(title)
  }

  const handleSearch = () => {
    if (keywords.length > 0) {
      startSearch(keywords)
    }
  }

  return (
    <div className={styles.app}>
      <ScreenshotButton />
      <header className={styles.hero}>
        <h1 className={styles.title}>Video SEO Hunter</h1>
        <p className={styles.subtitle}>
          Analyze video titles, extract SEO keywords, find top-performing YouTube videos
        </p>
      </header>

      <main className={styles.main}>
        {/* Step 1: Input title */}
        <section className={styles.section}>
          <TitleInput onAnalyze={handleAnalyze} />
        </section>

        {/* Step 2 & 3: Word bubbles + keyword composition */}
        {words.length > 0 && (
          <section className={styles.section}>
            <WordBubbles
              words={words}
              selectedIndices={selectedIndices}
              onToggle={toggleWord}
            />
            <KeywordBuilder
              selectedWords={selectedWords}
              onConfirm={confirmKeyword}
              onClear={clearSelection}
            />
            <KeywordList keywords={keywords} onRemove={removeKeyword} />
          </section>
        )}

        {/* Step 4: Search */}
        {keywords.length > 0 && (
          <section className={styles.section}>
            <SearchButton
              keywordCount={keywords.length}
              loading={isSearching}
              onSearch={handleSearch}
              progress={progress}
            />
          </section>
        )}

        {/* Step 5: Results */}
        {results.length > 0 && (
          <section className={styles.section}>
            <ResultsPanel results={results} />
          </section>
        )}
      </main>
    </div>
  )
}
