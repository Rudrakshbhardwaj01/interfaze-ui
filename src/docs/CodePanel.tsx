import { useEffect, useState, type ReactNode } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'

if (!Prism.languages.tsx) Prism.languages.tsx = Prism.languages.extend('jsx', Prism.languages.typescript)

type CodeLanguage = 'tsx' | 'typescript' | 'javascript' | 'css' | 'json' | 'bash'

function languageGrammar(language: CodeLanguage) {
  if (language === 'css') return Prism.languages.css
  if (language === 'json') return Prism.languages.json
  if (language === 'bash') return Prism.languages.bash
  if (language === 'javascript') return Prism.languages.javascript
  return Prism.languages.tsx ?? Prism.languages.typescript
}

export function highlightCode(code: string, language: CodeLanguage = 'tsx') {
  const grammar = languageGrammar(language)
  return grammar ? Prism.highlight(code, grammar, language) : String(Prism.util.encode(code))
}

export function CodePanel({ filename, code, language = 'tsx', copy }: { filename: string; code: string; language?: CodeLanguage; copy: (value: string) => ReactNode }) {
  const [highlighted, setHighlighted] = useState(code)

  useEffect(() => {
    setHighlighted(highlightCode(code, language))
  }, [code, language])

  return <div className="code-panel">
    <div className="code-toolbar"><span>{filename}</span>{copy(code)}</div>
    <pre className={`language-${language}`} tabIndex={0} aria-label={`${filename} source code`}><code dangerouslySetInnerHTML={{ __html: highlighted }} /></pre>
  </div>
}
