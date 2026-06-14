import type { Comment } from '@/types/comment'

const avatarIds = [64, 91, 177, 338, 1027]

export const mockComments: Comment[] = [
  {
    id: 'c1',
    userId: 'u2',
    nickname: '背包客阿明',
    avatar: `https://picsum.photos/id/${avatarIds[1]}/200/200`,
    content: '西湖的早晨真的太美了，下次一定要去看看！',
    createdAt: '2024-06-15T19:20:00Z',
    likes: 12,
    isLiked: false
  },
  {
    id: 'c2',
    userId: 'u3',
    nickname: '摄影师小雨',
    avatar: `https://picsum.photos/id/${avatarIds[2]}/200/200`,
    content: '照片拍得真好！是用什么相机拍的？',
    createdAt: '2024-06-15T20:05:00Z',
    likes: 8,
    isLiked: true
  },
  {
    id: 'c3',
    userId: 'u4',
    nickname: '吃货旅行家',
    avatar: `https://picsum.photos/id/${avatarIds[3]}/200/200`,
    content: '杭州的美食也很棒，推荐去河坊街逛逛！',
    createdAt: '2024-06-15T21:30:00Z',
    likes: 5,
    isLiked: false
  },
  {
    id: 'c4',
    userId: 'u5',
    nickname: '山与海',
    avatar: `https://picsum.photos/id/${avatarIds[4]}/200/200`,
    content: '苏堤春晓是西湖十景之一，春天去最美',
    createdAt: '2024-06-16T08:15:00Z',
    likes: 15,
    isLiked: false,
    replyTo: {
      userId: 'u1',
      nickname: '旅行达人小王'
    }
  }
]

export const getCommentsByFootprintId = (footprintId: string): Comment[] => {
  console.log('[Comments] 获取足迹评论:', footprintId)
  return mockComments
}
