import { useId, useState } from 'react'
import { api, type Currency, type PaperOrder } from '../../api'
import { dateTime, money } from '../../format'
import { Change, FreshnessBadge } from '../bits'
import { sourceNote } from './Orders'

export function Journal({
  entries,
  currency,
  onChange,
}: {
  entries: PaperOrder[]
  currency: Currency
  onChange: () => void
}) {
  const filled = entries.filter((e) => e.fill)
  if (!filled.length) {
    return (
      <p className="empty small">
        Your journal fills up as you trade. Write down why you make each trade, then look back later.
      </p>
    )
  }
  return (
    <ul className="list">
      {filled.map((e) => (
        <JournalEntry key={e.id} entry={e} currency={currency} onChange={onChange} />
      ))}
    </ul>
  )
}

function JournalEntry({
  entry: e,
  currency,
  onChange,
}: {
  entry: PaperOrder
  currency: Currency
  onChange: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [why, setWhy] = useState(e.why)
  const [review, setReview] = useState(e.review)
  const [error, setError] = useState<string | null>(null)
  const id = useId()
  const f = e.fill!
  const bought = e.side === 'buy'

  async function save() {
    try {
      await api.updateJournal(e.id, { why, review })
      setEditing(false)
      setError(null)
      onChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <li className="stack" style={{ gap: 8, padding: '16px 0' }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <strong>
          {bought ? 'Bought' : 'Sold'} {e.quantity} {e.symbol} at {money(f.price, currency)}
        </strong>
        <span className="xsmall faint">{dateTime(f.filled_at)}</span>
      </div>
      <p className="xsmall faint">{sourceNote(e)}</p>

      {e.outcome && (
        <p className="small row" style={{ gap: 8 }}>
          <span>
            {e.symbol} is now {money(e.outcome.current_price, currency)}, <Change pct={e.outcome.change_pct} /> since
            you {bought ? 'bought' : 'sold'} ({e.outcome.since} ago).
          </span>
          <FreshnessBadge freshness={e.outcome.freshness} />
        </p>
      )}
      {e.outcome && !bought && e.outcome.change_pct !== 0 && (
        <p className="xsmall muted">
          {e.outcome.change_pct > 0
            ? 'The price rose after you sold, so holding on would have paid more.'
            : 'The price fell after you sold, so selling avoided that drop.'}
        </p>
      )}

      {editing ? (
        <div className="stack" style={{ gap: 8 }}>
          <label htmlFor={`${id}-why`} className="field-label">
            Why I made this trade
          </label>
          <textarea
            id={`${id}-why`}
            className="input"
            rows={2}
            maxLength={2000}
            value={why}
            onChange={(x) => setWhy(x.target.value)}
          />
          <label htmlFor={`${id}-review`} className="field-label">
            Looking back
          </label>
          <textarea
            id={`${id}-review`}
            className="input"
            rows={2}
            maxLength={2000}
            value={review}
            placeholder="Was your reason right? What would you do differently?"
            onChange={(x) => setReview(x.target.value)}
          />
          {error && (
            <p className="small" style={{ color: 'var(--loss)' }}>
              {error}
            </p>
          )}
          <div className="row">
            <button type="button" className="btn btn-primary" onClick={save}>
              Save
            </button>
            <button type="button" className="btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="stack" style={{ gap: 4 }}>
          <p className="small">
            <span className="muted">Why: </span>
            {e.why || <span className="faint">No reason written.</span>}
          </p>
          {e.review && (
            <p className="small">
              <span className="muted">Looking back: </span>
              {e.review}
            </p>
          )}
          <div>
            <button type="button" className="link-btn" style={{ paddingLeft: 0 }} onClick={() => setEditing(true)}>
              {e.review ? 'Edit notes' : 'Add a look-back note'}
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
