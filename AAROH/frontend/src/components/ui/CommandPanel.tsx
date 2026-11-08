// AAROH AI — Command Input Panel

import { useState, useRef, useEffect } from 'react'
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
    if (historyRef.current) {
      historyRef.current.scrollTop = 0
    }
  }, [commands])

  const handleSend = async () => {
    const cmd = input.trim()
    if (!cmd || isSending) return
    setInput('')
    setIsSending(true)
    await sendCommand(cmd)
    setIsSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === 'Escape') toggleCommandPanel()
  }

  if (!isCommandPanelOpen) return null

  return (
    <div
      className="fixed bottom-4 left-1/2 z-40 pointer-events-auto"
      style={{ transform: 'translateX(-50%)', width: 'min(680px, calc(100vw - 32px))', fontFamily: 'Inter, sans-serif' }}
    >
      <div
        style={{
          background: 'rgba(15,15,26,0.97)',
          border: '1.5px solid rgba(99,102,241,0.3)',
          borderRadius: '16px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: backendOnline ? '#10b981' : '#ef4444', boxShadow: `0 0 6px ${backendOnline ? '#10b981' : '#ef4444'}` }} />
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>
            {backendOnline ? 'AAROH AI — Mock Provider Active (Phase 1)' : 'Backend Offline'}
          </span>
          <button
            onClick={toggleCommandPanel}
            style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '16px' }}
          >
            ✕
          </button>
        </div>

        {/* History */}
        {commands.length > 0 && (
          <div
            ref={historyRef}
            style={{ maxHeight: '220px', overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {commands.slice(0, 5).map((cmd) => (
              <div key={cmd.id}>
                <div style={{ color: '#6366f1', fontSize: '12px', marginBottom: 4 }}>
                  <span style={{ color: '#475569', marginRight: 6 }}>You:</span>
                  {cmd.command}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '8px 12px', lineHeight: 1.6 }}>
                  <span style={{ color: '#10b981', marginRight: 6 }}>AAROH:</span>
                  {cmd.response}
                  {cmd.is_simulated && (
                    <span style={{ color: '#d97706', fontSize: '10px', marginLeft: 8 }}>[SIMULATED]</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a command to AAROH AI…"
            disabled={isSending}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#e2e8f0',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            style={{
              background: input.trim() ? 'linear-gradient(135deg, #6366f1, #0ea5e9)' : 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 18px',
              color: input.trim() ? '#fff' : '#475569',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {isSending ? '…' : '⌾ Send'}
          </button>
        </div>

        <div style={{ padding: '0 16px 10px', color: '#475569', fontSize: '10px' }}>
          Press Enter to send · Esc to close · Phase 1: Responses are simulated
        </div>
      </div>
    </div>
  )
}

