import { useEffect } from 'react'
import type {
  AfterPaintCleanup,
  AfterPaintEffect,
  AfterPaintEffectDeps,
} from './types'

/**
 * useAfterPaintEffect
 * -------------------
 * Like `useEffect`, but your `effect` runs only **after at least one real paint**:
 *   React commit → layout effects → requestAnimationFrame (pre-paint) → browser paint → effect()
 *
 * Use this to flip "enter" classes or start CSS transitions **after the element
 * has actually appeared on screen once**, avoiding transition-from-default glitches.
 *
 * @param effect A function invoked after the paint. It may return a cleanup
 *               function; that cleanup will run on dependency change or unmount,
 *               mirroring `useEffect` semantics.
 * @param deps   Dependency list controlling when the effect re-schedules. Same
 *               rules as `useEffect`.
 *
 * @example
 * // Flip a class after first paint to start a CSS transition
 * function Card() {
 *   const [active, setActive] = React.useState(false);
 *   useAfterPaintEffect(() => { setActive(true); }, []);
 *   return (
 *     <div className={active ? "card card--enter" : "card"} />
 *   );
 * }
 *
 * @remarks
 * - Uses rAF → setTimeout(0) to ensure one paint occurs before `effect`.
 * - Cleans up pending rAF/timeout if dependencies change or the component unmounts.
 * - In React 18 dev Strict Mode, the mount/unmount/mount cycle is handled safely.
 */
export function useAfterPaintEffect(
  effect: AfterPaintEffect,
  deps: AfterPaintEffectDeps
): void {
  useEffect(() => {
    let cancelled = false
    let rafId = 0
    let timeoutId: number | null = null
    let userCleanup: AfterPaintCleanup

    rafId = requestAnimationFrame(() => {
      timeoutId = setTimeout(() => {
        if (cancelled) return
        userCleanup = effect()
      }, 0)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      if (timeoutId !== null) clearTimeout(timeoutId)
      if (typeof userCleanup === 'function') userCleanup()
    }
  }, deps)
}
