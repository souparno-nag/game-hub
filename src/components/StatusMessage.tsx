import type { ReactNode } from 'react'

export type StatusTone = 'info' | 'success' | 'warning' | 'error'

// Each tone carries a glyph and a spoken word, so meaning never rests on
// colour alone.
const TONES: Record<StatusTone, { glyph: string; word: string }> = {
  info: { glyph: 'i', word: 'Info:' },
  success: { glyph: '✓', word: 'Success:' },
  warning: { glyph: '!', word: 'Warning:' },
  error: { glyph: '×', word: 'Error:' },
}

export function StatusMessage({
  tone,
  children,
}: {
  tone: StatusTone
  children: ReactNode
}) {
  const { glyph, word } = TONES[tone]

  return (
    <div className={`status status--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <span className="status__badge" aria-hidden="true">
        {glyph}
      </span>
      <span className="status__text">
        <span className="visually-hidden">{word} </span>
        {children}
      </span>
    </div>
  )
}
