import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import UrlCard from './components/UrlCard'

import type { Url } from './types'

const fakeUrl: Url = {
  slug: "abc123",
  original_url: "https://google.com",
  created_at: "2026-05-12T00:00:00",
  expires_at: "2026-06-12T00:00:00"
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UrlCard url={fakeUrl}/>
    </BrowserRouter>
  </StrictMode>,
)