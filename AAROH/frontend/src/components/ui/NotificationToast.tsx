import { useStore } from '../../store/useStore'

export function NotificationToast() {
  const { notifications, dismissNotification } = useStore()
  if (!notifications.length) return null

  return (
    <div className="toast-stack" aria-live="polite">
      {notifications.slice(0, 4).map((notification) => (
        <article className={`toast-card toast-card--${notification.type}`} key={notification.id}>
          <span className="toast-card__rail" />
          <div className="toast-card__copy"><strong>{notification.title}</strong><p>{notification.message}</p></div>
          <button onClick={() => dismissNotification(notification.id)} aria-label="Dismiss notification">×</button>
        </article>
      ))}
    </div>
  )
}
