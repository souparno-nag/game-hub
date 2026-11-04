import { useId, type ReactNode } from 'react'

export type FieldControlProps = {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}

// Wires a label, optional hint and optional error to one control. The
// control is rendered by the caller so any input type fits.
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: (control: FieldControlProps) => ReactNode
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ')

  const control: FieldControlProps = { id }
  if (describedBy) control['aria-describedby'] = describedBy
  if (error) control['aria-invalid'] = true

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children(control)}
      {hint && (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field__error" id={errorId}>
          <span aria-hidden="true">×</span> {error}
        </p>
      )}
    </div>
  )
}
