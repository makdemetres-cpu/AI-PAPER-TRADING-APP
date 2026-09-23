import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { TERMS_BY_ID } from '../glossary/terms'

export function Term({ id, children }: { id: string; children?: ReactNode }) {
  const term = TERMS_BY_ID[id]
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLSpanElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const pop = useRef<HTMLSpanElement>(null)
  const popId = useId()

  useLayoutEffect(() => {
    const el = pop.current
    if (!open || !el) return
    el.style.left = '0px'
    const rect = el.getBoundingClientRect()
    const overflow = rect.right - (window.innerWidth - 16)
    if (overflow > 0) el.style.left = `${-Math.min(overflow, rect.left - 16)}px`
  }, [open])

  useEffect(() => {
    if (!open) return
    function onDown(event: MouseEvent) {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!term) throw new Error(`Unknown glossary term: ${id}`)
  const label = children ?? term.term

  return (
    <span className="term" ref={wrap}>
      {label}
      <button
        ref={button}
        type="button"
        className="term-button"
        aria-label={`What is “${term.term}”?`}
        aria-expanded={open}
        aria-controls={popId}
        onClick={() => setOpen((o) => !o)}
      >
        ?
      </button>
      {open && (
        <span ref={pop} className="term-pop" id={popId} role="dialog" aria-label={term.term}>
          <strong className="term-pop-title">{term.term}</strong>
          <span className="term-pop-eli5">{term.eli5}</span>
          <span className="term-pop-def">{term.definition}</span>
          <span className="term-pop-example">
            <span className="faint">Example: </span>
            {term.example}
          </span>
        </span>
      )}
    </span>
  )
}
