import { useStore } from '../../store/useStore'

export function TopBar() {
  const { backendOnline, agents, toggleCommandPanel, loadAll, isLoading } = useStore()
  const active = agents.filter((agent) => agent.status === 'working').length
  const thinking = agents.filter((agent) => agent.status === 'meeting').length

  return (
    <header className="topbar">
      <div className="brand-lockup">
        <div className="brand-mark">A<span /></div>
        <div>
          <div className="brand-name">AAROH <span>AI</span></div>
          <div className="brand-subtitle">Virtual agent office</div>
        </div>
      </div>

      <div className="topbar__divider" />
      <div className="office-live-tag"><span className="live-pulse" />Live office</div>

      <div className="topbar__spacer" />

      <div className="topbar-stats" aria-label="Agent activity summary">
        <div className="topbar-stat"><strong>{agents.length.toString().padStart(2, '0')}</strong><span>agents</span></div>
        <div className="topbar-stat topbar-stat--working"><strong>{active.toString().padStart(2, '0')}</strong><span>working</span></div>
        <div className="topbar-stat topbar-stat--thinking"><strong>{thinking.toString().padStart(2, '0')}</strong><span>thinking</span></div>
      </div>

      <div className={`api-state${backendOnline ? ' api-state--online' : ''}`}>
        <span className="api-state__dot" />
        {backendOnline ? 'API connected' : 'API offline'}
      </div>

      <button className="icon-button refresh-button" onClick={() => void loadAll()} disabled={isLoading} aria-label="Refresh office data" title="Refresh office data">
        <span className={isLoading ? 'refresh-spin' : ''}>↻</span>
      </button>
      <button className="command-launch" onClick={toggleCommandPanel}>
        <span className="command-launch__plus">+</span>
        <span>New command</span>
        <kbd>⌘ K</kbd>
      </button>
    </header>
  )
}
