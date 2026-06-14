export interface Comment {
  id: string
  userId: string
  nickname: string
  avatar: string
  content: string
  createdAt: string
  likes: number
  isLiked: boolean
  replyTo?: {
    userId: string
    nickname: string
  }
}
