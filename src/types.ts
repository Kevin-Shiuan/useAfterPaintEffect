export type AfterPaintCleanup = void | (() => void)

export type AfterPaintEffect = () => AfterPaintCleanup

export type AfterPaintEffectDeps = React.DependencyList