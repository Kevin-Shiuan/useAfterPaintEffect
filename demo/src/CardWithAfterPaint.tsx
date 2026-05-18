import { useRef } from 'react'
import { useAfterPaintEffect } from 'use-after-paint-effect'
import { INITIAL_CARD_STYLE } from './cardStyle'

export function CardWithAfterPaint() {
  const cardRef = useRef<HTMLDivElement>(null)

  useAfterPaintEffect(() => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'translateY(0)'
    cardRef.current.style.opacity = '1'
  }, [])

  return (
    <div ref={cardRef} className="demo-card success" style={INITIAL_CARD_STYLE}>
      <span className="card-emoji" aria-hidden="true">◑</span>
      <span className="card-text">Hello</span>
    </div>
  )
}
