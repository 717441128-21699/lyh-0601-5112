export interface User {
  id: string
  nickname: string
  avatar: string
  bio: string
  level: number
  levelName: string
  exp: number
  expToNextLevel: number
  totalFootprints: number
  totalDistance: number
  totalProvinces: number
  totalCities: number
  totalDays: number
  totalCost: number
  followerCount: number
  followingCount: number
  isFollowing: boolean
}

export interface MemberBenefit {
  id: string
  name: string
  description: string
  icon: string
  level: number
}

export interface MemberLevel {
  level: number
  name: string
  minExp: number
  maxExp: number
  color: string
}
