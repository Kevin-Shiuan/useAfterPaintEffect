import { useEffect, useRef } from 'react'
import { INITIAL_CARD_STYLE } from './cardStyle'

export function CardWithUseEffect() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'translateY(0)'
    cardRef.current.style.opacity = '1'
  }, [])

  return (
    <div ref={cardRef} className="demo-card" style={INITIAL_CARD_STYLE}>
      <span className="card-emoji" aria-hidden="true">◐</span>
      <span className="card-text">Hello</span>
    </div>
  )
}
