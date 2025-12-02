import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useBlog } from '@contexts/BlogContext'
import { useAuth } from '@contexts/AuthContext'
import { FileText, Plus, Flag, X } from 'lucide-react'
import UserProfileModal from '@components/UserProfileModal'
import PageHeader from '@components/PageHeader'
import '../styles/BlogListPage.css'
import '../styles/PageHeader.css'

const BlogListPage = () => {
  const navigate = useNavigate()
  const { posts, likePost, sharePost, deletePost, reportPost, unreportPost } = useBlog()
  const { user, hasRole } = useAuth()
  const isAdmin = hasRole(['admin'])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportingPostId, setReportingPostId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState('')

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    likePost(postId)
  }

  const handleShare = (postId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    sharePost(postId)
    const postUrl = `${window.location.origin}/blog/${postId}`
    navigator.clipboard.writeText(postUrl).then(() => {
      alert('Post link copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy link')
    })
  }

  const handleDelete = (postId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId)
    }
  }

  const canDeletePost = (post: any) => {
    return isAdmin || post.author === user?.username
  }

  const handleOpenReportModal = (postId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setReportingPostId(postId)
    setShowReportModal(true)
  }

  const handleReportPost = () => {
    if (reportingPostId && reportReason.trim()) {
      reportPost(reportingPostId, reportReason)
      setShowReportModal(false)
      setReportingPostId(null)
      setReportReason('')
      alert('Post has been reported for review')
    }
  }

  const handleUnreportPost = (postId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('Are you sure you want to remove the report from this post?')) {
      unreportPost(postId)
      alert('Post report has been removed')
    }
  }

  return (
    <div className="blog-list-container">
      <PageHeader
        title="Blog Posts"
        subtitle="Share your thoughts and ideas with the community"
        icon={FileText}
        actions={
          <button onClick={() => navigate('/blog/create')} className="btn-create-post">
            <Plus size={20} />
            Create New Post
          </button>
        }
      />

      {posts.length === 0 ? (
        <div className="empty-state">
          <p className="text-gray-500">No posts yet. Be the first to create one!</p>
          <button onClick={() => navigate('/blog/create')} className="btn-create-first">
            Create First Post
          </button>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => {
            const isLiked = user ? post.likes.includes(user.username) : false
            const truncatedContent =
              post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content

            return (
              <Link to={`/blog/${post.id}`} key={post.id} className="post-card">
                {post.images.length > 0 && (
                  <div className="post-card-image">
                    <img src={post.images[0]} alt={post.title} />
                  </div>
                )}

                <div className="post-card-content">
                  <h2 className="post-card-title">{post.title}</h2>

                  <div className="post-card-meta">
                    <span 
                      className="post-author clickable" 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedUser(post.author)
                      }}
                    >
                      {post.authorName}
                    </span>
                    <span className="post-date">{formatDate(post.timestamp)}</span>
                  </div>

                  <p className="post-card-excerpt">{truncatedContent}</p>

                  {post.taggedUsers.length > 0 && (
                    <div className="post-tags">
                      {post.taggedUsers.map((username) => (
                        <span key={username} className="post-tag">
                          @{username}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="post-card-actions">
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      className={`action-btn ${isLiked ? 'liked' : ''}`}
                    >
                      ❤️ {post.likes.length}
                    </button>
                    <button className="action-btn">💬 {post.comments.length}</button>
                    <button onClick={(e) => handleShare(post.id, e)} className="action-btn">
                      🔗 {post.shares}
                    </button>
                    {post.reported && (
                      <span className="reported-badge-small" title={`Reported: ${post.reportReason}`}>
                        🚩
                      </span>
                    )}
                    {!post.reported && user && post.author !== user.username && (
                      <button onClick={(e) => handleOpenReportModal(post.id, e)} className="action-btn report-btn-small">
                        <Flag size={14} />
                      </button>
                    )}
                    {post.reported && isAdmin && (
                      <button onClick={(e) => handleUnreportPost(post.id, e)} className="action-btn unreport-btn-small">
                        Remove Report
                      </button>
                    )}
                    {canDeletePost(post) && (
                      <button onClick={(e) => handleDelete(post.id, e)} className="action-btn delete-btn">
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {selectedUser && (
        <UserProfileModal username={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report Post</h3>
              <button onClick={() => setShowReportModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">Please select a reason for reporting this post:</p>
              <div className="report-reasons">
                <label className="report-reason-option">
                  <input
                    type="radio"
                    name="reportReason"
                    value="Spam or misleading content"
                    checked={reportReason === 'Spam or misleading content'}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>Spam or misleading content</span>
                </label>
                <label className="report-reason-option">
                  <input
                    type="radio"
                    name="reportReason"
                    value="Harassment or hate speech"
                    checked={reportReason === 'Harassment or hate speech'}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>Harassment or hate speech</span>
                </label>
                <label className="report-reason-option">
                  <input
                    type="radio"
                    name="reportReason"
                    value="Inappropriate content"
                    checked={reportReason === 'Inappropriate content'}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>Inappropriate content</span>
                </label>
                <label className="report-reason-option">
                  <input
                    type="radio"
                    name="reportReason"
                    value="False information"
                    checked={reportReason === 'False information'}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>False information</span>
                </label>
                <label className="report-reason-option">
                  <input
                    type="radio"
                    name="reportReason"
                    value="Other violation"
                    checked={reportReason === 'Other violation'}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>Other violation</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowReportModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleReportPost} className="btn-submit-report" disabled={!reportReason}>
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogListPage
