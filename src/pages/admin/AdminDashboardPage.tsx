import PageHeader from '@components/PageHeader'
import { useEffect, useState } from 'react'
import { getAdminMetrics, type Metric } from '@services/adminMock'
import { useBlog } from '@contexts/BlogContext'
import { useNavigate } from 'react-router-dom'
import { Users, FileText, Flag, Bell, TrendingUp, Activity, Clock, AlertCircle } from 'lucide-react'

interface ActivityItem {
  title: string
  time: string
  type: 'user' | 'post' | 'report' | 'announcement'
  timestamp: number
}

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const { posts } = useBlog()
  const navigate = useNavigate()

  useEffect(() => {
    getAdminMetrics()
      .then((m) => setMetrics(m))
      .catch(() => setError('Failed to load metrics'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    // Generate real activity from localStorage data
    const activities: ActivityItem[] = []
    
    // Get users
    const usersRaw = localStorage.getItem('appUsers')
    if (usersRaw) {
      const users = JSON.parse(usersRaw)
      // Simulate recent user activities (could be enhanced with actual timestamp tracking)
      users.slice(0, 2).forEach((user: any, idx: number) => {
        activities.push({
          title: `New ${user.role} registered: ${user.name || user.username}`,
          time: idx === 0 ? '2h ago' : '5h ago',
          type: 'user',
          timestamp: Date.now() - (idx + 1) * 2 * 60 * 60 * 1000
        })
      })
    }

    // Get recent posts
    const recentPosts = [...posts]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3)
    
    recentPosts.forEach((post) => {
      const timeAgo = Math.floor((Date.now() - post.timestamp) / (1000 * 60 * 60))
      activities.push({
        title: `New post published: "${post.title}" by ${post.authorName}`,
        time: timeAgo < 1 ? 'Just now' : timeAgo < 24 ? `${timeAgo}h ago` : `${Math.floor(timeAgo / 24)}d ago`,
        type: 'post',
        timestamp: post.timestamp
      })
    })

    // Get reported posts
    const reportedPosts = posts.filter(p => p.reported)
    if (reportedPosts.length > 0) {
      reportedPosts.slice(0, 2).forEach((post, idx) => {
        activities.push({
          title: `Post reported: "${post.title}" - ${post.reportReason}`,
          time: idx === 0 ? '1h ago' : '3h ago',
          type: 'report',
          timestamp: Date.now() - (idx + 1) * 60 * 60 * 1000
        })
      })
    }

    // Get announcements
    const announcementsRaw = localStorage.getItem('admin_announcements_log')
    if (announcementsRaw) {
      const announcements = JSON.parse(announcementsRaw)
      announcements.slice(0, 2).forEach((announcement: any) => {
        const sentDate = new Date(announcement.sentAt)
        const timeAgo = Math.floor((Date.now() - sentDate.getTime()) / (1000 * 60 * 60))
        activities.push({
          title: `Announcement sent: "${announcement.title}" to ${announcement.audience}`,
          time: timeAgo < 1 ? 'Just now' : timeAgo < 24 ? `${timeAgo}h ago` : `${Math.floor(timeAgo / 24)}d ago`,
          type: 'announcement',
          timestamp: sentDate.getTime()
        })
      })
    }

    // Sort by timestamp and take top 6
    activities.sort((a, b) => b.timestamp - a.timestamp)
    setRecentActivity(activities.slice(0, 6))
  }, [posts])

  const quickActions = [
    { label: 'New Announcement', href: '/admin/notifications', icon: Bell, color: 'bg-blue-500' },
    { label: 'Review Reports', href: '/admin/moderation', icon: Flag, color: 'bg-orange-500' },
    { label: 'Manage Users', href: '/admin/user-management', icon: Users, color: 'bg-green-500' },
    { label: 'View Reports', href: '/admin/reports', icon: TrendingUp, color: 'bg-purple-500' },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="w-4 h-4 text-blue-600" />
      case 'post': return <FileText className="w-4 h-4 text-green-600" />
      case 'report': return <Flag className="w-4 h-4 text-orange-600" />
      case 'announcement': return <Bell className="w-4 h-4 text-purple-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getMetricIcon = (label: string) => {
    if (label.includes('Users')) return <Users className="w-5 h-5 text-blue-600" />
    if (label.includes('Posts')) return <FileText className="w-5 h-5 text-green-600" />
    if (label.includes('Reported')) return <AlertCircle className="w-5 h-5 text-orange-600" />
    if (label.includes('Announcements')) return <Bell className="w-5 h-5 text-purple-600" />
    return <Activity className="w-5 h-5 text-gray-600" />
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Real-time overview of system health, statistics, and quick actions"
        actions={
          <button 
            onClick={() => navigate('/admin/settings')} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Settings
          </button>
        }
      />

      {/* Metrics */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-3"></div>
            <span className="text-gray-600">Loading dashboard metrics...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  {getMetricIcon(m.label)}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">{m.label}</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{m.value}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {m.delta}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions & activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.href)}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 transition-colors group"
                >
                  <div className={`p-2 ${action.color} rounded-lg text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            ) : (
              recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="mt-1">
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 line-clamp-2">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Management sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">User Management</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Create, update, and manage user roles and permissions across the platform
          </p>
          <button 
            onClick={() => navigate('/admin/user-management')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Open User Management
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Flag className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Content Moderation</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Review and moderate reported posts, comments, and flagged content
          </p>
          <button 
            onClick={() => navigate('/admin/moderation')}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            Open Moderation Queue
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Announcements</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Compose and broadcast system-wide announcements to all users
          </p>
          <button 
            onClick={() => navigate('/admin/notifications')}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Manage Notifications
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Analytics & Reports</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            View detailed analytics, metrics, and export comprehensive reports
          </p>
          <button 
            onClick={() => navigate('/admin/reports')}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            View Reports
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Blog Posts</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {posts.length} total posts published across the platform
          </p>
          <button 
            onClick={() => navigate('/blog')}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            View All Posts
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">System Settings</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Configure system-wide settings, policies, and preferences
          </p>
          <button 
            onClick={() => navigate('/admin/settings')}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Open Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
