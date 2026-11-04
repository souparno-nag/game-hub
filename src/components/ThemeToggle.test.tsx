import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { mockMatchMedia } from '../test/matchMedia.ts'
import { ThemeToggle } from './ThemeToggle.tsx'

let media: ReturnType<typeof mockMatchMedia> | null = null

afterEach(() => {
  localStorage.clear()
  media?.restore()
  media = null
  delete document.documentElement.dataset.theme
})

const theme = () => document.documentElement.dataset.theme

describe('ThemeToggle', () => {
  it('offers dark when the page is light', () => {
    document.documentElement.dataset.theme = 'light'
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: 'Switch to dark theme' }).textContent).toContain('Dark')
  })

  it('offers light when the page is dark', () => {
    document.documentElement.dataset.theme = 'dark'
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: 'Switch to light theme' }).textContent).toContain('Light')
  })

  it('asks for the text form of the sun glyph so phones do not swap in a colour emoji', () => {
    document.documentElement.dataset.theme = 'dark'
    render(<ThemeToggle />)

    const glyph = screen.getByRole('button').querySelector('[aria-hidden="true"]')
    expect(glyph?.textContent).toBe('☀︎')
  })

  it('switches the theme and remembers the choice', () => {
    document.documentElement.dataset.theme = 'light'
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))

    expect(theme()).toBe('dark')
    expect(localStorage.getItem('game-hub:theme')).toBe('dark')
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeTruthy()
  })

  it('follows the device setting while no choice is stored', () => {
    media = mockMatchMedia(false)
    document.documentElement.dataset.theme = 'light'
    render(<ThemeToggle />)

    act(() => media!.setDark(true))

    expect(theme()).toBe('dark')
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeTruthy()
  })

  it('ignores the device setting once a choice is stored', () => {
    localStorage.setItem('game-hub:theme', 'light')
    media = mockMatchMedia(false)
    document.documentElement.dataset.theme = 'light'
    render(<ThemeToggle />)

    act(() => media!.setDark(true))

    expect(theme()).toBe('light')
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeTruthy()
  })

  it('stops following the device setting after unmount', () => {
    media = mockMatchMedia(false)
    document.documentElement.dataset.theme = 'light'
    const { unmount } = render(<ThemeToggle />)

    unmount()
    media.setDark(true)

    expect(theme()).toBe('light')
  })

  it('works without matchMedia', () => {
    expect(window.matchMedia).toBeUndefined()
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))

    expect(theme()).toBe('dark')
  })
})
