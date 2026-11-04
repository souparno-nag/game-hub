import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

describe('App', () => {
  it('renders the arcade shell', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'Game Hub' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('heading', { level: 1, name: 'Arcade' })).toBeTruthy()
  })
})
