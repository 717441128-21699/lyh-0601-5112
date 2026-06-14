import { create } from 'zustand'
import Taro from '@tarojs/taro'
import type { User } from '@/types/user'
import type { Footprint } from '@/types/footprint'
import { mockCurrentUser } from '@/data/users'
import { getFootprintsByUserId } from '@/data/footprints'

const STORAGE_KEY = 'travel_footprints_user_u1'
const USER_STORAGE_KEY = 'travel_user_stats_u1'
const SOCIAL_STORAGE_KEY = 'travel_social_u1'

interface SocialState {
  followingUserIds: string[]
  likedFootprintIds: string[]
}

interface AppState {
  currentUser: User
  footprints: Footprint[]
  isLoading: boolean
  social: SocialState

  setCurrentUser: (user: User) => void
  addFootprint: (footprint: Footprint) => void
  toggleLike: (footprintId: string) => void
  loadUserFootprints: (userId: string) => void
  initFromStorage: () => void
  persistFootprints: () => void
  recalcUserStats: () => void

  toggleFollow: (userId: string) => void
  isFollowing: (userId: string) => boolean
  isLiked: (footprintId: string) => boolean
  persistSocial: () => void
  initSocialFromStorage: () => void
}

const calculateUserStats = (footprints: Footprint[]) => {
  const uniqueProvinces = new Set(footprints.map(f => f.location.province))
  const uniqueCities = new Set(footprints.map(f => f.location.city))
  const totalDistance = footprints.reduce((sum, f) => sum + f.distance, 0)
  const totalDays = footprints.length > 0
    ? Math.ceil(footprints.reduce((sum, f) => sum + f.duration, 0) / 8)
    : 0
  const totalCost = footprints.reduce((sum, f) => sum + f.cost, 0)
  const totalExp = footprints.length * 50 + uniqueProvinces.size * 100 + uniqueCities.size * 30

  return {
    totalFootprints: footprints.length,
    totalDistance: Math.round(totalDistance),
    totalProvinces: uniqueProvinces.size,
    totalCities: uniqueCities.size,
    totalDays,
    totalCost: Math.round(totalCost),
    expGained: totalExp
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: mockCurrentUser,
  footprints: [],
  isLoading: false,
  social: {
    followingUserIds: [],
    likedFootprintIds: []
  },

  initFromStorage: () => {
    console.log('[Store] 从本地存储初始化数据')
    get().initSocialFromStorage()
    try {
      const saved = Taro.getStorageSync(STORAGE_KEY)
      if (saved && Array.isArray(saved) && saved.length > 0) {
        console.log('[Store] 从存储加载足迹:', saved.length)
        const footprints = saved
        const stats = calculateUserStats(footprints)
        const user = mockCurrentUser
        const newExp = user.exp + stats.expGained

        set({
          footprints,
          currentUser: {
            ...user,
            totalFootprints: stats.totalFootprints,
            totalDistance: stats.totalDistance,
            totalProvinces: stats.totalProvinces,
            totalCities: stats.totalCities,
            totalDays: stats.totalDays,
            totalCost: stats.totalCost,
            exp: Math.min(newExp, user.expToNextLevel + user.level * 1000)
          }
        })
        console.log('[Store] 本地数据加载完成')
      } else {
        console.log('[Store] 无本地存储，使用默认数据')
        const defaultFootprints = getFootprintsByUserId('u1')
        const stats = calculateUserStats(defaultFootprints)
        const user = mockCurrentUser
        set({
          footprints: defaultFootprints,
          currentUser: {
            ...user,
            totalFootprints: stats.totalFootprints,
            totalDistance: stats.totalDistance,
            totalProvinces: stats.totalProvinces,
            totalCities: stats.totalCities,
            totalDays: stats.totalDays,
            totalCost: stats.totalCost
          }
        })
        try {
          Taro.setStorageSync(STORAGE_KEY, defaultFootprints)
        } catch (e) {
          console.error('[Store] 保存默认数据失败:', e)
        }
      }
    } catch (e) {
      console.error('[Store] 初始化失败:', e)
      const defaultFootprints = getFootprintsByUserId('u1')
      set({ footprints: defaultFootprints })
    }
  },

  persistFootprints: () => {
    try {
      const { footprints } = get()
      Taro.setStorageSync(STORAGE_KEY, footprints)
      console.log('[Store] 足迹已保存到本地存储，共', footprints.length, '条')
    } catch (e) {
      console.error('[Store] 保存足迹失败:', e)
    }
  },

  recalcUserStats: () => {
    const { footprints, currentUser } = get()
    const stats = calculateUserStats(footprints)
    const baseExp = 1000
    const expGained = stats.expGained
    const newExp = baseExp + expGained
    const expToNextLevel = (currentUser.level + 1) * 500

    set({
      currentUser: {
        ...currentUser,
        totalFootprints: stats.totalFootprints,
        totalDistance: stats.totalDistance,
        totalProvinces: stats.totalProvinces,
        totalCities: stats.totalCities,
        totalDays: stats.totalDays,
        totalCost: stats.totalCost,
        exp: newExp,
        expToNextLevel,
        level: Math.floor(newExp / 500) + 1
      }
    })
  },

  setCurrentUser: (user: User) => {
    console.log('[Store] 设置当前用户:', user.nickname)
    set({ currentUser: user })
  },

  addFootprint: (footprint: Footprint) => {
    console.log('[Store] 添加足迹:', footprint.title)
    set(state => ({
      footprints: [footprint, ...state.footprints]
    }))
    get().persistFootprints()
    get().recalcUserStats()
  },

  loadUserFootprints: (userId: string) => {
    console.log('[Store] 加载用户足迹:', userId)
    set({ isLoading: true })
    const saved = Taro.getStorageSync(STORAGE_KEY)
    const footprints = saved || getFootprintsByUserId(userId)
    set({ footprints, isLoading: false })
  },

  initSocialFromStorage: () => {
    console.log('[Store] 初始化社交状态')
    try {
      const saved = Taro.getStorageSync(SOCIAL_STORAGE_KEY)
      if (saved && typeof saved === 'object') {
        set({
          social: {
            followingUserIds: saved.followingUserIds || [],
            likedFootprintIds: saved.likedFootprintIds || []
          }
        })
        console.log('[Store] 社交状态加载完成，关注:', saved.followingUserIds?.length, '点赞:', saved.likedFootprintIds?.length)
      }
    } catch (e) {
      console.error('[Store] 加载社交状态失败:', e)
    }
  },

  persistSocial: () => {
    try {
      const { social } = get()
      Taro.setStorageSync(SOCIAL_STORAGE_KEY, social)
    } catch (e) {
      console.error('[Store] 保存社交状态失败:', e)
    }
  },

  isFollowing: (userId: string) => {
    const { social } = get()
    return social.followingUserIds.includes(userId)
  },

  isLiked: (footprintId: string) => {
    const { social } = get()
    return social.likedFootprintIds.includes(footprintId)
  },

  toggleFollow: (userId: string) => {
    console.log('[Store] 切换关注状态:', userId)
    set(state => {
      const isCurrentlyFollowing = state.social.followingUserIds.includes(userId)
      const newFollowing = isCurrentlyFollowing
        ? state.social.followingUserIds.filter(id => id !== userId)
        : [...state.social.followingUserIds, userId]

      const user = state.currentUser
      const newFollowingCount = isCurrentlyFollowing
        ? user.followingCount - 1
        : user.followingCount + 1

      return {
        social: {
          ...state.social,
          followingUserIds: newFollowing
        },
        currentUser: {
          ...user,
          followingCount: newFollowingCount
        }
      }
    })
    get().persistSocial()
  },

  toggleLike: (footprintId: string) => {
    console.log('[Store] 切换点赞状态:', footprintId)
    set(state => {
      const isCurrentlyLiked = state.social.likedFootprintIds.includes(footprintId)
      const newLikedIds = isCurrentlyLiked
        ? state.social.likedFootprintIds.filter(id => id !== footprintId)
        : [...state.social.likedFootprintIds, footprintId]

      const newFootprints = state.footprints.map(f => {
        if (f.id === footprintId) {
          return {
            ...f,
            isLiked: !isCurrentlyLiked,
            likes: isCurrentlyLiked ? f.likes - 1 : f.likes + 1
          }
        }
        return f
      })

      return {
        social: {
          ...state.social,
          likedFootprintIds: newLikedIds
        },
        footprints: newFootprints
      }
    })
    get().persistSocial()
    get().persistFootprints()
  },
}))
