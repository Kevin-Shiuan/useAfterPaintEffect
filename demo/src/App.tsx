import { useState } from 'react'
import { CardWithUseEffect } from './CardWithUseEffect'
import { CardWithAfterPaint } from './CardWithAfterPaint'
import { CodePanel } from './CodePanel'
import USE_EFFECT_SOURCE from './CardWithUseEffect.tsx?raw'
import USE_AFTER_PAINT_SOURCE from './CardWithAfterPaint.tsx?raw'
import './App.css'

function App() {
  const [remountKey, setRemountKey] = useState(0)

  const handleRemount = () => {
    setRemountKey((previous) => previous + 1)
  }

  return (
    <main className="app">
      <header className="masthead">
        <span className="eyebrow">React · Hook study</span>
        <h1 className="wordmark">
          <em>useAfterPaint</em>Effect
        </h1>
        <span className="issue">
          № 01
          <br />
          {new Date().getFullYear()}
        </span>
      </header>

      <p className="lede">
        A side-by-side study of mount transitions. <code>useEffect</code> runs before paint —
        animations can be skipped. <code>useAfterPaintEffect</code> waits for the first paint,
        so the transition fires every time.
      </p>

      <section className="toolbar">
        <span className="toolbar-label">Live comparison</span>
        <button className="remount-button" onClick={handleRemount} type="button">
          <span className="remount-label">
            Replay <span className="remount-arrow" aria-hidden="true">→</span> Remount
          </span>
        </button>
      </section>

      <section className="spread" key={remountKey}>
        <article className="column">
          <div className="column-head">
            <span className="column-index">01</span>
            <span className="column-tag bad">Flaky</span>
          </div>
          <h2 className="column-name">useEffect</h2>
          <p className="column-note">
            Effect commits synchronously before browser paint. Style mutation may collapse into
            the first frame — no transition is observed.
          </p>
          <div className="stage">
            <CardWithUseEffect />
          </div>
          <CodePanel filename="CardWithUseEffect.tsx" source={USE_EFFECT_SOURCE} />
        </article>

        <article className="column">
          <div className="column-head">
            <span className="column-index">02</span>
            <span className="column-tag good">Stable</span>
          </div>
          <h2 className="column-name">useAfterPaintEffect</h2>
          <p className="column-note">
            Effect is deferred until after the browser commits the first paint. The starting
            styles render, then the transition runs deterministically.
          </p>
          <div className="stage">
            <CardWithAfterPaint />
          </div>
          <CodePanel filename="CardWithAfterPaint.tsx" source={USE_AFTER_PAINT_SOURCE} />
        </article>
      </section>

      <footer className="colophon">
        <div>
          <h4>How to read</h4>
          <p>
            Press <code>Replay</code> to remount both columns. The left card may snap into place
            without animating; the right card animates on every mount.
          </p>
        </div>
        <div>
          <h4>Install</h4>
          <p>
            <code>pnpm add use-after-paint-effect</code> — a 1 KB hook that schedules its
            callback after the browser has painted.
          </p>
        </div>
      </footer>
    </main>
  )
}

export default App
