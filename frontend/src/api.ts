export type Currency = 'USD' | 'EUR'
export type RangeKey = '1D' | '1W' | '1M' | '1Y' | '5Y'
export type FreshnessStatus = 'live' | 'delayed' | 'end_of_day' | 'stale' | 'unavailable'

export interface Freshness {
  status: FreshnessStatus
  label: string
  age_seconds: number | null
  detail: string
}

export interface Notice {
  code: string
  level: 'info' | 'warning' | 'danger'
  message: string
}

export interface SourceError {
  source: string
  source_name: string
  kind: string
  message: string
  at: string
}

export interface Comparison {
  source: string
  source_name: string
  price: number | null
  diff_pct: number | null
  comparable: boolean
  note: string
}

export interface FxInfo {
  rate_usd_per_eur: number
  rate_date: string
  source: string
  source_name: string
  fetched_at: string
  stale: boolean
}

export interface QuoteReport {
  symbol: string
  name: string
  currency: Currency
  converted: boolean
  price: {
    value: number
    bid: number | null
    ask: number | null
    open_24h: number | null
    high_24h: number | null
    low_24h: number | null
    change_24h_pct: number | null
    volume_24h: number | null
  } | null
  source: {
    id: string
    name: string
    pair: string
    observed_at: string | null
    fetched_at: string
    from_cache: boolean
  } | null
  freshness: Freshness
  cross_check: { status: 'agree' | 'disagree' | 'unchecked'; threshold_pct: number | null; comparisons: Comparison[] }
  fx: FxInfo | null
  notices: Notice[]
  errors: SourceError[]
  checked_at: string
}

export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number | null
}

export interface CandleReport {
  symbol: string
  currency: Currency
  range: RangeKey
  converted: boolean
  interval_seconds: number | null
  source: { id: string; name: string; pair: string; fetched_at: string; from_cache: boolean } | null
  candles: Candle[]
  freshness: Freshness
  notices: Notice[]
  errors: SourceError[]
  checked_at: string
}

export interface SearchResult {
  symbol: string
  name: string
  markets: Record<Currency, string[]>
}

export interface ExchangeStatus {
  source: string
  source_name: string
  status: 'ok' | 'degraded' | 'down' | 'unknown'
  description: string
  reported_at: string | null
  checked_at: string
  error: string | null
}

export interface CoinInfoReport {
  symbol: string
  currency: Currency
  info: {
    coingecko_id: string
    name: string
    symbol: string
    rank: number | null
    price: number | null
    market_cap: number | null
    fully_diluted_valuation: number | null
    circulating_supply: number | null
    total_supply: number | null
    max_supply: number | null
    ath: number | null
    ath_date: string | null
    last_updated: string | null
  } | null
  source: { id: string; name: string; url: string; fetched_at: string; from_cache: boolean } | null
  freshness: Freshness
  notices: Notice[]
  errors: SourceError[]
  checked_at: string
}

export interface NewsItem {
  id: string
  headline: string
  summary: string
  outlet: string
  author: string
  url: string
  published_at: string
  updated_at: string | null
}

export interface NewsReport {
  symbol: string
  available: boolean
  reason: string | null
  items: NewsItem[]
  source: { id: string; name: string; fetched_at: string; from_cache: boolean } | null
  errors: SourceError[]
  checked_at: string
}

export interface Watchlist {
  id: number
  name: string
  created_at: string
  items: { symbol: string; added_at: string }[]
}

export interface PaperAccount {
  id: number
  name: string
  currency: Currency
  starting_cash: number
  fee_pct: number
  slippage_pct: number
  created_at: string
}

export interface QuoteSource {
  id: string
  name: string
  pair: string
  observed_at: string | null
  fetched_at: string
  from_cache: boolean
}

export interface Position {
  symbol: string
  name: string
  quantity: string
  reserved_quantity: string
  avg_cost: number | null
  cost_basis: number
  realized: number
  price: number | null
  value: number | null
  unrealized: number | null
  unrealized_pct: number | null
  allocation_pct: number | null
  freshness: Freshness | null
  source: QuoteSource | null
  converted: boolean
}

export interface Portfolio {
  account: PaperAccount
  cash: number
  cash_reserved: number
  cash_available: number
  invested_value: number
  total_value: number
  total_complete: boolean
  profit: number | null
  profit_pct: number | null
  realized: number
  fees_paid: number
  positions: Position[]
  notices: Notice[]
  checked_at: string
}

export interface Performance {
  currency: Currency
  points: { time: number; value: number }[]
  sources: { symbol: string; source: string; pair: string; converted: boolean }[]
  notes: string[]
  errors: SourceError[]
}

export interface OrderInput {
  symbol: string
  side: 'buy' | 'sell'
  type: 'market' | 'limit'
  quantity?: string
  amount?: string
  limit_price?: string
  why?: string
  expected_price?: number
}

export interface OrderPreview {
  symbol: string
  name: string
  side: 'buy' | 'sell'
  type: 'market' | 'limit'
  currency: Currency
  quote: {
    source: QuoteSource | null
    freshness: Freshness
    converted: boolean
    fx: FxInfo | null
    cross_check: string
  }
  problems: string[]
  warnings: string[]
  can_place: boolean
  quantity?: string
  price?: number
  price_basis?: string
  market_price?: number
  limit_price?: number | null
  fills_now?: boolean
  fee_pct?: number
  slippage_pct?: number
  gross?: number
  fee?: number
  total?: number
  cash_available?: number
  cash_after?: number
  holding?: string
  holding_after?: string
}

export interface OrderFill {
  price: number
  fee: number
  gross: number
  filled_at: string
  price_basis: string
  market_price: number
  source: string
  pair: string
  observed_at: string | null
  converted: boolean
  fx_rate: string | null
  fx_date: string | null
}

export interface PaperOrder {
  id: number
  symbol: string
  side: 'buy' | 'sell'
  type: 'market' | 'limit'
  quantity: string
  limit_price: number | null
  status: 'open' | 'filled' | 'cancelled'
  created_at: string
  updated_at: string
  why: string
  review: string
  reviewed_at: string | null
  fill: OrderFill | null
  outcome?: { current_price: number; change_pct: number; since: string; freshness: Freshness } | null
}

export interface Settings {
  currency: Currency
}

export class ApiError extends Error {
  status: number
  errors: SourceError[]
  problems: string[]

  constructor(status: number, message: string, errors: SourceError[] = [], problems: string[] = []) {
    super(message)
    this.status = status
    this.errors = errors
    this.problems = problems
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, init)
  } catch {
    throw new ApiError(0, 'The app’s local server isn’t responding. Is the Crypto Paper Trader window still open?')
  }
  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    const detail =
      typeof body?.detail === 'string'
        ? body.detail
        : Array.isArray(body?.detail)
          ? 'That input isn’t valid.'
          : `Request failed (HTTP ${response.status}).`
    throw new ApiError(response.status, detail, body?.errors ?? [], body?.problems ?? [])
  }
  return body as T
}

function json(method: string, body: unknown): RequestInit {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
}

export const api = {
  settings: () => request<Settings>('/api/settings'),
  saveSettings: (values: Partial<Settings>) => request<Settings>('/api/settings', json('PUT', values)),
  search: (q: string) =>
    request<{ results: SearchResult[]; errors: SourceError[] }>(`/api/assets/search?q=${encodeURIComponent(q)}`),
  quote: (symbol: string, currency: Currency) =>
    request<QuoteReport>(`/api/assets/${encodeURIComponent(symbol)}/quote?currency=${currency}`),
  candles: (symbol: string, currency: Currency, range: RangeKey) =>
    request<CandleReport>(`/api/assets/${encodeURIComponent(symbol)}/candles?currency=${currency}&range=${range}`),
  info: (symbol: string, currency: Currency) =>
    request<CoinInfoReport>(`/api/assets/${encodeURIComponent(symbol)}/info?currency=${currency}`),
  news: (symbol: string) => request<NewsReport>(`/api/assets/${encodeURIComponent(symbol)}/news`),
  watchlists: () => request<{ watchlists: Watchlist[] }>('/api/watchlists'),
  createWatchlist: (name: string) => request<Watchlist>('/api/watchlists', json('POST', { name })),
  renameWatchlist: (id: number, name: string) => request<Watchlist>(`/api/watchlists/${id}`, json('PATCH', { name })),
  deleteWatchlist: (id: number) => request<null>(`/api/watchlists/${id}`, { method: 'DELETE' }),
  addToWatchlist: (id: number, symbol: string) =>
    request<Watchlist>(`/api/watchlists/${id}/items`, json('POST', { symbol })),
  removeFromWatchlist: (id: number, symbol: string) =>
    request<Watchlist>(`/api/watchlists/${id}/items/${encodeURIComponent(symbol)}`, { method: 'DELETE' }),
  paperAccount: () => request<{ account: PaperAccount | null }>('/api/paper/account'),
  createPaperAccount: (body: {
    currency: Currency
    starting_cash: string
    fee_pct: string
    slippage_pct: string
    reset: boolean
  }) => request<PaperAccount>('/api/paper/account', json('POST', body)),
  updatePaperCosts: (fee_pct: string, slippage_pct: string) =>
    request<PaperAccount>('/api/paper/account/costs', json('PATCH', { fee_pct, slippage_pct })),
  portfolio: () => request<Portfolio>('/api/paper/portfolio'),
  performance: () => request<Performance>('/api/paper/performance'),
  previewOrder: (order: OrderInput) => request<OrderPreview>('/api/paper/orders/preview', json('POST', order)),
  placeOrder: (order: OrderInput) =>
    request<{ order_id: number; status: 'filled' | 'open'; preview: OrderPreview }>(
      '/api/paper/orders',
      json('POST', order),
    ),
  paperOrders: () => request<{ currency: Currency; orders: PaperOrder[] }>('/api/paper/orders'),
  cancelOrder: (id: number) => request<null>(`/api/paper/orders/${id}`, { method: 'DELETE' }),
  journal: () => request<{ currency: Currency; entries: PaperOrder[] }>('/api/paper/journal'),
  updateJournal: (id: number, body: { why?: string; review?: string }) =>
    request<null>(`/api/paper/journal/${id}`, json('PATCH', body)),
  exchangeStatus: () => request<{ exchanges: ExchangeStatus[] }>('/api/exchanges/status'),
}
