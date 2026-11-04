import { Field } from '../components/Field.tsx'
import { StatusMessage } from '../components/StatusMessage.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'

// Every kit piece in its states, for visual checks in both themes.
export function KitPreview() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-container app-header__inner">
          <a className="app-brand" href="/">
            Game Hub
          </a>
          <div className="app-header__actions">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="app-main">
        <div className="app-container">
          <h1>Kit</h1>
          <p className="app-intro">Every shared piece, in each of its states.</p>

          <section className="kit-section" aria-labelledby="kit-buttons">
            <h2 id="kit-buttons">Buttons</h2>
            <div className="kit-row">
              <button type="button" className="btn">
                Play
              </button>
              <button type="button" className="btn btn--secondary">
                Restart
              </button>
              <button type="button" className="btn btn--sm">
                Small
              </button>
              <button type="button" className="btn btn--secondary btn--sm">
                Small secondary
              </button>
              <button type="button" className="btn" disabled>
                Submit score
              </button>
              <button type="button" className="btn btn--secondary" disabled>
                Restart
              </button>
            </div>
          </section>

          <section className="kit-section" aria-labelledby="kit-forms">
            <h2 id="kit-forms">Panel, form and status</h2>
            <div className="kit-grid">
              <div className="panel">
                <h3 className="kit-panel-title">Sign in to post scores</h3>
                <form className="kit-form" onSubmit={(event) => event.preventDefault()}>
                  <Field label="Email" hint="We'll email you a sign-in link.">
                    {(control) => (
                      <input className="input" type="email" placeholder="player@example.com" {...control} />
                    )}
                  </Field>
                  <Field
                    label="Display name"
                    error="Enter a display name to appear on leaderboards."
                  >
                    {(control) => <input className="input" type="text" {...control} />}
                  </Field>
                  <button type="submit" className="btn">
                    Send link
                  </button>
                </form>
              </div>

              <div className="kit-stack">
                <StatusMessage tone="info">Playing as guest. Sign in to post scores.</StatusMessage>
                <StatusMessage tone="success">Score posted. You're 3rd on the board.</StatusMessage>
                <StatusMessage tone="warning">Leaderboard is loading slowly. Retrying.</StatusMessage>
                <StatusMessage tone="error">
                  Score didn't post. Check your connection and try again.
                </StatusMessage>
                <StatusMessage tone="info">
                  Signed in as averyveryverylongdisplaynamewithoutanyspaces@example-arcade.com
                </StatusMessage>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
