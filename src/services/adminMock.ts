// Mock admin services with localStorage persistence where applicable

export type Metric = { label: string; value: string; delta: string }
export type ReportRow = { metric: string; value: string; period: string }
export type ModerationItem = { id: string; item: string; reason: string; status: 'Pending' | 'Approved' | 'Rejected' }
export type Announcement = { id: string; title: string; audience: string; message: string; status: 'Delivered' | 'Queued'; sentAt: string }
export type AdminSettings = { allowPublicSignups: boolean; defaultUserRole: 'user' | 'recruiter'; announcementsVisibility: 'All users' | 'Only admins' }

const LS_KEYS = {
  moderation: 'admin_moderation_queue',
  announcements: 'admin_announcements_log',
  settings: 'admin_settings',
}

// Utilities
const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms))
const uid = () => Math.random().toString(36).slice(2)

// Metrics
export async function getAdminMetrics(): Promise<Metric[]> {
  await delay()
  
  // Get real data from localStorage
  const usersRaw = localStorage.getItem('appUsers')
  const postsRaw = localStorage.getItem('blog_posts')
  const announcementsRaw = localStorage.getItem(LS_KEYS.announcements)
  
  const users = usersRaw ? JSON.parse(usersRaw) : []
  const posts = postsRaw ? JSON.parse(postsRaw) : []
  const announcements = announcementsRaw ? JSON.parse(announcementsRaw) : []
  
  // Count reported/flagged items
  const reportedCount = posts.filter((p: any) => p.reported).length
  
  // Count users by role
  const activeUsers = users.filter((u: any) => u.role === 'user' || u.role === 'recruiter').length
  
  return [
    { label: 'Total Users', value: users.length.toString(), delta: `${activeUsers} active` },
    { label: 'Total Posts', value: posts.length.toString(), delta: `${posts.length} published` },
    { label: 'Reported Items', value: reportedCount.toString(), delta: `${reportedCount} pending review` },
    { label: 'Announcements Sent', value: announcements.length.toString(), delta: `${announcements.length} delivered` },
  ]
}

// Reports
export async function getAdminReportData(): Promise<ReportRow[]> {
  await delay()
  
  // Get real data from localStorage
  const usersRaw = localStorage.getItem('appUsers')
  const postsRaw = localStorage.getItem('blog_posts')
  const notificationsRaw = localStorage.getItem('notifications')
  const announcementsRaw = localStorage.getItem(LS_KEYS.announcements)
  
  const users = usersRaw ? JSON.parse(usersRaw) : []
  const posts = postsRaw ? JSON.parse(postsRaw) : []
  const notifications = notificationsRaw ? JSON.parse(notificationsRaw) : []
  const announcements = announcementsRaw ? JSON.parse(announcementsRaw) : []
  
  // Calculate date ranges
  const now = Date.now()
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)
  
  // Count posts in last 30 days
  const recentPosts = posts.filter((p: any) => p.timestamp > thirtyDaysAgo)
  
  // Count reported posts
  const reportedPosts = posts.filter((p: any) => p.reported)
  
  // Count announcements
  const totalAnnouncements = announcements.length
  
  // Calculate total comments and replies
  let totalComments = 0
  let totalLikes = 0
  posts.forEach((p: any) => {
    totalComments += (p.comments || []).length
    totalLikes += (p.likes || []).length
    p.comments?.forEach((c: any) => {
      totalComments += (c.replies || []).length
    })
  })
  
  return [
    { metric: 'Total Users', value: users.length.toString(), period: 'All time' },
    { metric: 'Total Blog Posts', value: posts.length.toString(), period: 'All time' },
    { metric: 'Posts Created', value: recentPosts.length.toString(), period: 'Last 30 days' },
    { metric: 'Total Comments', value: totalComments.toString(), period: 'All time' },
    { metric: 'Total Likes', value: totalLikes.toString(), period: 'All time' },
    { metric: 'Reported Posts', value: reportedPosts.length.toString(), period: 'Current' },
    { metric: 'Announcements Sent', value: totalAnnouncements.toString(), period: 'All time' },
    { metric: 'Total Notifications', value: notifications.length.toString(), period: 'All time' },
  ]
}

export async function exportReportCSV(): Promise<Blob> {
  const rows = await getAdminReportData()
  const header = 'metric,value,period\n'
  const body = rows.map((r) => `${r.metric},${r.value},${r.period}`).join('\n')
  return new Blob([header + body], { type: 'text/csv' })
}

// Moderation
export function loadModerationQueue(): ModerationItem[] {
  const raw = localStorage.getItem(LS_KEYS.moderation)
  if (raw) return JSON.parse(raw)
  const seed: ModerationItem[] = []
  localStorage.setItem(LS_KEYS.moderation, JSON.stringify(seed))
  return seed
}

export function updateModerationItem(id: string, status: ModerationItem['status']): ModerationItem[] {
  const list = loadModerationQueue()
  const next = list.map((it) => (it.id === id ? { ...it, status } : it))
  localStorage.setItem(LS_KEYS.moderation, JSON.stringify(next))
  return next
}

// Announcements
export function loadAnnouncements(): Announcement[] {
  const raw = localStorage.getItem(LS_KEYS.announcements)
  if (raw) return JSON.parse(raw)
  const seed: Announcement[] = [
    { id: uid(), title: 'System Update', audience: 'All Users', message: 'We shipped improvements.', status: 'Delivered', sentAt: new Date().toISOString() },
  ]
  localStorage.setItem(LS_KEYS.announcements, JSON.stringify(seed))
  return seed
}

export function sendAnnouncement(
  title: string, 
  audience: string, 
  message: string,
  addNotification?: (data: any) => void
): Announcement[] {
  const list = loadAnnouncements()
  const next: Announcement = { id: uid(), title, audience, message, status: 'Delivered', sentAt: new Date().toISOString() }
  const merged = [next, ...list]
  localStorage.setItem(LS_KEYS.announcements, JSON.stringify(merged))

  // Send actual notifications to users
  if (addNotification) {
    const storedUsers = localStorage.getItem('appUsers')
    const currentUser = localStorage.getItem('user')
    
    if (storedUsers && currentUser) {
      try {
        const allUsers = JSON.parse(storedUsers)
        const admin = JSON.parse(currentUser)
        const adminName = `${admin.firstName} ${admin.lastName}`.trim() || admin.username
        
        // Filter users based on audience
        let targetUsers = allUsers
        if (audience === 'Admins Only') {
          targetUsers = allUsers.filter((u: any) => u.role === 'admin')
        } else if (audience === 'Recruiters') {
          targetUsers = allUsers.filter((u: any) => u.role === 'recruiter')
        }
        
        // Send notification to each target user
        targetUsers.forEach((user: any) => {
          addNotification({
            type: 'mention' as const, // Using 'mention' type for announcements
            recipientUsername: user.username,
            actorUsername: admin.username,
            actorName: adminName,
            message: `${title}: ${message}`,
          })
        })
      } catch (err) {
        console.error('Failed to send announcement notifications:', err)
      }
    }
  }

  return merged
}

// Settings
export function loadAdminSettings(): AdminSettings {
  const raw = localStorage.getItem(LS_KEYS.settings)
  if (raw) return JSON.parse(raw)
  const defaults: AdminSettings = {
    allowPublicSignups: true,
    defaultUserRole: 'user',
    announcementsVisibility: 'All users',
  }
  localStorage.setItem(LS_KEYS.settings, JSON.stringify(defaults))
  return defaults
}

export function saveAdminSettings(settings: AdminSettings): AdminSettings {
  localStorage.setItem(LS_KEYS.settings, JSON.stringify(settings))
  return settings
}
