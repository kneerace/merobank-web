import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { logger } from './utils/logger'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK !== 'true') return

  const { worker } = await import('./mocks/browser')
  return worker.start({
    onUnhandledRequest: 'bypass'  // don't warn about unhandled requests
  })
}

enableMocking().then(() => {
  logger.init(API_BASE).then(() => {
    logger.info('MeroBank Web starting up')
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  })
})