// src/__tests__/useAfterPaintEffect.test.tsx
import * as React from 'react'
import { suite, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useAfterPaintEffect } from '../useAfterPaintEffect'

function BasicTest() {
  const [state, setState] = React.useState('idle')
  useAfterPaintEffect(() => {
    setState('activated')
  }, [])
  return <div data-testid="status">{state}</div>
}

suite('useAfterPaintEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  test('runs effect after requestAnimationFrame + setTimeout sequence', async () => {
    render(<BasicTest />)

    // Immediately after render, effect hasn't run yet
    expect(screen.getByTestId('status').textContent).toBe('idle')

    // Trigger the RAF → setTimeout chain
    await act(async () => {
      vi.runAllTimers()
    })

    expect(screen.getByTestId('status').textContent).toBe('activated')
  })

  test('clears both RAF and setTimeout on unmount', async () => {
    const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame')
    const cancelRafSpy = vi.spyOn(globalThis, 'cancelAnimationFrame')
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

    const { unmount } = render(<BasicTest />)

    // Verify RAF was scheduled
    expect(rafSpy).toHaveBeenCalledTimes(1)

    // Let RAF execute (which schedules setTimeout)
    await act(async () => {
      vi.advanceTimersByTime(16) // Trigger RAF callback
    })

    // Verify setTimeout was scheduled after RAF
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1)

    // Unmount while setTimeout is still pending
    unmount()

    // Verify both timers were cleaned up
    expect(cancelRafSpy).toHaveBeenCalledTimes(1)
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1)

    rafSpy.mockRestore()
    cancelRafSpy.mockRestore()
    setTimeoutSpy.mockRestore()
    clearTimeoutSpy.mockRestore()
  })

  test('runs cleanup function returned by effect', async () => {
    const cleanupSpy = vi.fn()

    function TestWithCleanup() {
      useAfterPaintEffect(() => {
        return cleanupSpy // Return cleanup function
      }, [])
      return <div>test</div>
    }

    const { unmount } = render(<TestWithCleanup />)

    // Let effect run
    await act(async () => {
      vi.runAllTimers()
    })

    // Unmount should call cleanup
    unmount()
    expect(cleanupSpy).toHaveBeenCalledTimes(1)
  })

  test('re-runs effect when dependencies change', async () => {
    const effectSpy = vi.fn()

    function TestWithDeps({ trigger }: { trigger: number }) {
      useAfterPaintEffect(() => {
        effectSpy(trigger)
      }, [trigger])
      return <div data-testid="trigger">{trigger}</div>
    }

    const { rerender } = render(<TestWithDeps trigger={1} />)

    await act(async () => {
      vi.runAllTimers()
    })
    expect(effectSpy).toHaveBeenCalledWith(1)
    expect(effectSpy).toHaveBeenCalledTimes(1)

    // Change dependency
    rerender(<TestWithDeps trigger={2} />)
    await act(async () => {
      vi.runAllTimers()
    })

    expect(effectSpy).toHaveBeenCalledWith(2)
    expect(effectSpy).toHaveBeenCalledTimes(2)
  })

  test('cancels previous effect when dependencies change', async () => {
    const cleanupSpy = vi.fn()
    const effectSpy = vi.fn(() => cleanupSpy)

    function TestCleanupOnDepChange({ trigger }: { trigger: number }) {
      useAfterPaintEffect(() => {
        return effectSpy()
      }, [trigger])
      return <div>{trigger}</div>
    }

    const { rerender } = render(<TestCleanupOnDepChange trigger={1} />)

    await act(async () => {
      vi.runAllTimers()
    })

    // Change deps before previous effect cleanup
    rerender(<TestCleanupOnDepChange trigger={2} />)

    // Previous effect's cleanup should be called
    expect(cleanupSpy).toHaveBeenCalledTimes(1)
  })

  test('handles multiple rapid dependency changes', async () => {
    const effectSpy = vi.fn()

    function RapidChanges({ trigger }: { trigger: number }) {
      useAfterPaintEffect(() => {
        effectSpy(trigger)
      }, [trigger])
      return <div>{trigger}</div>
    }

    const { rerender } = render(<RapidChanges trigger={1} />)

    // Rapid changes before any effects complete
    rerender(<RapidChanges trigger={2} />)
    rerender(<RapidChanges trigger={3} />)

    await act(async () => {
      vi.runAllTimers()
    })

    // Only the final effect should run
    expect(effectSpy).toHaveBeenCalledTimes(1)
    expect(effectSpy).toHaveBeenCalledWith(3)
  })
})
