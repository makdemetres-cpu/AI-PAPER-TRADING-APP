import { api } from '../api'
import { ago, clockTime, dateTime } from '../format'
import { useApi, useNow } from '../hooks'
import { SourceErrors } from './bits'

export function News({ symbol, name }: { symbol: string; name: string }) {
  const now = useNow(30_000)
  const report = useApi(`news:${symbol}`, () => api.news(symbol), 5 * 60_000)
  const data = report.data

  return (
    <section className="card" aria-labelledby="news-title">
      <div className="card-head">
        <h2 id="news-title">News</h2>
        {data?.source && (
          <span className="xsmall muted">
            {data.source.name} · checked {clockTime(data.source.fetched_at)}
          </span>
        )}
      </div>
      {!data && report.loading && <div className="skeleton" style={{ height: 120 }} />}
      {!data && report.error && <p className="small muted">{report.error.message}</p>}
      {data && !data.available && <p className="small muted">{data.reason}</p>}
      {data?.available && data.items.length === 0 && (
        <p className="small muted">
          No recent news tagged {name} ({symbol}).
        </p>
      )}
      {data?.available && data.items.length > 0 && (
        <ul className="list" style={{ marginTop: -16 }}>
          {data.items.map((item) => (
            <li key={item.id || item.url} className="news-item">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.headline}
              </a>
              {item.summary && <p className="small muted">{item.summary}</p>}
              <p className="xsmall faint">
                {item.outlet}
                {item.author && ` · ${item.author}`} · published{' '}
                <time dateTime={item.published_at} title={new Date(item.published_at).toLocaleString()}>
                  {dateTime(item.published_at)} ({ago(item.published_at, now)})
                </time>
              </p>
            </li>
          ))}
        </ul>
      )}
      {data?.source?.from_cache && (
        <p className="xsmall" style={{ color: 'var(--warn)' }}>
          Couldn’t refresh the news. These headlines are from {clockTime(data.source.fetched_at)}.
        </p>
      )}
      {data && <SourceErrors errors={data.errors} />}
    </section>
  )
}
