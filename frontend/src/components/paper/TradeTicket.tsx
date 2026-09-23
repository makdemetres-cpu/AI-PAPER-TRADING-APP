import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { api, ApiError, type Currency, type OrderInput, type OrderPreview, type SearchResult } from '../../api'
import { cash, clockTime, money } from '../../format'
import { FreshnessBadge } from '../bits'
import { Term } from '../Term'

type Side = 'buy' | 'sell'
type OrderType = 'market' | 'limit'
type Mode = 'amount' | 'quantity'

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: [T, string][]
  onChange: (v: T) => void
}) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map(([v, text]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>
          {text}
        </button>
      ))}
    </div>
  )
}

function SymbolPicker({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  const [text, setText] = useState(value)
  const [results, setResults] = useState<SearchResult[]>([])
  const [focused, setFocused] = useState(false)
  const id = useId()

  useEffect(() => setText(value), [value])

  useEffect(() => {
    if (!focused || !text.trim() || text.trim().toUpperCase() === value) {
      setResults([])
      return
    }
    let cancelled = false
    const t = window.setTimeout(() => {
      api
        .search(text)
        .then((r) => !cancelled && setResults(r.results.slice(0, 5)))
        .catch(() => !cancelled && setResults([]))
    }, 200)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [text, focused, value])

  return (
    <div className="popover-wrap">
      <label htmlFor={id} className="field-label">
        Coin
      </label>
      <input
        id={id}
        className="input"
        value={text}
        placeholder="Symbol, like BTC"
        autoComplete="off"
        onFocus={() => setFocused(true)}
        onBlur={() => {
          window.setTimeout(() => setFocused(false), 150)
          onChange(text.trim().toUpperCase())
        }}
        onChange={(e) => setText(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="popover list" style={{ left: 0, right: 'auto', padding: 4, gap: 0 }}>
          {results.map((r) => (
            <li key={r.symbol}>
              <button
                type="button"
                className="suggestion"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(r.symbol)
                  setText(r.symbol)
                  setResults([])
                }}
              >
                <strong>{r.symbol}</strong> <span className="muted">{r.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function TradeTicket({
  currency,
  initialSymbol,
  available,
  onPlaced,
}: {
  currency: Currency
  initialSymbol: string
  available: Record<string, string>
  onPlaced: () => void
}) {
  const [symbol, setSymbol] = useState(initialSymbol)
  const [side, setSide] = useState<Side>('buy')
  const [type, setType] = useState<OrderType>('market')
  const [mode, setMode] = useState<Mode>('amount')
  const [value, setValue] = useState('')
  const [limit, setLimit] = useState('')
  const [why, setWhy] = useState('')
  const [preview, setPreview] = useState<OrderPreview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const reviewButton = useRef<HTMLButtonElement>(null)
  const id = useId()

  const input: OrderInput = {
    symbol,
    side,
    type,
    ...(mode === 'amount' ? { amount: value } : { quantity: value }),
    ...(type === 'limit' ? { limit_price: limit } : {}),
    why,
  }

  async function review(event?: FormEvent) {
    event?.preventDefault()
    setError(null)
    setDone(null)
    if (!symbol) return setError('Pick a coin first.')
    if (!(Number(value) > 0))
      return setError(mode === 'amount' ? 'Enter an amount above zero.' : 'Enter a quantity above zero.')
    if (type === 'limit' && !(Number(limit) > 0)) return setError('Enter a limit price above zero.')
    setBusy(true)
    try {
      setPreview(await api.previewOrder(input))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  async function place() {
    if (!preview?.price) return
    setBusy(true)
    try {
      const result = await api.placeOrder({ ...input, expected_price: preview.price })
      const p = result.preview
      setDone(
        result.status === 'filled'
          ? `${p.side === 'buy' ? 'Bought' : 'Sold'} ${p.quantity} ${p.symbol} at ${money(p.price, currency)}.`
          : `Limit order placed. It fills if the price reaches ${money(p.limit_price, currency)} while the app is open.`,
      )
      setPreview(null)
      setValue('')
      setWhy('')
      onPlaced()
    } catch (err) {
      if (err instanceof ApiError && err.problems.length) {
        setPreview({ ...preview, can_place: false, problems: err.problems })
      } else {
        setPreview({ ...preview, can_place: false, problems: [err instanceof Error ? err.message : String(err)] })
      }
    } finally {
      setBusy(false)
    }
  }

  const holding = available[symbol]
  const unit = mode === 'amount' ? currency : symbol || 'coins'

  return (
    <section className="card" aria-labelledby={`${id}-title`}>
      <div className="card-head">
        <h2 id={`${id}-title`}>Place a practice trade</h2>
      </div>
      <form className="stack" style={{ gap: 16 }} onSubmit={review}>
        <SymbolPicker value={symbol} onChange={setSymbol} />
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <Segmented
            label="Buy or sell"
            value={side}
            options={[
              ['buy', 'Buy'],
              ['sell', 'Sell'],
            ]}
            onChange={setSide}
          />
          <span className="row" style={{ gap: 6 }}>
            <Segmented
              label="Order type"
              value={type}
              options={[
                ['market', 'Market'],
                ['limit', 'Limit'],
              ]}
              onChange={setType}
            />
            <Term id={type === 'market' ? 'market-order' : 'limit-order'}>
              <span className="visually-hidden">{type === 'market' ? 'Market order' : 'Limit order'}</span>
            </Term>
          </span>
        </div>

        <div>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
            <label htmlFor={`${id}-value`} className="field-label" style={{ margin: 0 }}>
              {mode === 'amount'
                ? side === 'buy'
                  ? `Spend (${currency})`
                  : `Sell worth (${currency})`
                : `Quantity (${unit})`}
            </label>
            <Segmented
              label="Enter as"
              value={mode}
              options={[
                ['amount', currency],
                ['quantity', 'Coins'],
              ]}
              onChange={setMode}
            />
          </div>
          <input
            id={`${id}-value`}
            className="input"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(',', '.'))}
            placeholder={mode === 'amount' ? '1000' : '0.01'}
          />
          {side === 'sell' && holding && (
            <button
              type="button"
              className="link-btn"
              style={{ paddingLeft: 0 }}
              onClick={() => {
                setMode('quantity')
                setValue(holding)
              }}
            >
              Sell all ({holding} {symbol})
            </button>
          )}
          {side === 'buy' && mode === 'amount' && (
            <p className="xsmall muted" style={{ marginTop: 4 }}>
              The fee comes out of this amount.
            </p>
          )}
        </div>

        {type === 'limit' && (
          <div>
            <label htmlFor={`${id}-limit`} className="field-label">
              {side === 'buy' ? 'Buy only at or below' : 'Sell only at or above'} ({currency} per coin)
            </label>
            <input
              id={`${id}-limit`}
              className="input"
              inputMode="decimal"
              value={limit}
              onChange={(e) => setLimit(e.target.value.replace(',', '.'))}
            />
          </div>
        )}

        <div>
          <label htmlFor={`${id}-why`} className="field-label">
            <Term id="trade-journal">Why are you making this trade?</Term>
          </label>
          <textarea
            id={`${id}-why`}
            className="input"
            rows={2}
            maxLength={2000}
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="Optional. Saved in your journal."
          />
        </div>

        {error && (
          <p className="small" style={{ color: 'var(--loss)' }}>
            {error}
          </p>
        )}
        {done && (
          <p className="small" role="status" style={{ color: 'var(--gain)' }}>
            {done}
          </p>
        )}
        <button
          ref={reviewButton}
          type="submit"
          className="btn btn-primary"
          disabled={busy}
          style={{ justifyContent: 'center' }}
        >
          Review order
        </button>
      </form>
      {preview && (
        <ConfirmDialog
          preview={preview}
          busy={busy}
          onConfirm={place}
          onReview={() => review()}
          onClose={() => {
            setPreview(null)
            reviewButton.current?.focus()
          }}
        />
      )}
    </section>
  )
}

function Row({ label, children, strong }: { label: ReactNode; children: ReactNode; strong?: boolean }) {
  return (
    <>
      <dt>{label}</dt>
      <dd style={strong ? { fontWeight: 650, fontSize: 16 } : undefined}>{children}</dd>
    </>
  )
}

function ConfirmDialog({
  preview: p,
  busy,
  onConfirm,
  onReview,
  onClose,
}: {
  preview: OrderPreview
  busy: boolean
  onConfirm: () => void
  onReview: () => void
  onClose: () => void
}) {
  const confirmRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const c = p.currency

  useEffect(() => {
    ;(p.can_place ? confirmRef : closeRef).current?.focus()
  }, [p.can_place])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const verb = p.side === 'buy' ? 'Buy' : 'Sell'
  const moved = p.problems.some((x) => x.startsWith('The price moved'))

  return (
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog card" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId}>
          {verb} {p.quantity ?? ''} {p.symbol}
          <span className="muted" style={{ fontWeight: 500 }}>
            {' '}
            · {p.type === 'market' ? 'market order' : 'limit order'}
          </span>
        </h2>

        <div className="source-line" style={{ marginTop: 8 }}>
          <FreshnessBadge freshness={p.quote.freshness} />
          {p.quote.source && (
            <span>
              Price from {p.quote.source.name} ({p.quote.source.pair}), last trade{' '}
              {clockTime(p.quote.source.observed_at)}
            </span>
          )}
        </div>

        {p.price !== undefined && (
          <dl className="stat-list" style={{ marginTop: 16 }}>
            <Row label={p.side === 'buy' ? 'Current ask' : 'Current bid'}>
              {p.quote.converted && '≈ '}
              {money(p.market_price, c)}
            </Row>
            {p.type === 'limit' && <Row label="Your limit">{money(p.limit_price, c)}</Row>}
            <Row
              label={
                p.type === 'market' ? (
                  <Term id="slippage">{`Estimated price with ${p.slippage_pct}% slippage`}</Term>
                ) : p.fills_now ? (
                  'Fills now at'
                ) : (
                  'Fills at most at'
                )
              }
            >
              {money(p.price, c)}
            </Row>
            <Row label="Coins value">{cash(p.gross, c)}</Row>
            <Row label={<Term id="trading-fee">{`Fee (${p.fee_pct}%)`}</Term>}>{cash(p.fee, c)}</Row>
            <Row label={p.side === 'buy' ? 'Total cost' : 'You receive'} strong>
              {cash(p.total, c)}
            </Row>
            <Row label="Cash available after">{cash(p.cash_after, c)}</Row>
            <Row label={`${p.symbol} held after`}>{p.holding_after}</Row>
          </dl>
        )}

        {p.type === 'limit' && !p.fills_now && p.can_place && (
          <p className="small muted" style={{ marginTop: 12 }}>
            This order waits until the price reaches your limit. The app checks every 30 seconds while it’s open. The
            cash is set aside until then.
          </p>
        )}

        {p.warnings.length > 0 && (
          <ul className="small" style={{ color: 'var(--warn)', paddingLeft: 18, margin: '12px 0 0' }}>
            {p.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}
        {p.problems.length > 0 && (
          <div className="notice notice-danger" style={{ marginTop: 12 }}>
            <span className="notice-icon" aria-hidden="true">
              !
            </span>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {p.problems.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="xsmall faint" style={{ marginTop: 12 }}>
          Paper trade with pretend money. The app refuses the order if the price moves more than 1% before you confirm.
        </p>

        <div className="row" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
          <button ref={closeRef} type="button" className="btn" onClick={onClose}>
            Go back
          </button>
          {moved ? (
            <button type="button" className="btn btn-primary" onClick={onReview} disabled={busy}>
              Review again
            </button>
          ) : (
            <button
              ref={confirmRef}
              type="button"
              className="btn btn-primary"
              onClick={onConfirm}
              disabled={!p.can_place || busy}
            >
              {verb} {p.symbol}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
