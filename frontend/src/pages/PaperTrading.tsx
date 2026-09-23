import { useState } from 'react'
import { api, type Portfolio } from '../api'
import { Change, Notices, SourceErrors } from '../components/bits'
import { Holdings } from '../components/paper/Holdings'
import { Journal } from '../components/paper/Journal'
import { Orders } from '../components/paper/Orders'
import { SetupForm } from '../components/paper/SetupForm'
import { TradeTicket } from '../components/paper/TradeTicket'
import { Term } from '../components/Term'
import { ValueChart } from '../components/ValueChart'
import { cash, clockTime, day } from '../format'
import { useApi } from '../hooks'
import { usePrefs } from '../prefs'

type Tab = 'holdings' | 'orders' | 'journal'

function initialSymbol(): string {
  const s = new URLSearchParams(window.location.search).get('symbol') ?? ''
  return /^[A-Za-z0-9]{1,15}$/.test(s) ? s.toUpperCase() : ''
}

export function PaperTrading() {
  const [version, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)
  const account = useApi(`paper-account:${version}`, api.paperAccount)

  if (!account.data) {
    return (
      <>
        <h1>Paper Trading</h1>
        {account.loading ? (
          <div className="skeleton" style={{ height: 200 }} />
        ) : (
          <p className="muted">{account.error?.message}</p>
        )}
      </>
    )
  }

  if (!account.data.account) {
    return (
      <>
        <div className="stack" style={{ gap: 6 }}>
          <h1>Paper Trading</h1>
          <p className="muted">
            Practice buying and selling with pretend money and real prices. Nothing you do here touches real money.
          </p>
        </div>
        <section className="card" style={{ maxWidth: 640 }}>
          <div className="card-head">
            <h2>Start your practice account</h2>
          </div>
          <SetupForm reset={false} onDone={refresh} />
        </section>
      </>
    )
  }

  return <Dashboard version={version} refresh={refresh} />
}

function Dashboard({ version, refresh }: { version: number; refresh: () => void }) {
  const prefs = usePrefs()
  const [tab, setTab] = useState<Tab>('holdings')
  const [settings, setSettings] = useState<'none' | 'reset' | 'costs'>('none')
  const portfolio = useApi(`portfolio:${version}`, api.portfolio, 30_000)
  const performance = useApi(`performance:${version}`, api.performance, 5 * 60_000)
  const orders = useApi(`orders:${version}`, api.paperOrders, 30_000)
  const journal = useApi(`journal:${version}:${tab}`, api.journal)

  const pf = portfolio.data
  const c = pf?.account.currency ?? 'USD'
  const available: Record<string, string> = {}
  pf?.positions.forEach((p) => {
    const free = Number(p.quantity) - Number(p.reserved_quantity)
    if (free > 0) available[p.symbol] = String(+free.toFixed(8))
  })

  return (
    <>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div className="stack" style={{ gap: 4 }}>
          <h1>Paper Trading</h1>
          {pf && (
            <p className="small muted">
              Practice account in {pf.account.currency} · started {day(pf.account.created_at)} with{' '}
              {cash(pf.account.starting_cash, c)} · <Term id="trading-fee">fee {pf.account.fee_pct}%</Term> ·{' '}
              <Term id="slippage">slippage {pf.account.slippage_pct}%</Term>
            </p>
          )}
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button type="button" className="btn" onClick={() => setSettings(settings === 'costs' ? 'none' : 'costs')}>
            Fees and slippage
          </button>
          <button type="button" className="btn" onClick={() => setSettings(settings === 'reset' ? 'none' : 'reset')}>
            Start over
          </button>
        </div>
      </div>

      {pf && prefs.currency !== pf.account.currency && (
        <p className="small muted">
          This practice account is in {pf.account.currency}. The {prefs.currency} switch at the top changes the research
          pages only.
        </p>
      )}

      {settings === 'reset' && pf && (
        <section className="card" style={{ maxWidth: 640 }}>
          <div className="card-head">
            <h2>Start over</h2>
          </div>
          <SetupForm
            reset
            initial={pf.account}
            onDone={() => {
              setSettings('none')
              refresh()
            }}
            onCancel={() => setSettings('none')}
          />
        </section>
      )}
      {settings === 'costs' && pf && (
        <CostsForm
          portfolio={pf}
          onDone={() => {
            setSettings('none')
            refresh()
          }}
        />
      )}

      <div className="grid-2">
        <div className="stack" style={{ gap: 24 }}>
          <Summary portfolio={pf} loading={portfolio.loading} error={portfolio.error?.message ?? null} />

          <section className="card" aria-labelledby="perf-title">
            <div className="card-head">
              <h2 id="perf-title">Value over time</h2>
            </div>
            {!performance.data ? (
              <div className="skeleton" style={{ height: 240 }} />
            ) : (
              <div className="stack">
                <ValueChart points={performance.data.points} currency={performance.data.currency} />
                <div className="xsmall muted stack" style={{ gap: 2 }}>
                  {performance.data.notes.map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                  {performance.data.sources.length > 0 && (
                    <span>
                      Daily prices:{' '}
                      {performance.data.sources
                        .map(
                          (s) =>
                            `${s.symbol} from ${s.source} ${s.pair}${s.converted ? ' (converted with ECB rates)' : ''}`,
                        )
                        .join('; ')}
                      .
                    </span>
                  )}
                </div>
                <SourceErrors errors={performance.data.errors} />
              </div>
            )}
          </section>

          <section className="card">
            <div className="segmented" role="tablist" aria-label="Portfolio sections" style={{ marginBottom: 20 }}>
              {(
                [
                  ['holdings', 'Holdings'],
                  ['orders', 'Orders'],
                  ['journal', 'Journal'],
                ] as [Tab, string][]
              ).map(([t, label]) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  aria-pressed={tab === t}
                  onClick={() => setTab(t)}
                >
                  {label}
                </button>
              ))}
            </div>
            {tab === 'holdings' && pf && <Holdings portfolio={pf} />}
            {tab === 'orders' && orders.data && <Orders orders={orders.data.orders} currency={c} onChange={refresh} />}
            {tab === 'journal' && journal.data && (
              <Journal entries={journal.data.entries} currency={c} onChange={refresh} />
            )}
            {((tab === 'orders' && !orders.data) || (tab === 'journal' && !journal.data)) && (
              <div className="skeleton" style={{ height: 120 }} />
            )}
          </section>
        </div>

        {pf && <TradeTicket currency={c} initialSymbol={initialSymbol()} available={available} onPlaced={refresh} />}
      </div>
    </>
  )
}

function Summary({
  portfolio: pf,
  loading,
  error,
}: {
  portfolio: Portfolio | null
  loading: boolean
  error: string | null
}) {
  if (!pf) {
    return loading ? <div className="skeleton card" style={{ height: 160 }} /> : <p className="muted">{error}</p>
  }
  const c = pf.account.currency
  return (
    <section className="card stack" aria-labelledby="total-title">
      <h2 id="total-title" className="small muted" style={{ fontWeight: 500 }}>
        <Term id="portfolio">Total value</Term>
      </h2>
      <p className="hero-price">{cash(pf.total_value, c)}</p>
      {pf.profit !== null && pf.profit_pct !== null ? (
        <p>
          <Change pct={pf.profit_pct} />{' '}
          <span className="muted">
            ({pf.profit >= 0 ? '+' : '−'}
            {cash(Math.abs(pf.profit), c)}) since you started with {cash(pf.account.starting_cash, c)}
          </span>
        </p>
      ) : (
        <p className="small muted">Profit since start can’t be worked out while a coin has no price.</p>
      )}
      <dl className="stat-list" style={{ maxWidth: 420 }}>
        <dt>Cash you can use</dt>
        <dd>{cash(pf.cash_available, c)}</dd>
        {pf.cash_reserved > 0 && (
          <>
            <dt>Cash set aside for limit orders</dt>
            <dd>{cash(pf.cash_reserved, c)}</dd>
          </>
        )}
        <dt>Coins worth</dt>
        <dd>{cash(pf.invested_value, c)}</dd>
        <dt>
          <Term id="realized">Realized profit / loss</Term>
        </dt>
        <dd>{cash(pf.realized, c)}</dd>
        <dt>Fees paid</dt>
        <dd>{cash(pf.fees_paid, c)}</dd>
      </dl>
      <p className="xsmall faint">Prices checked {clockTime(pf.checked_at)}. Each coin’s source is in Holdings.</p>
      {loading === false && error && (
        <Notices
          notices={[
            { code: 'local', level: 'danger', message: `${error} Showing numbers from ${clockTime(pf.checked_at)}.` },
          ]}
        />
      )}
      <Notices notices={pf.notices} />
    </section>
  )
}

function CostsForm({ portfolio, onDone }: { portfolio: Portfolio; onDone: () => void }) {
  const [fee, setFee] = useState(String(portfolio.account.fee_pct))
  const [slip, setSlip] = useState(String(portfolio.account.slippage_pct))
  const [error, setError] = useState<string | null>(null)

  async function save() {
    try {
      await api.updatePaperCosts(fee, slip)
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <section className="card stack" style={{ maxWidth: 640 }}>
      <h2>Fees and slippage</h2>
      <p className="small muted">
        Changes apply to new trades and to limit orders that haven’t filled yet. Filled trades keep the costs they had.
      </p>
      <div className="form-grid">
        <label htmlFor="cost-fee">Fee per trade (%)</label>
        <input
          id="cost-fee"
          className="input"
          inputMode="decimal"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />
        <span className="xsmall muted">0 to 5.</span>
        <label htmlFor="cost-slip">Slippage (%)</label>
        <input
          id="cost-slip"
          className="input"
          inputMode="decimal"
          value={slip}
          onChange={(e) => setSlip(e.target.value)}
        />
        <span className="xsmall muted">0 to 5.</span>
      </div>
      {error && (
        <p className="small" style={{ color: 'var(--loss)' }}>
          {error}
        </p>
      )}
      <div>
        <button type="button" className="btn btn-primary" onClick={save}>
          Save
        </button>
      </div>
    </section>
  )
}
