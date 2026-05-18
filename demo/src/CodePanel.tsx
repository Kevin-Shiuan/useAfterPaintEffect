import { Fragment, type ReactNode } from 'react'

type TokenKind = 'key' | 'fn' | 'str' | 'com' | 'num' | 'jsx'

interface Token {
  kind?: TokenKind
  text: string
}

const KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'function',
  'return',
  'if',
  'const',
  'let',
])

const TOKEN_PATTERN =
  /(?<comment>\/\/[^\n]*)|(?<string>'[^']*'|"[^"]*"|`[^`]*`)|(?<number>\b\d+\b)|(?<identifier>\b[A-Za-z_][A-Za-z0-9_]*\b)|(?<other>[^A-Za-z0-9_'"`]+)/g

function tokenize(line: string): Token[] {
  const tokens: Token[] = []
  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const groups = match.groups ?? {}
    if (groups.comment) tokens.push({ kind: 'com', text: groups.comment })
    else if (groups.string) tokens.push({ kind: 'str', text: groups.string })
    else if (groups.number) tokens.push({ kind: 'num', text: groups.number })
    else if (groups.identifier) tokens.push(classifyIdentifier(groups.identifier))
    else if (groups.other) tokens.push({ text: groups.other })
  }
  return tokens
}

function classifyIdentifier(name: string): Token {
  if (KEYWORDS.has(name)) return { kind: 'key', text: name }
  if (/^[A-Z]/.test(name)) return { kind: 'jsx', text: name }
  if (name.startsWith('use')) return { kind: 'fn', text: name }
  return { text: name }
}

function renderToken(token: Token, index: number): ReactNode {
  if (!token.kind) return <Fragment key={index}>{token.text}</Fragment>
  return (
    <span key={index} className={`tok-${token.kind}`}>
      {token.text}
    </span>
  )
}

interface CodePanelProps {
  filename: string
  source: string
}

export function CodePanel({ filename, source }: CodePanelProps) {
  const lines = source.split('\n')
  return (
    <div className="code-panel">
      <div className="code-bar">
        <span className="code-bar-dots">
          <span />
          <span />
          <span />
        </span>
        <span>{filename}</span>
      </div>
      <pre>
        <code>
          {lines.map((line, lineIndex) => (
            <Fragment key={lineIndex}>
              {tokenize(line).map(renderToken)}
              {'\n'}
            </Fragment>
          ))}
        </code>
      </pre>
    </div>
  )
}
