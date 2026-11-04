import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusMessage, type StatusTone } from './StatusMessage.tsx'

// Text a screen reader announces: everything except aria-hidden nodes.
function announcedText(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement
  clone.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove())
  return clone.textContent?.replace(/\s+/g, ' ').trim() ?? ''
}

const cases: Array<{
  tone: StatusTone
  role: 'status' | 'alert'
  announced: string
  glyph: string
}> = [
  { tone: 'info', role: 'status', announced: 'Info: Saved for later.', glyph: 'i' },
  { tone: 'success', role: 'status', announced: 'Success: Saved for later.', glyph: '✓' },
  { tone: 'warning', role: 'status', announced: 'Warning: Saved for later.', glyph: '!' },
  { tone: 'error', role: 'alert', announced: 'Error: Saved for later.', glyph: '×' },
]

describe('StatusMessage', () => {
  it.each(cases)('$tone uses role="$role" and announces "$announced"', ({ tone, role, announced }) => {
    render(<StatusMessage tone={tone}>Saved for later.</StatusMessage>)

    const message = screen.getByRole(role)
    expect(announcedText(message)).toBe(announced)
  })

  it.each(cases)('$tone shows the glyph "$glyph" hidden from screen readers', ({ tone, role, glyph }) => {
    render(<StatusMessage tone={tone}>Saved for later.</StatusMessage>)

    const hidden = screen.getByRole(role).querySelectorAll('[aria-hidden="true"]')
    expect(hidden).toHaveLength(1)
    expect(hidden[0].textContent).toBe(glyph)
  })

  it('does not interrupt as an alert for non-error tones', () => {
    render(<StatusMessage tone="info">No games yet.</StatusMessage>)

    expect(screen.getByRole('status')).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()
  })
})
