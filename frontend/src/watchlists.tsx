import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, type Watchlist } from './api'

interface WatchlistState {
  lists: Watchlist[] | null
  error: string | null
  create: (name: string) => Promise<Watchlist | null>
  rename: (id: number, name: string) => Promise<void>
  remove: (id: number) => Promise<void>
  add: (id: number, symbol: string) => Promise<void>
  drop: (id: number, symbol: string) => Promise<void>
}

const WatchlistContext = createContext<WatchlistState | null>(null)

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<Watchlist[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .watchlists()
      .then((r) => setLists(r.watchlists))
      .catch((err: Error) => setError(err.message))
  }, [])

  const replace = useCallback((updated: Watchlist) => {
    setLists((current) => (current ?? []).map((w) => (w.id === updated.id ? updated : w)))
  }, [])

  const guard = useCallback(async <T,>(action: () => Promise<T>): Promise<T | null> => {
    try {
      const result = await action()
      setError(null)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      return null
    }
  }, [])

  const value: WatchlistState = {
    lists,
    error,
    create: async (name) => {
      const created = await guard(() => api.createWatchlist(name))
      if (created) setLists((current) => [...(current ?? []), created])
      return created
    },
    rename: async (id, name) => {
      const updated = await guard(() => api.renameWatchlist(id, name))
      if (updated) replace(updated)
    },
    remove: async (id) => {
      const ok = await guard(() => api.deleteWatchlist(id).then(() => true))
      if (ok) setLists((current) => (current ?? []).filter((w) => w.id !== id))
    },
    add: async (id, symbol) => {
      const updated = await guard(() => api.addToWatchlist(id, symbol))
      if (updated) replace(updated)
    },
    drop: async (id, symbol) => {
      const updated = await guard(() => api.removeFromWatchlist(id, symbol))
      if (updated) replace(updated)
    },
  }

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export function useWatchlists(): WatchlistState {
  const state = useContext(WatchlistContext)
  if (!state) throw new Error('useWatchlists must be used inside WatchlistProvider')
  return state
}
