'use client'

import { useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { motion, useDragControls } from 'framer-motion'
import { executeCommand, formatInitialHistory, type TerminalEntry } from '@/lib/terminal/commands'

export function BlewTerminal() {
  const [history, setHistory] = useState<TerminalEntry[]>(formatInitialHistory)
  const [input, setInput] = useState('')
  const [expanded, setExpanded] = useState(false)
  const controls = useDragControls()

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!input.trim()) return
    const result = executeCommand(input)
    if (result === '__CLEAR__') { setHistory([]); setInput(''); return }
    setHistory((current) => [...current, { kind: 'input', text: input }, { kind: 'output', text: result }])
    setInput('')
  }

  return (
    <motion.section
      layout
      drag="y"
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ top: -80, bottom: 80 }}
      className={`terminal ${expanded ? 'terminal-expanded' : ''}`}
      aria-label="Interactive Blew terminal"
    >
      <header className="terminal-bar" onPointerDown={(event) => controls.start(event)}>
        <div className="traffic-lights" aria-hidden="true"><i /><i /><i /></div>
        <span>blew</span>
        <button type="button" aria-label={expanded ? 'Collapse terminal' : 'Expand terminal'} onClick={() => setExpanded(!expanded)}>
          {expanded ? <Minimize2 /> : <Maximize2 />}
        </button>
      </header>
      <div className="terminal-body" aria-live="polite">
        {history.map((entry, index) => <pre key={`${entry.kind}-${index}`} className={entry.kind}>{entry.kind === 'input' ? '$ ' : ''}{entry.text}</pre>)}
        <form onSubmit={submit} className="terminal-form">
          <span>$</span><b aria-hidden="true" /><input value={input} onChange={(event) => setInput(event.target.value)} aria-label="Terminal command" autoComplete="off" spellCheck={false} />
        </form>
      </div>
    </motion.section>
  )
}
