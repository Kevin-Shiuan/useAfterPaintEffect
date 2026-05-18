import { useRef } from 'react'
import { useAfterPaintEffect } from 'use-after-paint-effect'

/**
 * Card that uses useAfterPaintEffect to trigger animation.
 * This guarantees the animation works because the effect runs
 * only after the browser has actually painted the element.
 */
export function CardWithAfterPaint() {
  const cardRef = useRef<HTMLDivElement>(null)

  useAfterPaintEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateY(0)'
      cardRef.current.style.opacity = '1'
    }
  }, [])

  return (
    <div className="demo-column">
      <h2 className="demo-label">
        <span className="icon">✅</span> useAfterPaintEffect
      </h2>
      <p className="demo-description">
        Always animates — effect runs after paint is complete
      </p>
      <div
        ref={cardRef}
        className="demo-card success"
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
