import { api } from '../api'
import { ago, bigAmount, bigMoney, day, money } from '../format'
import { useApi, useNow } from '../hooks'
import { usePrefs } from '../prefs'
import { FreshnessBadge, Notices, SourceErrors } from './bits'
import { Term } from './Term'

export function CoinFacts({ symbol }: { symbol: string }) {
  const { currency } = usePrefs()
  const now = useNow(10_000)
  const report = useApi(`info:${symbol}:${currency}`, () => api.info(symbol, currency), 10 * 60_000)
  const data = report.data
  const info = data?.info

  const belowAth = info?.ath && info.price ? (info.price / info.ath - 1) * 100 : null

  return (
    <section className="card" aria-labelledby="facts-title">
      <div className="card-head">
        <h2 id="facts-title">Coin facts</h2>
      </div>
      {!data && report.loading && <div className="skeleton" style={{ height: 200 }} />}
      {!data && report.error && <p className="small muted">{report.error.message}</p>}
      {data && (
        <div className="stack">
          {info && (
            <dl className="stat-list">
              <dt>
                <Term id="market-cap" />
              </dt>
              <dd>{bigMoney(info.market_cap, currency)}</dd>
              <dt>
                <Term id="rank">Rank</Term>
              </dt>
              <dd>{info.rank ? `#${info.rank}` : '—'}</dd>
              <dt>
                <Term id="circulating-supply" />
              </dt>
              <dd>{bigAmount(info.circulating_supply)}</dd>
              <dt>
                <Term id="total-supply" />
              </dt>
              <dd>{bigAmount(info.total_supply)}</dd>
              <dt>
                <Term id="max-supply" />
              </dt>
              <dd>{info.max_supply ? bigAmount(info.max_supply) : 'No limit set'}</dd>
              <dt>
                <Term id="fdv">Fully diluted value</Term>
              </dt>
              <dd>{bigMoney(info.fully_diluted_valuation, currency)}</dd>
              <dt>
                <Term id="ath" />
              </dt>
              <dd>
                {money(info.ath, currency)}
                <div className="xsmall faint">{day(info.ath_date)}</div>
                {belowAth !== null && belowAth < 0 && (
                  <div className="xsmall muted">{Math.abs(belowAth).toFixed(0)}% below</div>
                )}
              </dd>
            </dl>
          )}
          <div className="source-line">
            <FreshnessBadge freshness={data.freshness} />
            {data.source && (
              <>
                <span>
                  <a href={data.source.url} target="_blank" rel="noopener noreferrer">
                    CoinGecko
                  </a>{' '}
                  (combines many exchanges)
                </span>
                <span className="sep">·</span>
                <span>updated {ago(info?.last_updated, now)}</span>
              </>
            )}
          </div>
          {currency === 'EUR' && info && <p className="xsmall faint">Euro figures are CoinGecko’s own conversion.</p>}
          <Notices notices={data.notices} />
          <SourceErrors errors={data.errors} />
        </div>
      )}
    </section>
  )
}
