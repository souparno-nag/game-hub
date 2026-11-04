import { afterEach, describe, expect, it, vi } from 'vitest'
import indexHtml from '../../index.html?raw'
import { mockMatchMedia } from '../test/matchMedia.ts'

// Runs the real inline script from index.html, the one that sets the theme
// before React loads, against controlled storage and device settings.
function runThemeScript() {
  const match = indexHtml.match(/<script>([\s\S]*?)<\/script>/)
  expect(match, 'inline theme script in index.html').not.toBeNull()
  new Function(match![1])()
}

let media: ReturnType<typeof mockMatchMedia> | null = null

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  media?.restore()
  media = null
  delete document.documentElement.dataset.theme
})

describe('index.html theme script', () => {
  it('applies the stored theme over the device setting', () => {
    localStorage.setItem('game-hub:theme', 'dark')
    media = mockMatchMedia(false)
    runThemeScript()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('ignores an invalid stored value and follows the device', () => {
    localStorage.setItem('game-hub:theme', 'blue')
    media = mockMatchMedia(true)
    runThemeScript()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('follows the device when reading storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError')
    })
    media = mockMatchMedia(false)
    runThemeScript()
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('follows the device when accessing localStorage itself throws', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError')
    })
    media = mockMatchMedia(true)
    runThemeScript()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('falls back to light with nothing stored and no matchMedia', () => {
    expect(window.matchMedia).toBeUndefined()
    runThemeScript()
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
