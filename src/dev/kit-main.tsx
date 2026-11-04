import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/rubik'
import '../styles/global.css'
import './kit-preview.css'
import { KitPreview } from './KitPreview.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KitPreview />
  </StrictMode>,
)
