import { useId, useState, type FormEvent } from 'react'
import { api, type Currency, type PaperAccount } from '../../api'
import { usePrefs } from '../../prefs'
import { Term } from '../Term'

export function SetupForm({
  reset,
  initial,
  onDone,
  onCancel,
}: {
  reset: boolean
  initial?: PaperAccount
  onDone: () => void
  onCancel?: () => void
}) {
  const prefs = usePrefs()
  const [currency, setCurrency] = useState<Currency>(initial?.currency ?? prefs.currency)
  const [cash, setCash] = useState(String(initial?.starting_cash ?? 100000))
  const [fee, setFee] = useState(String(initial?.fee_pct ?? 0.5))
  const [slip, setSlip] = useState(String(initial?.slippage_pct ?? 0.1))
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const id = useId()

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    try {
      await api.createPaperAccount({ currency, starting_cash: cash, fee_pct: fee, slippage_pct: slip, reset })
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="stack" style={{ gap: 16 }} onSubmit={submit}>
      <div className="form-grid">
        <label htmlFor={`${id}-cash`}>Starting balance</label>
        <input
          id={`${id}-cash`}
          className="input"
          inputMode="decimal"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
          required
        />
        <span className="xsmall muted">Between 100 and 100,000,000.</span>

        <span>Currency</span>
        <div className="segmented" role="group" aria-label="Account currency">
          {(['USD', 'EUR'] as Currency[]).map((c) => (
            <button key={c} type="button" aria-pressed={currency === c} onClick={() => setCurrency(c)}>
              {c === 'USD' ? '$ USD' : '€ EUR'}
            </button>
          ))}
        </div>
        <span className="xsmall muted">Trades use this currency’s market where one exists.</span>

        <label htmlFor={`${id}-fee`}>
          <Term id="trading-fee">Fee per trade (%)</Term>
        </label>
        <input
          id={`${id}-fee`}
          className="input"
          inputMode="decimal"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          required
        />
        <span className="xsmall muted">
          Real fees differ by exchange and how much you trade. Check your exchange’s fee page.
        </span>

        <label htmlFor={`${id}-slip`}>
          <Term id="slippage">Slippage (%)</Term>
        </label>
        <input
          id={`${id}-slip`}
          className="input"
          inputMode="decimal"
          value={slip}
          onChange={(e) => setSlip(e.target.value)}
          required
        />
        <span className="xsmall muted">Added to market orders so results aren’t better than real life.</span>
      </div>
      {reset && (
        <p className="small" style={{ color: 'var(--warn)' }}>
          Starting over closes your current account. Its trades stay in the database but won’t show here, and open
          orders are cancelled.
        </p>
      )}
      {error && (
        <p className="small" style={{ color: 'var(--loss)' }}>
          {error}
        </p>
      )}
      <div className="row">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {reset ? 'Start over' : 'Start practicing'}
        </button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
