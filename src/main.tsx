import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import Scrapbook from '@/components/Scrapbook'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main id="main-content" className="min-h-dvh">
      <Scrapbook />
    </main>
  </StrictMode>,
)
