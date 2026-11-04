import { useEffect, useState } from 'react'
import {
  applyTheme,
  readStoredTheme,
  resolveTheme,
  writeStoredTheme,
  type Theme,
} from '../lib/theme.ts'

// The inline script in index.html has normally set data-theme already.
function currentTheme(): Theme {
  const applied = document.documentElement.dataset.theme
  return applied === 'light' || applied === 'dark' ? applied : resolveTheme()
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  // Follow the device setting until the visitor makes a choice.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme() !== null) return
      const next: Theme = event.matches ? 'dark' : 'light'
      applyTheme(next)
      setTheme(next)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const next: Theme = theme === 'dark' ? 'light' : 'dark'

  const toggle = () => {
    applyTheme(next)
    writeStoredTheme(next)
    setTheme(next)
  }

  return (
    <button
      type="button"
      className="btn btn--secondary btn--sm"
      aria-label={`Switch to ${next} theme`}
      onClick={toggle}
    >
      <span aria-hidden="true">{next === 'dark' ? '☾' : '☀'}</span>
      {next === 'dark' ? 'Dark' : 'Light'}
    </button>
  )
}
