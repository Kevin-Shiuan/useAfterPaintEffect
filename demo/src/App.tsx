import { useState } from 'react'
import { CardWithUseEffect } from './CardWithUseEffect'
import { CardWithAfterPaint } from './CardWithAfterPaint'
import './App.css'

function App() {
  const [key, setKey] = useState(0)

  const handleRemount = () => {
    setKey(prev => prev + 1)
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">
          <span className="hook-name">useAfterPaintEffect</span> Demo
        </h1>
        <p className="subtitle">
          Comparing CSS transition behavior between <code>useEffect</code> and <code>useAfterPaintEffect</code>
        </p>
      </header>

      <div className="demo-container" key={key}>
        <CardWithUseEffect />
        <CardWithAfterPaint />
      </div>

      <button className="remount-button" onClick={handleRemount}>
        <span className="button-icon">🔄</span>
        Remount Components
      </button>

      <footer className="footer">
        <p>
          Click <strong>Remount Components</strong> to replay the animations and observe the difference.
        </p>
        <p className="hint">
          The left card (<code>useEffect</code>) may appear without animation because the effect runs before the browser paint.
          <br />
          The right card (<code>useAfterPaintEffect</code>) always animates because the effect waits for the paint to complete.
        </p>
      </footer>
    </div>
  )
}

export default App
