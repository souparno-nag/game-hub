import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

describe('App', () => {
  it('renders the arcade shell', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'Game Hub' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('heading', { level: 1, name: 'Arcade' })).toBeTruthy()
  })

  it('offers the theme toggle in the header', () => {
    render(<App />)

    const toggle = screen.getByRole('button', { name: /switch to (dark|light) theme/i })
    expect(toggle.closest('header')).not.toBeNull()
  })

  it('introduces the library and shows the empty state', () => {
    render(<App />)

    expect(screen.getByText('Pick a game. No account needed to play.')).toBeTruthy()
    expect(screen.getByRole('status').textContent).toContain(
      'No games yet. Starter games are on the way.',
    )
  })
})
