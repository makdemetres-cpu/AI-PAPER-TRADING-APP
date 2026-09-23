import { useState } from 'react'
import { api, type Currency, type PaperOrder } from '../../api'
import { cash, clockTime, dateTime, money } from '../../format'

const SOURCE_NAMES: Record<string, string> = { coinbase: 'Coinbase', kraken: 'Kraken', alpaca: 'Alpaca' }

export function sourceNote(o: PaperOrder): string {
  const f = o.fill
  if (!f) return ''
  let text = `${SOURCE_NAMES[f.source] ?? f.source} ${f.pair}, ${f.price_basis}`
  if (f.observed_at) text += ` from trade at ${clockTime(f.observed_at)}`
  if (f.converted && f.fx_rate) text += `, converted at ECB ${f.fx_date} rate ${f.fx_rate}`
  return text
}

export function Orders({
  orders,
  currency,
  onChange,
}: {
  orders: PaperOrder[]
  currency: Currency
  onChange: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const open = orders.filter((o) => o.status === 'open')
  const past = orders.filter((o) => o.status !== 'open')

  async function cancel(id: number) {
    try {
      await api.cancelOrder(id)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
    onChange()
  }

  if (!orders.length) return <p className="empty small">No orders yet.</p>

  return (
    <div className="stack" style={{ gap: 24 }}>
      {error && (
        <p className="small" style={{ color: 'var(--loss)' }}>
          {error}
        </p>
      )}
      {open.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 8 }}>Waiting limit orders</h3>
          <p className="xsmall muted" style={{ marginBottom: 8 }}>
            Checked every 30 seconds while the app is open. Price moves while it’s closed don’t count.
          </p>
          <ul className="list">
            {open.map((o) => (
              <li key={o.id} className="row" style={{ justifyContent: 'space-between', padding: '10px 0' }}>
                <span className="small">
                  <strong>{o.side === 'buy' ? 'Buy' : 'Sell'}</strong> {o.quantity} {o.symbol} at{' '}
                  {o.side === 'buy' ? 'or below' : 'or above'} {money(o.limit_price, currency)}
                  <span className="faint xsmall"> · placed {dateTime(o.created_at)}</span>
                </span>
                <button type="button" className="btn" onClick={() => cancel(o.id)}>
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {past.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <caption className="visually-hidden">Order history</caption>
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Order</th>
                <th scope="col" className="r">
                  Price
                </th>
                <th scope="col" className="r">
                  Fee
                </th>
                <th scope="col" className="r">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {past.map((o) => {
                const f = o.fill
                const total = f ? (o.side === 'buy' ? f.gross + f.fee : f.gross - f.fee) : null
                return (
                  <tr key={o.id}>
                    <td className="small">{dateTime(f?.filled_at ?? o.updated_at)}</td>
                    <td className="small">
                      <strong className={o.side === 'buy' ? 'change-up' : 'change-down'}>
                        {o.side === 'buy' ? 'Buy' : 'Sell'}
                      </strong>{' '}
                      {o.quantity} {o.symbol}
                      <span className="faint"> · {o.type}</span>
                      {o.status === 'cancelled' && <span className="faint"> · cancelled</span>}
                      {f && <div className="xsmall faint">{sourceNote(o)}</div>}
                    </td>
                    <td className="r num small">{f ? money(f.price, currency) : '—'}</td>
                    <td className="r num small">{f ? cash(f.fee, currency) : '—'}</td>
                    <td className="r num small">{total === null ? '—' : cash(total, currency)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
