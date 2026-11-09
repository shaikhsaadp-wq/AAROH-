import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../store/useStore'

export function CommandPanel() {
  const { isCommandPanelOpen, toggleCommandPanel, sendCommand, commands, backendOnline } = useStore()
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isCommandPanelOpen) inputRef.current?.focus()
  }, [isCommandPanelOpen])

  useEffect(() => {
    if (historyRef.current) historyRef.current.scrollTop = 0
  }, [commands])

  const submit = async () => {
    const command = input.trim()
    if (!command || isSending) return
    setInput('')
    setIsSending(true)
    try { await sendCommand(command) } finally { setIsSending(false) }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void submit()
    }
    if (event.key === 'Escape') toggleCommandPanel()
  }

  if (!isCommandPanelOpen) return null

  return (
    <section className="command-panel" aria-label="Send a command to AAROH">
      <div className="command-panel__header">
        <div className="command-panel__title"><span className={`command-panel__dot${backendOnline ? ' is-online' : ''}`} /><div><strong>Command desk</strong><small>{backendOnline ? 'Connected to the office API' : 'Waiting for backend connection'}</small></div></div>
        <button className="panel-close" onClick={toggleCommandPanel} aria-label="Close command panel">×</button>
      </div>

      {commands.length > 0 && (
        <div className="command-history" ref={historyRef}>
          {commands.slice(0, 5).map((command) => (
            <article className="command-message" key={command.id}>
              <div className="command-message__request"><span>You</span><p>{command.command}</p></div>
              <div className="command-message__response"><span>AAROH</span><p>{command.response}</p>{command.is_simulated && <small>SIMULATED</small>}</div>
            </article>
          ))}
        </div>
      )}

      <form className="command-form" onSubmit={(event) => { event.preventDefault(); void submit() }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What should the office work on?"
          maxLength={2000}
          disabled={isSending}
          aria-label="Command"
        />
        <button type="submit" disabled={!input.trim() || isSending}>{isSending ? 'Sending…' : 'Send command'}</button>
      </form>
      <div className="command-panel__footer">Responses are currently simulated · Enter to send · Esc to close</div>
    </section>
  )
}
