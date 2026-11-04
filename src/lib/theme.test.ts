import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockMatchMedia } from '../test/matchMedia.ts'
import {
  applyTheme,
  readStoredTheme,
  resolveTheme,
  systemTheme,
  writeStoredTheme,
} from './theme.ts'

let media: ReturnType<typeof mockMatchMedia> | null = null

function useSystemDark(dark: boolean) {
  media = mockMatchMedia(dark)
}

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  media?.restore()
  media = null
  delete document.documentElement.dataset.theme
})

describe('readStoredTheme', () => {
  it('returns the stored theme', () => {
    localStorage.setItem('game-hub:theme', 'dark')
    expect(readStoredTheme()).toBe('dark')
  })

  it('returns null when nothing is stored', () => {
    expect(readStoredTheme()).toBeNull()
  })

  it('ignores a stored value that is not a theme', () => {
    localStorage.setItem('game-hub:theme', 'blue')
    expect(readStoredTheme()).toBeNull()
  })

  it('returns null when reading storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError')
    })
    expect(readStoredTheme()).toBeNull()
  })

  it('returns null when accessing localStorage itself throws', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError')
    })
    expect(readStoredTheme()).toBeNull()
  })
})

describe('writeStoredTheme', () => {
  it('stores the theme under the game-hub key', () => {
    writeStoredTheme('light')
    expect(localStorage.getItem('game-hub:theme')).toBe('light')
  })

  it('does not throw when storage rejects the write', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })
    expect(() => writeStoredTheme('dark')).not.toThrow()
  })
})

describe('systemTheme', () => {
  it('is dark when the device prefers dark', () => {
    useSystemDark(true)
    expect(systemTheme()).toBe('dark')
  })

  it('is light when the device prefers light', () => {
    useSystemDark(false)
    expect(systemTheme()).toBe('light')
  })

  it('is light when matchMedia is unavailable', () => {
    expect(window.matchMedia).toBeUndefined()
    expect(systemTheme()).toBe('light')
  })
})

describe('resolveTheme', () => {
  it('prefers the stored choice over the device setting', () => {
    useSystemDark(true)
    localStorage.setItem('game-hub:theme', 'light')
    expect(resolveTheme()).toBe('light')
  })

  it('falls back to the device setting when nothing is stored', () => {
    useSystemDark(true)
    expect(resolveTheme()).toBe('dark')
  })
})

describe('applyTheme', () => {
  it('sets data-theme on the document element', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('sets data-theme on a given root', () => {
    const root = document.createElement('div')
    applyTheme('light', root)
    expect(root.dataset.theme).toBe('light')
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
})
