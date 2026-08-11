import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { logger } from './utils/logger'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

// initialize logger on app startup
logger.init(API_BASE).then(() => {
  logger.info('MeroBank Web starting up')
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})