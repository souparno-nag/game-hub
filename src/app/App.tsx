import { StatusMessage } from '../components/StatusMessage.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-container app-header__inner">
          <a className="app-brand" href="/">
            Game Hub
          </a>
          <div className="app-header__actions">
            {/* Sign-in controls join the toggle here in Milestone 7. */}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="app-main">
        <div className="app-container">
          <section aria-labelledby="library-heading">
            <h1 id="library-heading">Arcade</h1>
            <p className="app-intro">Pick a game. No account needed to play.</p>
            <StatusMessage tone="info">No games yet. Starter games are on the way.</StatusMessage>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
