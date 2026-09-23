import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { PrefsProvider } from './prefs'
import { WatchlistProvider } from './watchlists'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrefsProvider>
      <WatchlistProvider>
        <App />
      </WatchlistProvider>
    </PrefsProvider>
  </StrictMode>,
)
