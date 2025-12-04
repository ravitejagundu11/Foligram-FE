import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { LayoutDashboard, Briefcase, Eye, Heart, FileText, TrendingUp, Activity, ArrowUpRight, BarChart3 } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'
import { useBlog } from '@contexts/BlogContext'
import { Portfolio } from '../types/portfolio'
import PageHeader from '@components/PageHeader'
import { motion } from 'framer-motion'
import '../styles/PageHeader.css'
import '../styles/DashboardPage.css'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const blogContext = useBlog()
  const posts = blogContext?.posts || []
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = () => {
      try {
        // Load portfolios from localStorage
        const portfoliosObj = localStorage.getItem('portfolios')
        if (portfoliosObj) {
          const parsedPortfolios = JSON.parse(portfoliosObj)
          const portfoliosList = Object.values(parsedPortfolios) as Portfolio[]
          
          // Filter to current user's portfolios
          if (user) {
            const userPortfolios = portfoliosList.filter(p => {
              const portfolioUserId = (p.userId || '').toLowerCase().trim()
              const username = (user?.username || '').toLowerCase().trim()
              const email = (user?.email || '').toLowerCase().trim()
              return portfolioUserId === username || portfolioUserId === email
            })
            
            setPortfolios(userPortfolios)
          } else {
            setPortfolios([])
          }
        } else {
          setPortfolios([])
        }
      } catch (err) {
        console.error('Error loading user data:', err)
        setPortfolios([])
      } finally {
        setLoading(false)
      }
    }

    // Add a small delay to ensure contexts are initialized
    const timer = setTimeout(() => {
      loadUserData()
    }, 100)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Calculate real statistics
  const stats = useMemo(() => {
    const allPosts = posts || []
    const userPosts = allPosts.filter(p => p.author === user?.email || p.author === user?.username)
    const totalViews = portfolios.reduce((sum, p) => sum + (p.views || 0), 0)
    const totalLikes = portfolios.reduce((sum, p) => sum + (p.likes || 0), 0)
    const totalBlogLikes = userPosts.reduce((sum, p) => sum + (Array.isArray(p.likes) ? p.likes.length : 0), 0)
    const publishedPortfolios = portfolios.filter(p => p.isPublished).length
    const publishedPosts = userPosts.filter(p => p.published).length

    return {
      portfolios: portfolios.length,
      publishedPortfolios,
      totalViews,
      totalLikes: totalLikes + totalBlogLikes,
      blogPosts: userPosts.length,
      publishedPosts
    }
  }, [portfolios, posts, user])

  // Helper function to calculate time ago
  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffDays > 0) return `${diffDays}d ago`
      if (diffHours > 0) return `${diffHours}h ago`
      if (diffMins > 0) return `${diffMins}m ago`
      return 'Just now'
    } catch (err) {
      return 'Recently'
    }
  }

  // Generate recent activity from real data
  const recentActivity = useMemo(() => {
    const activities: Array<{ type: string; title: string; time: string; icon: any }> = []

    // Add portfolio activities
    portfolios.slice(0, 3).forEach(portfolio => {
      if (portfolio.publishedAt) {
        const timeAgo = getTimeAgo(portfolio.publishedAt)
        activities.push({
          type: 'portfolio',
          title: `Published portfolio: ${portfolio.name}`,
          time: timeAgo,
          icon: Briefcase
        })
      }
    })

    // Add blog post activities
    const allPosts = posts || []
    const userPosts = allPosts.filter(p => p.author === user?.email || p.author === user?.username)
    userPosts.slice(0, 2).forEach(post => {
      if (post.timestamp) {
        const timeAgo = getTimeAgo(new Date(post.timestamp).toISOString())
        activities.push({
          type: 'blog',
          title: `Published blog: ${post.title}`,
          time: timeAgo,
          icon: FileText
        })
      }
    })

    // Sort by most recent
    return activities.slice(0, 5)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolios, posts, user])

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <PageHeader
        title={`Welcome back, ${user?.firstName || 'User'}!`}
        subtitle="Here's an overview of your portfolio and content performance."
        icon={LayoutDashboard}
      />
      
      <div className="dashboard-content">
        {/* Main Statistics Cards */}
        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#dbeafe' }}>
              <Briefcase size={24} style={{ color: '#1e40af' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.portfolios}</div>
              <div className="stat-label">Total Portfolios</div>
              <div className="stat-detail">{stats.publishedPortfolios} published</div>
            </div>
            <div className="stat-badge">
              <ArrowUpRight size={14} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#d1fae5' }}>
              <Eye size={24} style={{ color: '#065f46' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalViews.toLocaleString()}</div>
              <div className="stat-label">Total Views</div>
              <div className="stat-detail">Portfolio impressions</div>
            </div>
            <div className="stat-badge">
              <TrendingUp size={14} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fecaca' }}>
              <Heart size={24} style={{ color: '#991b1b' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalLikes.toLocaleString()}</div>
              <div className="stat-label">Total Likes</div>
              <div className="stat-detail">Engagement count</div>
            </div>
            <div className="stat-badge">
              <Heart size={14} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef3c7' }}>
              <FileText size={24} style={{ color: '#92400e' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.blogPosts}</div>
              <div className="stat-label">Blog Posts</div>
              <div className="stat-detail">{stats.publishedPosts} published</div>
            </div>
            <div className="stat-badge">
              <ArrowUpRight size={14} />
            </div>
          </div>
        </motion.div>

        <div className="dashboard-grid">
          {/* Recent Activity */}
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="card-header">
              <Activity size={20} />
              <h2 className="card-title">Recent Activity</h2>
            </div>
            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <Icon size={16} />
                      </div>
                      <div className="activity-content">
                        <p className="activity-title">{activity.title}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="empty-state">
                  <Activity size={32} />
                  <p>No recent activity</p>
                  <span>Start creating content to see your activity here</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="card-header">
              <TrendingUp size={20} />
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <button
                onClick={() => navigate('/templates')}
                className="action-button primary"
              >
                <Briefcase size={18} />
                <div className="action-text">
                  <span className="action-title">Create Portfolio</span>
                  <span className="action-subtitle">Choose from templates</span>
                </div>
              </button>
              <button
                onClick={() => navigate('/my-portfolios')}
                className="action-button"
              >
                <Eye size={18} />
                <div className="action-text">
                  <span className="action-title">My Portfolios</span>
                  <span className="action-subtitle">Manage your work</span>
                </div>
              </button>
              <button
                onClick={() => navigate('/blog/create')}
                className="action-button"
              >
                <FileText size={18} />
                <div className="action-text">
                  <span className="action-title">Write Blog Post</span>
                  <span className="action-subtitle">Share your thoughts</span>
                </div>
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="action-button"
              >
                <BarChart3 size={18} />
                <div className="action-text">
                  <span className="action-title">View Analytics</span>
                  <span className="action-subtitle">Track performance</span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Portfolio Overview */}
        {portfolios.length > 0 && (
          <motion.div
            className="portfolio-overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="overview-header">
              <h2 className="overview-title">Your Portfolios</h2>
              <button
                onClick={() => navigate('/my-portfolios')}
                className="view-all-btn"
              >
                View All
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="portfolio-grid">
              {portfolios.slice(0, 3).map((portfolio) => (
                <div key={portfolio.id} className="portfolio-card" onClick={() => navigate('/my-portfolios')}>
                  <div className="portfolio-header">
                    <h3 className="portfolio-name">{portfolio.name}</h3>
                    <div className={`portfolio-status ${portfolio.isPublished ? 'published' : 'draft'}`}>
                      {portfolio.isPublished ? 'Published' : 'Draft'}
                    </div>
                  </div>
                  <p className="portfolio-description">{portfolio.headline || 'No description'}</p>
                  <div className="portfolio-stats">
                    <div className="portfolio-stat">
                      <Eye size={16} />
                      <span>{portfolio.views || 0}</span>
                    </div>
                    <div className="portfolio-stat">
                      <Heart size={16} />
                      <span>{portfolio.likes || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
