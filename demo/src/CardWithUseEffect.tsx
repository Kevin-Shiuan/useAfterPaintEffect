import { useEffect, useRef } from 'react'

/**
 * Card that uses standard useEffect to trigger animation.
 * This may fail to animate due to the "transition-from-default" problem:
 * The element might not be painted yet when useEffect runs.
 */
export function CardWithUseEffect() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateY(0)'
      cardRef.current.style.opacity = '1'
    }
  }, [])

  return (
    <div className="demo-column">
      <h2 className="demo-label">
        <span className="icon">❌</span> useEffect
      </h2>
      <p className="demo-description">
        May not animate — element might not be painted yet
      </p>
      <div
        ref={cardRef}
        className="demo-card"
        style={{
          transform: 'translateY(-100%)',
          opacity: 0,
          transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out',
        }}
      >
        <div className="card-emoji">🎉</div>
        <div className="card-text">Hello World!</div>
      </div>
    </div>
  )
}
