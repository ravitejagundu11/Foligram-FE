import PageHeader from '@components/PageHeader'
import { useEffect, useState, useMemo } from 'react'
import { loadAdminSettings, saveAdminSettings, type AdminSettings } from '@services/adminMock'
import { useUserManagement } from '@contexts/UserManagementContext'
import { useBlog } from '@contexts/BlogContext'
import { Settings, Users, FileText, Bell, Shield, CheckCircle, Database } from 'lucide-react'

// Add animation for save confirmation
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [saved, setSaved] = useState(false)
  const { users } = useUserManagement()
  const { posts } = useBlog()

  useEffect(() => {
    setSettings(loadAdminSettings())
  }, [])

  const handleSave = () => {
    if (!settings) return
    saveAdminSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  // Calculate application statistics
  const stats = useMemo(() => {
    const totalUsers = users.length
    const totalPosts = posts.length
    const reportedPosts = posts.filter(p => p.reported).length
    const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)
    
    return {
      users: totalUsers,
      posts: totalPosts,
      reported: reportedPosts,
      comments: totalComments
    }
  }, [users, posts])

  return (
    <div className="p-6">
      <style>{styles}</style>
      <PageHeader title="Admin Settings" subtitle="Configure global application settings and roles" />
      
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.users}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Blog Posts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.posts}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Reported Posts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.reported}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Comments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.comments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bell size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-0 overflow-hidden">
        <div className="border-b px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <Settings size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Application Settings</h3>
              <p className="text-sm text-gray-600">Configure user registration, roles, and system preferences</p>
            </div>
          </div>
        </div>
        {!settings ? (
          <div className="p-6 text-center">
            <div className="animate-pulse">
              <Database size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Loading settings…</p>
            </div>
          </div>
        ) : (
          <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Registration Settings */}
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  User Registration
                </h4>
                <p className="text-xs text-gray-500 mt-1">Control how new users join the platform</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1 text-gray-800">Allow Public Signups</label>
                    <p className="text-xs text-gray-600">Enable users to create accounts without invitations or admin approval.</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Current status: <span className="font-medium">{settings.allowPublicSignups ? 'Open Registration' : 'Restricted'}</span>
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="ml-4 mt-1 h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 cursor-pointer"
                    checked={settings.allowPublicSignups}
                    onChange={(e) => setSettings({ ...settings, allowPublicSignups: e.target.checked })}
                  />
                </div>
              </div>
            </div>

            {/* Default Role Settings */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={18} className="text-green-600" />
                <label className="block text-sm font-semibold text-gray-800">Default User Role</label>
              </div>
              <p className="text-xs text-gray-600 mb-3">Role automatically assigned to newly registered users.</p>
              <select
                className="w-full px-4 py-3 text-sm border-2 border-green-300 rounded-lg bg-white text-gray-900 font-medium transition-all duration-300 ease-in-out hover:border-green-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                value={settings.defaultUserRole}
                onChange={(e) => setSettings({ ...settings, defaultUserRole: e.target.value as AdminSettings['defaultUserRole'] })}
              >
                <option value="user">User (Standard Access)</option>
                <option value="recruiter">Recruiter (Enhanced Access)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                New users will join as: <span className="font-medium capitalize">{settings.defaultUserRole}</span>
              </p>
            </div>

            {/* Announcements Settings */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Bell size={18} className="text-purple-600" />
                <label className="block text-sm font-semibold text-gray-800">Announcements Visibility</label>
              </div>
              <p className="text-xs text-gray-600 mb-3">Choose who can see admin announcements by default.</p>
              <select
                className="w-full px-4 py-3 text-sm border-2 border-purple-300 rounded-lg bg-white text-gray-900 font-medium transition-all duration-300 ease-in-out hover:border-purple-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                value={settings.announcementsVisibility}
                onChange={(e) => setSettings({ ...settings, announcementsVisibility: e.target.value as AdminSettings['announcementsVisibility'] })}
              >
                <option>All users</option>
                <option>Only admins</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Current visibility: <span className="font-medium">{settings.announcementsVisibility}</span>
              </p>
            </div>

            {/* Save Button */}
            <div className="col-span-1 md:col-span-2 flex items-center justify-between pt-4 border-t">
              <div className="text-xs text-gray-500">
                Last saved: {new Date().toLocaleString()}
              </div>
              <div className="flex items-center gap-3">
                {saved && (
                  <div className="flex items-center gap-2 text-green-600 animate-fadeIn">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Settings saved successfully!</span>
                  </div>
                )}
                <button 
                  type="button" 
                  onClick={handleSave} 
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-900/20 flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default AdminSettingsPage
