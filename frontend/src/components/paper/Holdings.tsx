import type { Portfolio } from '../../api'
import { cash, money } from '../../format'
import { Link } from '../../router'
import { Change, CoinMark, FreshnessBadge } from '../bits'
import { Term } from '../Term'

export function Holdings({ portfolio }: { portfolio: Portfolio }) {
  const c = portfolio.account.currency
  if (!portfolio.positions.length) {
    return <p className="empty small">You don’t own any coins yet. Place a practice trade to get started.</p>
  }
  const cashPct = portfolio.total_value > 0 ? (portfolio.cash / portfolio.total_value) * 100 : 0
  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Coin</th>
              <th scope="col" className="r">
                Quantity
              </th>
              <th scope="col" className="r">
                <Term id="average-cost">Avg cost</Term>
              </th>
              <th scope="col" className="r">
                Price
              </th>
              <th scope="col" className="r">
                Value
              </th>
              <th scope="col" className="r">
                <Term id="unrealized">Profit / loss</Term>
              </th>
            </tr>
          </thead>
          <tbody>
            {portfolio.positions.map((p) => (
              <tr key={p.symbol}>
                <td>
                  <Link
                    href={`/coin/${p.symbol}`}
                    className="row"
                    style={{ gap: 8, color: 'var(--text)', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}
                  >
                    <CoinMark symbol={p.symbol} />
                    <span>
                      <strong>{p.symbol}</strong>
                      {p.name !== p.symbol && <span className="muted xsmall"> {p.name}</span>}
                    </span>
                  </Link>
                </td>
                <td className="r num">
                  {p.quantity}
                  {Number(p.reserved_quantity) > 0 && (
                    <div className="xsmall faint">{p.reserved_quantity} in sell orders</div>
                  )}
                </td>
                <td className="r num">{money(p.avg_cost, c)}</td>
                <td className="r num">
                  {p.price === null ? (
                    <span className="faint">No price</span>
                  ) : (
                    <>
                      {p.converted && '≈ '}
                      {money(p.price, c)}
                    </>
                  )}
                  {p.freshness && (
                    <div style={{ marginTop: 2 }} title={p.source ? `${p.source.name} (${p.source.pair})` : undefined}>
                      <FreshnessBadge freshness={p.freshness} />
                    </div>
                  )}
                </td>
                <td className="r num">{cash(p.value, c)}</td>
                <td className="r num">
                  {p.unrealized === null ? (
                    '—'
                  ) : (
                    <>
                      {cash(p.unrealized, c)}
                      <div className="xsmall">
                        <Change pct={p.unrealized_pct} />
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 style={{ marginBottom: 12 }}>
          <Term id="allocation" />
        </h3>
        <div className="stack" style={{ gap: 8 }}>
          {portfolio.positions
            .filter((p) => p.allocation_pct !== null)
            .map((p) => (
              <AllocationBar key={p.symbol} label={p.symbol} pct={p.allocation_pct!} />
            ))}
          <AllocationBar label="Cash" pct={cashPct} muted />
        </div>
      </div>
    </div>
  )
}

function AllocationBar({ label, pct, muted }: { label: string; pct: number; muted?: boolean }) {
  return (
    <div className="alloc-row">
      <span className="small">{label}</span>
      <span className="alloc-track" aria-hidden="true">
        <span
          className={`alloc-fill${muted ? ' alloc-muted' : ''}`}
          style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        />
      </span>
      <span className="small num r">{pct.toFixed(1)}%</span>
    </div>
  )
}
