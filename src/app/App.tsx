function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="app-brand" href="/">
          Game Hub
        </a>
      </header>
      <main className="app-main">
        <section aria-labelledby="library-heading">
          <h1 id="library-heading">Arcade</h1>
          <p className="app-empty">No games yet. Starter games are on the way.</p>
        </section>
      </main>
    </div>
  );
}

export default App;
