import { useState } from 'react'
import { Bell, CheckCircle, Circle, Trash2, CheckCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useNotification } from '@contexts/NotificationContext'
import { useNavigate } from 'react-router-dom'

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotification()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
      case 'report':
        return '🚩'
      default:
        return '📬'
    }
  }

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    
    // Navigate to relevant page
    if (notification.type === 'appointment') {
      navigate('/appointment-management')
    } else if (notification.type === 'report') {
      // Check if user is admin to navigate to moderation page
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.role === 'admin') {
          navigate('/admin/moderation')
        } else if (notification.postId) {
          navigate(`/blog/${notification.postId}`)
        }
      }
    } else if (notification.postId) {
      navigate(`/blog/${notification.postId}`)
    }
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="w-8 h-8" /> Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`pb-3 px-1 font-medium transition border-b-2 ${
            filter === 'all' 
              ? 'text-blue-600 border-blue-600' 
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`pb-3 px-1 font-medium transition border-b-2 ${
            filter === 'unread' 
              ? 'text-blue-600 border-blue-600' 
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* EMPTY STATE */}
      {filteredNotifications.length === 0 && (
        <Card className="p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🔔</div>
          <h2 className="text-xl font-semibold mb-2">
            {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications Yet'}
          </h2>
          <p className="text-gray-500">
            {filter === 'unread' 
              ? 'You\'re all caught up! Check back later for new updates.' 
              : 'You will see updates and alerts here when you interact with posts and users.'}
          </p>
        </Card>
      )}

      {/* NOTIFICATION LIST */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <Card
            key={n.id}
            className={`cursor-pointer transition-all shadow-sm hover:shadow-md ${
              !n.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-3xl flex-shrink-0">
                  {getNotificationIcon(n.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0" onClick={() => handleNotificationClick(n)}>
                  <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    <span className="font-bold">{n.actorName}</span> {n.message}
                    {n.postTitle && (
                      <span className="text-gray-600 italic"> "{n.postTitle}"</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(n.timestamp)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!n.read ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(n.id)
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                        title="Mark as read"
                      >
                        <Circle className="w-4 h-4 text-blue-500" fill="currentColor" />
                      </button>
                    </>
                  ) : (
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(n.id)
                    }}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-full transition"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
