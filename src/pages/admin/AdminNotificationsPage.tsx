import PageHeader from '@components/PageHeader'
import { useEffect, useState, useMemo } from 'react'
import { loadAnnouncements, sendAnnouncement, type Announcement } from '@services/adminMock'
import { useNotification } from '@contexts/NotificationContext'
import { useUserManagement } from '@contexts/UserManagementContext'
import { Bell, Send, Users, Shield, Briefcase, CheckCircle, Clock } from 'lucide-react'

const AdminNotificationsPage = () => {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('All Users')
  const [log, setLog] = useState<Announcement[]>([])
  const { addNotification } = useNotification()
  const { users } = useUserManagement()

  useEffect(() => {
    setLog(loadAnnouncements())
  }, [])

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return
    const next = sendAnnouncement(title.trim(), audience, message.trim(), addNotification)
    setLog(next)
    setTitle('')
    setMessage('')
    alert('Announcement sent successfully to ' + audience)
  }

  // Calculate audience statistics
  const audienceStats = useMemo(() => {
    const allUsers = users.length
    const admins = users.filter(u => u.role === 'admin').length
    const recruiters = users.filter(u => u.role === 'recruiter').length
    const regularUsers = users.filter(u => u.role === 'user').length

    return {
      'All Users': allUsers,
      'Admins Only': admins,
      'Recruiters': recruiters,
      'Regular Users': regularUsers
    }
  }, [users])

  // Calculate delivery statistics
  const stats = useMemo(() => {
    const total = log.length
    const delivered = log.filter(a => a.status === 'Delivered').length
    const queued = log.filter(a => a.status === 'Queued').length
    const totalRecipients = log.reduce((sum, a) => sum + (audienceStats[a.audience as keyof typeof audienceStats] || 0), 0)

    return { total, delivered, queued, totalRecipients }
  }, [log, audienceStats])

  // Get selected audience count
  const selectedAudienceCount = audienceStats[audience as keyof typeof audienceStats] || 0

  return (
    <div className="p-6">
      <PageHeader title="Admin Notifications" subtitle="Broadcast announcements and manage notification policies" />
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Delivered</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.delivered}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Queued</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.queued}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Recipients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRecipients}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Announcement Composer</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} />
            <span>Will reach {selectedAudienceCount} user{selectedAudienceCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg bg-white text-gray-900 font-inherit transition-all duration-300 ease-in-out placeholder:text-gray-400 hover:border-gray-300 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10" 
              placeholder="Enter announcement title" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg bg-white text-gray-900 font-inherit transition-all duration-300 ease-in-out placeholder:text-gray-400 hover:border-gray-300 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 resize-vertical" 
              rows={4} 
              placeholder="Enter announcement message" 
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
              <div className="relative">
                <select 
                  value={audience} 
                  onChange={(e) => setAudience(e.target.value)} 
                  className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg bg-white text-gray-900 font-inherit transition-all duration-300 ease-in-out hover:border-gray-300 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                >
                  <option>All Users</option>
                  <option>Admins Only</option>
                  <option>Recruiters</option>
                </select>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {audience === 'All Users' && `All ${audienceStats['All Users']} users will receive this notification`}
                {audience === 'Admins Only' && `${audienceStats['Admins Only']} admin${audienceStats['Admins Only'] !== 1 ? 's' : ''} will receive this notification`}
                {audience === 'Recruiters' && `${audienceStats['Recruiters']} recruiter${audienceStats['Recruiters'] !== 1 ? 's' : ''} will receive this notification`}
              </p>
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleSend} 
                className="px-6 py-3 bg-gray-900 text-white rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                disabled={!title.trim() || !message.trim()}
              >
                <Send size={18} />
                Send Announcement
              </button>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Announcement History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b-2 border-gray-200 bg-gray-50">
                <th className="py-3 px-4 font-semibold text-gray-700">Title</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Message</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Audience</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Recipients</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Sent</th>
              </tr>
            </thead>
            <tbody>
              {log.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Bell size={48} className="text-gray-300" />
                      <p className="text-lg font-medium">No announcements sent yet</p>
                      <p className="text-sm">Create your first announcement above to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                log.slice().reverse().map((a) => {
                  const recipientCount = audienceStats[a.audience as keyof typeof audienceStats] || 0
                  return (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-gray-900 font-medium">{a.title}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-700 max-w-xs truncate" title={a.message}>
                          {a.message}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          {a.audience === 'All Users' && <Users size={14} />}
                          {a.audience === 'Admins Only' && <Shield size={14} />}
                          {a.audience === 'Recruiters' && <Briefcase size={14} />}
                          <span>{a.audience}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-700 font-medium">{recipientCount}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          a.status === 'Delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {a.status === 'Delivered' ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs whitespace-nowrap">
                        {new Date(a.sentAt).toLocaleString()}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminNotificationsPage
