import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { api, type Watchlist } from '../api'
import { money } from '../format'
import { useApi } from '../hooks'
import { usePrefs } from '../prefs'
import { Link } from '../router'
import { useWatchlists } from '../watchlists'
import { Change, CoinMark, FreshnessBadge } from './bits'

function NameForm({
  initial = '',
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: string
  submitLabel: string
  onSubmit: (name: string) => Promise<unknown>
  onCancel?: () => void
}) {
  const [name, setName] = useState(initial)
  const [busy, setBusy] = useState(false)
  const id = useId()

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    await onSubmit(name.trim())
    setBusy(false)
    setName('')
  }

  return (
    <form className="row" onSubmit={submit} style={{ gap: 8 }}>
      <label htmlFor={id} className="visually-hidden">
        List name
      </label>
      <input
        id={id}
        className="input"
        style={{ flex: 1, minWidth: 140, padding: '6px 10px' }}
        maxLength={40}
        placeholder="New list name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <button type="submit" className="btn btn-primary" disabled={busy || !name.trim()}>
        {submitLabel}
      </button>
      {onCancel && (
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  )
}

function WatchRow({ list, symbol }: { list: Watchlist; symbol: string }) {
  const { currency } = usePrefs()
  const { drop } = useWatchlists()
  const quote = useApi(`${symbol}:${currency}`, () => api.quote(symbol, currency), 60_000)
  const q = quote.data

  return (
    <li className="watch-row">
      <Link href={`/coin/${symbol}`} className="row" style={{ gap: 10, color: 'var(--text)', minWidth: 0 }}>
        <CoinMark symbol={symbol} />
        <span style={{ minWidth: 0 }}>
          <strong>{symbol}</strong>
          {q && q.name !== symbol && <span className="muted small"> {q.name}</span>}
        </span>
      </Link>
      <span className="watch-price">
        {q?.price ? (
          <>
            <span className="num" style={{ fontWeight: 600 }}>
              {q.converted && '≈ '}
              {money(q.price.value, currency)}
            </span>
            <span className="xsmall">
              <Change pct={q.price.change_24h_pct} missing="24h change n/a" />
            </span>
          </>
        ) : (
          <span className="small faint" title={quote.error?.message}>
            {quote.loading && !q ? 'Loading…' : 'No price'}
          </span>
        )}
      </span>
      <span className="watch-meta">
        {q && <FreshnessBadge freshness={q.freshness} />}
        <button
          type="button"
          className="icon-btn"
          aria-label={`Remove ${symbol} from ${list.name}`}
          title={`Remove from ${list.name}`}
          onClick={() => drop(list.id, symbol)}
        >
          ×
        </button>
      </span>
    </li>
  )
}

function ListBlock({ list }: { list: Watchlist }) {
  const { rename, remove } = useWatchlists()
  const [mode, setMode] = useState<'view' | 'rename' | 'confirm'>('view')

  return (
    <div className="stack" style={{ gap: 8 }}>
      {mode === 'rename' ? (
        <NameForm
          initial={list.name}
          submitLabel="Save"
          onSubmit={async (name) => {
            await rename(list.id, name)
            setMode('view')
          }}
          onCancel={() => setMode('view')}
        />
      ) : (
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3>{list.name}</h3>
          {mode === 'confirm' ? (
            <span className="row small" style={{ gap: 8 }}>
              Delete this list?
              <button type="button" className="btn" onClick={() => remove(list.id)}>
                Delete
              </button>
              <button type="button" className="btn" onClick={() => setMode('view')}>
                Keep
              </button>
            </span>
          ) : (
            <span className="row" style={{ gap: 4 }}>
              <button type="button" className="link-btn" onClick={() => setMode('rename')}>
                Rename
              </button>
              <button type="button" className="link-btn" onClick={() => setMode('confirm')}>
                Delete
              </button>
            </span>
          )}
        </div>
      )}
      {list.items.length ? (
        <ul className="list">
          {list.items.map((item) => (
            <WatchRow key={item.symbol} list={list} symbol={item.symbol} />
          ))}
        </ul>
      ) : (
        <p className="small muted">No coins in this list yet. Open a coin and choose “Add to watchlist”.</p>
      )}
    </div>
  )
}

export function WatchlistsCard() {
  const { lists, error, create } = useWatchlists()
  const [creating, setCreating] = useState(false)

  return (
    <section className="card" aria-labelledby="watch-title">
      <div className="card-head">
        <h2 id="watch-title">Watchlists</h2>
        {!creating && (
          <button type="button" className="btn" onClick={() => setCreating(true)}>
            New list
          </button>
        )}
      </div>
      <div className="stack" style={{ gap: 24 }}>
        {creating && (
          <NameForm
            submitLabel="Create"
            onSubmit={async (name) => {
              if (await create(name)) setCreating(false)
            }}
            onCancel={() => setCreating(false)}
          />
        )}
        {error && (
          <p className="small" style={{ color: 'var(--loss)' }}>
            {error}
          </p>
        )}
        {lists === null && !error && <div className="skeleton" style={{ height: 64 }} />}
        {lists?.length === 0 && !creating && (
          <p className="empty small">
            You don’t have any watchlists yet. Create one here, or open a coin and choose “Add to watchlist”.
          </p>
        )}
        {lists?.map((list) => (
          <ListBlock key={list.id} list={list} />
        ))}
      </div>
    </section>
  )
}

export function WatchlistButton({ symbol }: { symbol: string }) {
  const { lists, error, create, add, drop } = useWatchlists()
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const popId = useId()
  const count = lists?.filter((w) => w.items.some((i) => i.symbol === symbol)).length ?? 0

  useEffect(() => {
    if (!open) return
    function onDown(event: MouseEvent) {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="popover-wrap" ref={wrap}>
      <button
        type="button"
        className="btn"
        aria-expanded={open}
        aria-controls={popId}
        onClick={() => setOpen((o) => !o)}
      >
        {count ? `In ${count} watchlist${count > 1 ? 's' : ''}` : 'Add to watchlist'}
      </button>
      {open && (
        <div className="popover" id={popId} role="dialog" aria-label="Watchlists">
          {lists?.length ? (
            <fieldset className="plain-fieldset">
              <legend className="small muted">Show {symbol} in</legend>
              {lists.map((w) => {
                const checked = w.items.some((i) => i.symbol === symbol)
                return (
                  <label key={w.id} className="check-label">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => (checked ? drop(w.id, symbol) : add(w.id, symbol))}
                    />
                    {w.name}
                  </label>
                )
              })}
            </fieldset>
          ) : (
            <p className="small muted">You don’t have any watchlists yet. Name your first one:</p>
          )}
          <NameForm
            submitLabel="Create and add"
            onSubmit={async (name) => {
              const created = await create(name)
              if (created) await add(created.id, symbol)
            }}
          />
          {error && (
            <p className="small" style={{ color: 'var(--loss)' }}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
