import { useEffect, useRef } from 'react'
import { Card, CardContent } from './ui/card'
import { useNotification } from '@contexts/NotificationContext'
import { useNavigate } from 'react-router-dom'

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markAsRead } = useNotification()
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    
    // Navigate to relevant page based on notification type
    if (notification.type === 'appointment') {
      navigate('/appointment-management')
      onClose()
    } else if (notification.postId) {
      navigate(`/blog/${notification.postId}`)
      onClose()
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️'
      case 'comment':
        return '💬'
      case 'reply':
        return '↩️'
      case 'share':
        return '🔄'
      case 'subscription':
        return '🔔'
      case 'mention':
        return '📢'
      case 'appointment':
        return '📅'
      default:
        return '📬'
    }
  }

  // Show only latest 10 notifications in dropdown
  const recentNotifications = notifications.slice(0, 10)

  return (
    <Card
      ref={panelRef}
      className="absolute right-0 mt-3 w-96 shadow-xl rounded-xl border bg-white z-50 animate-fade-in"
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            onClick={() => {
              navigate('/notifications')
              onClose()
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </button>
        </div>

        {recentNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-2">🔔</div>
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-auto">
            {recentNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`flex items-start gap-3 p-3 cursor-pointer transition hover:bg-gray-50 border-b last:border-b-0 ${!n.read ? 'bg-blue-50' : ''}`}
              >
                <div className="text-2xl flex-shrink-0">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? 'font-semibold' : ''}`}>
                    <span className="font-semibold">{n.actorName}</span> {n.message}
                    {n.postTitle && (
                      <span className="text-gray-600"> "{n.postTitle.substring(0, 30)}{n.postTitle.length > 30 ? '...' : ''}"</span>
                    )}
                  </p>
                  <span className="text-xs text-gray-500">{formatTime(n.timestamp)}</span>
                </div>

                {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
