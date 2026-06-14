import { create } from 'zustand'
import type { User } from '@/types/user'
import type { Footprint } from '@/types/footprint'
import { mockCurrentUser } from '@/data/users'
import { mockFootprints, getFootprintsByUserId } from '@/data/footprints'

interface AppState {
  currentUser: User
  footprints: Footprint[]
  isLoading: boolean

  setCurrentUser: (user: User) => void
  addFootprint: (footprint: Footprint) => void
  toggleLike: (footprintId: string) => void
  loadUserFootprints: (userId: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: mockCurrentUser,
  footprints: getFootprintsByUserId('u1'),
  isLoading: false,

  setCurrentUser: (user: User) => {
    console.log('[Store] 设置当前用户:', user.nickname)
    set({ currentUser: user })
  },

  addFootprint: (footprint: Footprint) => {
    console.log('[Store] 添加足迹:', footprint.title)
    set(state => ({
      footprints: [footprint, ...state.footprints]
    }))
  },

  toggleLike: (footprintId: string) => {
    console.log('[Store] 切换点赞状态:', footprintId)
    set(state => ({
      footprints: state.footprints.map(f => {
        if (f.id === footprintId) {
          return {
            ...f,
            isLiked: !f.isLiked,
            likes: f.isLiked ? f.likes - 1 : f.likes + 1
          }
        }
        return f
      })
    }))
  },

  loadUserFootprints: (userId: string) => {
    console.log('[Store] 加载用户足迹:', userId)
    set({ isLoading: true })
    const footprints = getFootprintsByUserId(userId)
    set({ footprints, isLoading: false })
  }
}))
