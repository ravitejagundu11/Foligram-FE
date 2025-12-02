export interface Notification {
  id: string
  type: 'like' | 'comment' | 'reply' | 'share' | 'subscription' | 'mention' | 'appointment'
  recipientUsername: string
  actorUsername: string
  actorName: string
  postId?: string
  postTitle?: string
  commentId?: string
  appointmentId?: string
  appointmentDate?: string
  appointmentTime?: string
  message: string
  timestamp: number
  read: boolean
}

export interface CreateNotificationData {
  type: Notification['type']
  recipientUsername: string
  actorUsername: string
  actorName: string
  postId?: string
  postTitle?: string
  commentId?: string
  appointmentId?: string
  appointmentDate?: string
  appointmentTime?: string
  message: string
}
