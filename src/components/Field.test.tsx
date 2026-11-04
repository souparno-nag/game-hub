import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Field } from './Field.tsx'

// What a screen reader reads as the control's description: the elements
// named by aria-describedby, in order, minus aria-hidden nodes.
function describedText(control: HTMLElement): string {
  const ids = control.getAttribute('aria-describedby')?.split(' ') ?? []
  return ids
    .map((id) => {
      const node = document.getElementById(id)
      expect(node, `element #${id}`).not.toBeNull()
      const clone = node!.cloneNode(true) as HTMLElement
      clone.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove())
      return clone.textContent?.trim() ?? ''
    })
    .join(' | ')
}

const hint = "We'll email you a sign-in link."
const error = 'Enter a display name to appear on leaderboards.'

describe('Field', () => {
  it('labels the control', () => {
    render(<Field label="Email">{(c) => <input className="input" {...c} />}</Field>)

    expect(screen.getByLabelText('Email').tagName).toBe('INPUT')
  })

  it('describes the control with its hint and leaves it valid', () => {
    render(
      <Field label="Email" hint={hint}>
        {(c) => <input className="input" {...c} />}
      </Field>,
    )

    const input = screen.getByLabelText('Email')
    expect(describedText(input)).toBe(hint)
    expect(input.hasAttribute('aria-invalid')).toBe(false)
  })

  it('describes the control with hint then error and marks it invalid', () => {
    render(
      <Field label="Display name" hint="Shown on leaderboards." error={error}>
        {(c) => <input className="input" {...c} />}
      </Field>,
    )

    const input = screen.getByLabelText('Display name')
    expect(describedText(input)).toBe(`Shown on leaderboards. | ${error}`)
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByText(error)).toBeTruthy()
  })

  it('marks the error with a visible glyph, hidden from screen readers', () => {
    render(
      <Field label="Display name" error={error}>
        {(c) => <input className="input" {...c} />}
      </Field>,
    )

    const input = screen.getByLabelText('Display name')
    const errorNode = document.getElementById(input.getAttribute('aria-describedby')!)!
    const glyph = errorNode.querySelector('[aria-hidden="true"]')
    expect(glyph?.textContent).toBe('×')
    expect(describedText(input)).toBe(error)
  })

  it('adds no description when there is no hint or error', () => {
    render(<Field label="Email">{(c) => <input className="input" {...c} />}</Field>)

    expect(screen.getByLabelText('Email').hasAttribute('aria-describedby')).toBe(false)
  })

  it('gives each field its own ids', () => {
    render(
      <>
        <Field label="Email" hint="First hint">
          {(c) => <input className="input" {...c} />}
        </Field>
        <Field label="Display name" hint="Second hint">
          {(c) => <input className="input" {...c} />}
        </Field>
      </>,
    )

    expect(describedText(screen.getByLabelText('Email'))).toBe('First hint')
    expect(describedText(screen.getByLabelText('Display name'))).toBe('Second hint')
  })
})
