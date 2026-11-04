type ChangeListener = (event: MediaQueryListEvent) => void

type FakeMediaQueryList = MediaQueryList & { _listeners: Set<ChangeListener> }

// Installs a controllable window.matchMedia (jsdom has none). Only the
// prefers-color-scheme queries respond to the simulated device setting.
export function mockMatchMedia(initialDark: boolean): {
  setDark(dark: boolean): void
  restore(): void
} {
  const hadOwn = Object.prototype.hasOwnProperty.call(window, 'matchMedia')
  const original = window.matchMedia
  let dark = initialDark
  const lists: FakeMediaQueryList[] = []

  const matchesFor = (query: string): boolean => {
    if (query.includes('prefers-color-scheme: dark')) return dark
    if (query.includes('prefers-color-scheme: light')) return !dark
    return false
  }

  const matchMedia = (query: string): MediaQueryList => {
    const listeners = new Set<ChangeListener>()
    const list = {
      media: query,
      matches: matchesFor(query),
      onchange: null,
      _listeners: listeners,
      addEventListener: (type: string, fn: ChangeListener) => {
        if (type === 'change') listeners.add(fn)
      },
      removeEventListener: (type: string, fn: ChangeListener) => {
        if (type === 'change') listeners.delete(fn)
      },
      addListener: (fn: ChangeListener) => listeners.add(fn),
      removeListener: (fn: ChangeListener) => listeners.delete(fn),
      dispatchEvent: () => true,
    } as unknown as FakeMediaQueryList
    lists.push(list)
    return list
  }

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: matchMedia,
  })

  return {
    setDark(next: boolean) {
      dark = next
      for (const list of lists) {
        const matches = matchesFor(list.media)
        if (matches === list.matches) continue
        Object.assign(list, { matches })
        const event = { matches, media: list.media } as MediaQueryListEvent
        for (const fn of list._listeners) fn(event)
      }
    },
    restore() {
      if (hadOwn) {
        Object.defineProperty(window, 'matchMedia', {
          configurable: true,
          writable: true,
          value: original,
        })
      } else {
        delete (window as { matchMedia?: unknown }).matchMedia
      }
    },
  }
}
