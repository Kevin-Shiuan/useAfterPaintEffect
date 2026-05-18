# useAfterPaintEffect

A React hook that runs an effect only after at least one paint has occurred. Perfect for starting CSS transitions after the first render is complete.

## Installation

```bash
npm install use-after-paint-effect
```

## The Problem

When you want to trigger CSS transitions on component mount, you may encounter the "transition-from-default" problem where the transition doesn't work because the element hasn't been painted yet. Learn more on [this issue](https://github.com/facebook/react/issues/20863).

```jsx
// ❌ May not work: element might not be painted yet, so transition won't fire
function Card() {
  const cardRef = useRef < HTMLDivElement > null

  useEffect(() => {
    cardRef.current.style.transform = 'translateY(0)'
  }, [])

  return (
    <div
      ref={cardRef}
      style={{
        transform: 'translateY(-100%)',
        transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      🎉 Hello World!
    </div>
  )
}
```

## The Solution

> ⚠️ **Note:** In most cases you don’t need this hook. Usually `useEffect` or `useLayoutEffect` is enough.  
> Reach for `useAfterPaintEffect` only if you hit the issue described above.

`useAfterPaintEffect` ensures your effect runs after the browser has actually painted the element:

```jsx
// ✅ This works perfectly - transition is visible
function Card() {
  const cardRef = useRef < HTMLDivElement > null

  useAfterPaintEffect(() => {
    cardRef.current.style.transform = 'translateY(0)'
  }, [])

  return (
    <div
      ref={cardRef}
      style={{
        transform: 'translateY(-100%)',
        transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      🎉 Hello World!
    </div>
  )
}
```

## How It Works

The basic browser rendering pipeline is:

1. JavaScript (Including React)
2. Layout
3. Paint
4. Composite

To ensure that the effect runs after the browser has painted the element, we stack `requestAnimationFrame` and `setTimeout(0)` in `useEffect`:

1. React commit phase
2. `useEffect` schedules a `requestAnimationFrame` callback (before next paint)
3. Browser does layout & prepares paint
4. `requestAnimationFrame` fires → inside it we schedule setTimeout(0) (next macrotask)
5. Browser paints the frame 🎨
6. Next macrotask runs → our `effect` executes

Here’s what `useAfterPaintEffect` does under the hood:

```jsx
useEffect(() => {
  requestAnimationFrame(() => {
    setTimeout(() => {
      effect()
    }, 0)
  })
}, deps)
```

> 💡 **Tip:** The implementation is tiny (just a few lines).  
> Feel free to copy the code directly into your project instead of installing the package if you prefer.


## API

```typescript
useAfterPaintEffect(effect: () => void | (() => void), deps: React.DependencyList): void
```

### Parameters

- **`effect`**: A function that runs after paint. Can optionally return a cleanup function.
- **`deps`**: Dependency array, same as `useEffect`. The effect re-runs when dependencies change.

## Key Features

- ✅ **Paint-aware**: Guarantees your effect runs after browser paint
- ✅ **Cleanup support**: Return a function from your effect for cleanup, just like `useEffect`
- ✅ **Dependency tracking**: Re-runs when dependencies change, just like `useEffect`
- ✅ **TypeScript**: Full TypeScript support with proper types
- ✅ **Lightweight**: Zero dependencies, minimal bundle impact

## Use Cases

Perfect for:

- 🎨 CSS transitions and animations on mount
- 📏 Measurements that need the element to be painted first
- 🎪 Any effect that needs visual elements to be ready

## Browser Compatibility

Works in all modern browsers that support:

- `requestAnimationFrame` (IE 10+)
- `setTimeout` (all browsers)

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build
```

## Examples

Check out the [Live Demo](https://use-after-paint-effect.kevin-shiuan.com/) to see the comparison between `useEffect` and `useAfterPaintEffect` in action.

The `examples` folder contains the source code for the demo, comparing `useEffect` vs `useAfterPaintEffect` side by side. 🎉

## Acknowledgments

Special thanks to [marko-knoebl](https://github.com/marko-knoebl) and all the participants in this [React issue](https://github.com/facebook/react/issues/20863), which inspired this hook.

Extra thanks to [Shiny](https://github.com/shinychang) for the detailed explanation of the browser rendering pipeline, which helped me resolve the problem of missing enter transitions while working at [Phase](https://www.linkedin.com/company/phase-software/).

This package is essentially a clean wrapper around that trick, published for convenience and documentation.

## License

MIT © [Kevin Shiuan](https://github.com/Kevin-Shiuan)

## Contributing

Issues and pull requests are welcome! Please feel free to contribute.
