import PageHeader from '@components/PageHeader'
import { useEffect, useState, useMemo } from 'react'
import { loadModerationQueue, type ModerationItem } from '@services/adminMock'
import { useBlog } from '@contexts/BlogContext'
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'

const AdminModerationPage = () => {
  const [items, setItems] = useState<ModerationItem[]>([])
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all')
  const { posts, unreportPost, deletePost } = useBlog()

  useEffect(() => {
    // Load existing moderation queue
    const queue = loadModerationQueue()
    
    // Add reported blog posts to the moderation queue
    const reportedPosts = posts
      .filter(post => post.reported)
      .map(post => ({
        id: `post-${post.id}`,
        item: `Post: ${post.title}`,
        reason: post.reportReason || 'Reported by user',
        status: 'Pending' as const
      }))
    
    // Merge and deduplicate
    const existingIds = new Set(queue.map(item => item.id))
    const newItems = reportedPosts.filter(item => !existingIds.has(item.id))
    
    setItems([...queue, ...newItems])
  }, [posts])

  const approveSelected = () => {
    const toUpdate = Object.keys(selected).filter((id) => selected[id])
    
    toUpdate.forEach((id) => {
      // If it's a blog post, delete it (approve = report is valid)
      if (id.startsWith('post-')) {
        const postId = id.replace('post-', '')
        deletePost(postId)
      }
    })
    
    // Remove approved items from the queue
    const next = items.filter(item => !toUpdate.includes(item.id))
    setItems(next)
    setSelected({})
  }

  const rejectSelected = () => {
    const toUpdate = Object.keys(selected).filter((id) => selected[id])
    
    toUpdate.forEach((id) => {
      // If it's a blog post, remove reported tag (reject = report is invalid)
      if (id.startsWith('post-')) {
        const postId = id.replace('post-', '')
        unreportPost(postId)
      }
    })
    
    // Remove rejected items from the queue
    const next = items.filter(item => !toUpdate.includes(item.id))
    setItems(next)
    setSelected({})
  }

  const toggle = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }))
  }

  const hasSelected = Object.values(selected).some(v => v)

  // Filter items by status
  const filteredItems = useMemo(() => {
    if (statusFilter === 'all') return items
    return items.filter(item => item.status === statusFilter)
  }, [items, statusFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = items.length
    const pending = items.filter(i => i.status === 'Pending').length
    const approved = items.filter(i => i.status === 'Approved').length
    const rejected = items.filter(i => i.status === 'Rejected').length
    
    return { total, pending, approved, rejected }
  }, [items])

  return (
    <div className="p-6">
      <PageHeader title="Content Moderation" subtitle="Review and act on reported content and users" />
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Approved</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Rejected</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
          <div className="flex gap-3">
            <button 
              onClick={approveSelected} 
              disabled={!hasSelected}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Approve Selected
            </button>
            <button 
              onClick={rejectSelected} 
              disabled={!hasSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <XCircle size={16} />
              Reject Selected
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                statusFilter === 'Pending'
                  ? 'bg-yellow-100 text-yellow-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter('Approved')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                statusFilter === 'Approved'
                  ? 'bg-green-100 text-green-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setStatusFilter('Rejected')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                statusFilter === 'Rejected'
                  ? 'bg-red-100 text-red-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b-2 border-gray-200 bg-gray-50">
                <th className="py-3 px-4 font-semibold text-gray-700">Select</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Item</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Reason</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center gap-3">
                        <CheckCircle size={48} className="text-gray-300" />
                        <p className="text-lg font-medium">No items in moderation queue</p>
                        <p className="text-sm">All reports have been reviewed</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <AlertTriangle size={48} className="text-gray-300" />
                        <p className="text-lg font-medium">No items match the selected filter</p>
                        <button
                          onClick={() => setStatusFilter('all')}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
                        >
                          Show All Items
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredItems.map((it) => (
                  <tr key={it.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        checked={!!selected[it.id]} 
                        onChange={() => toggle(it.id)}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black focus:ring-2 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900 font-medium">{it.item}</div>
                      {it.id.startsWith('post-') && (
                        <div className="text-xs text-gray-500 mt-1">
                          Post ID: {it.id.replace('post-', '')}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-700">{it.reason}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                        it.status === 'Approved' 
                          ? 'bg-green-100 text-green-800' 
                          : it.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {it.status === 'Approved' && <CheckCircle size={12} />}
                        {it.status === 'Rejected' && <XCircle size={12} />}
                        {it.status === 'Pending' && <Clock size={12} />}
                        {it.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            if (it.id.startsWith('post-')) {
                              const postId = it.id.replace('post-', '')
                              deletePost(postId)
                            }
                            setItems(items.filter(item => item.id !== it.id))
                          }} 
                          disabled={it.status === 'Approved'}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium transition-all duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => {
                            if (it.id.startsWith('post-')) {
                              const postId = it.id.replace('post-', '')
                              unreportPost(postId)
                            }
                            setItems(items.filter(item => item.id !== it.id))
                          }} 
                          disabled={it.status === 'Rejected'}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs font-medium transition-all duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminModerationPage
