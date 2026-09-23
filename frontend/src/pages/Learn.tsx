import { useEffect, useMemo, useState } from 'react'
import { TermPicture } from '../glossary/pictures'
import { CATEGORIES, TERMS, TERMS_BY_ID, type Category, type Term } from '../glossary/terms'
import { Link } from '../router'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function firstLetter(term: Term): string {
  const c = term.term.trim()[0].toUpperCase()
  return /[A-Z]/.test(c) ? c : '#'
}

function matches(term: Term, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return [term.term, term.eli5, term.definition, term.id].some((text) => text.toLowerCase().includes(q))
}

export function Learn({ focusId }: { focusId: string | null }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'All'>('All')

  const shown = useMemo(
    () =>
      TERMS.filter((t) => (category === 'All' || t.category === category) && matches(t, query)).sort((a, b) =>
        a.term.localeCompare(b.term),
      ),
    [query, category],
  )
  const letters = new Set(shown.map(firstLetter))

  useEffect(() => {
    if (!focusId || !TERMS_BY_ID[focusId]) return
    setQuery('')
    setCategory('All')
    window.requestAnimationFrame(() => {
      const el = document.getElementById(`term-${focusId}`)
      el?.scrollIntoView({ block: 'start' })
      el?.focus({ preventScroll: true })
    })
  }, [focusId])

  function jump(letter: string) {
    document.getElementById(`letter-${letter}`)?.scrollIntoView({ block: 'start' })
  }

  let lastLetter = ''
  return (
    <>
      <div className="stack" style={{ gap: 6 }}>
        <h1>Learn the Words</h1>
        <p className="muted">
          {TERMS.length} trading and crypto words, each explained simply first, then properly, with an example.
        </p>
      </div>

      <section className="card stack" style={{ gap: 16 }} aria-label="Find a word">
        <label htmlFor="learn-search" className="visually-hidden">
          Search words
        </label>
        <input
          id="learn-search"
          className="input"
          type="search"
          placeholder="Search, like “spread” or “wallet”"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="chips" role="group" aria-label="Category">
          {(['All', ...CATEGORIES] as const).map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <nav className="az" aria-label="Jump to letter">
          {ALPHABET.map((l) => (
            <button key={l} type="button" disabled={!letters.has(l)} onClick={() => jump(l)}>
              {l}
            </button>
          ))}
        </nav>
      </section>

      {shown.length === 0 ? (
        <p className="empty">
          No word matches “{query}”{category !== 'All' ? ` in ${category}` : ''}.
        </p>
      ) : (
        <div className="term-grid">
          {shown.map((term) => {
            const letter = firstLetter(term)
            const heading =
              letter !== lastLetter ? (
                <h2 key={`h-${letter}`} id={`letter-${letter}`} className="letter-heading">
                  {letter}
                </h2>
              ) : null
            lastLetter = letter
            return [heading, <TermCard key={term.id} term={term} highlight={term.id === focusId} />]
          })}
        </div>
      )}
    </>
  )
}

function TermCard({ term, highlight }: { term: Term; highlight: boolean }) {
  return (
    <article
      id={`term-${term.id}`}
      className={`card term-card${highlight ? ' highlight' : ''}`}
      tabIndex={-1}
      aria-labelledby={`term-${term.id}-title`}
    >
      <TermPicture id={term.id} />
      <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}>
        <h3 id={`term-${term.id}-title`}>{term.term}</h3>
        <span className="xsmall faint">{term.category}</span>
      </div>
      <p>{term.eli5}</p>
      <p className="small muted">{term.definition}</p>
      <p className="small">
        <span className="faint">Example: </span>
        {term.example}
      </p>
      {term.related.length > 0 && (
        <div className="related" aria-label="Related words">
          {term.related.map((id) => (
            <Link key={id} href={`/learn/${id}`}>
              {TERMS_BY_ID[id]?.term ?? id}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
