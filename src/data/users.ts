import type { User, MemberLevel, MemberBenefit } from '@/types/user'

const avatarIds = [64, 91, 177, 338, 1027]

export const mockCurrentUser: User = {
  id: 'u1',
  nickname: '旅行达人小王',
  avatar: `https://picsum.photos/id/${avatarIds[0]}/200/200`,
  bio: '用脚步丈量世界，用镜头记录美好。已走过12个省份，48个城市。',
  level: 5,
  levelName: '探索者',
  exp: 2580,
  expToNextLevel: 3000,
  totalFootprints: 48,
  totalDistance: 8520,
  totalProvinces: 12,
  totalCities: 48,
  totalDays: 86,
  totalCost: 35600,
  followerCount: 1256,
  followingCount: 128,
  isFollowing: false
}

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 'u2',
    nickname: '背包客阿明',
    avatar: `https://picsum.photos/id/${avatarIds[1]}/200/200`,
    bio: '一个热爱自由的背包客，永远在路上。',
    level: 7,
    levelName: '旅行家',
    exp: 4280,
    expToNextLevel: 5000,
    totalFootprints: 72,
    totalDistance: 15600,
    totalProvinces: 24,
    totalCities: 89,
    totalDays: 156,
    totalCost: 68900,
    followerCount: 3580,
    followingCount: 256,
    isFollowing: false
  },
  {
    id: 'u3',
    nickname: '摄影师小雨',
    avatar: `https://picsum.photos/id/${avatarIds[2]}/200/200`,
    bio: '用镜头捕捉旅途中的每一个精彩瞬间。',
    level: 4,
    levelName: '漫游者',
    exp: 1820,
    expToNextLevel: 2000,
    totalFootprints: 35,
    totalDistance: 6780,
    totalProvinces: 9,
    totalCities: 32,
    totalDays: 62,
    totalCost: 28500,
    followerCount: 2340,
    followingCount: 189,
    isFollowing: true
  },
  {
    id: 'u4',
    nickname: '吃货旅行家',
    avatar: `https://picsum.photos/id/${avatarIds[3]}/200/200`,
    bio: '旅行的意义就是吃遍天下美食！',
    level: 3,
    levelName: '行者',
    exp: 1150,
    expToNextLevel: 1500,
    totalFootprints: 26,
    totalDistance: 4520,
    totalProvinces: 7,
    totalCities: 24,
    totalDays: 45,
    totalCost: 22800,
    followerCount: 890,
    followingCount: 156,
    isFollowing: false
  },
  {
    id: 'u5',
    nickname: '山与海',
    avatar: `https://picsum.photos/id/${avatarIds[4]}/200/200`,
    bio: '登山则情满于山，观海则意溢于海。',
    level: 6,
    levelName: '冒险家',
    exp: 3680,
    expToNextLevel: 4000,
    totalFootprints: 58,
    totalDistance: 12300,
    totalProvinces: 18,
    totalCities: 67,
    totalDays: 112,
    totalCost: 52300,
    followerCount: 1890,
    followingCount: 234,
    isFollowing: true
  }
]

export const memberLevels: MemberLevel[] = [
  { level: 1, name: '萌新', minExp: 0, maxExp: 200, color: '#CD7F32' },
  { level: 2, name: '旅人', minExp: 200, maxExp: 500, color: '#C0C0C0' },
  { level: 3, name: '行者', minExp: 500, maxExp: 1500, color: '#C0C0C0' },
  { level: 4, name: '漫游者', minExp: 1500, maxExp: 2000, color: '#FFD700' },
  { level: 5, name: '探索者', minExp: 2000, maxExp: 3000, color: '#FFD700' },
  { level: 6, name: '冒险家', minExp: 3000, maxExp: 4000, color: '#FFD700' },
  { level: 7, name: '旅行家', minExp: 4000, maxExp: 6000, color: '#E5E4E2' },
  { level: 8, name: '探险家', minExp: 6000, maxExp: 10000, color: '#E5E4E2' },
  { level: 9, name: '环球旅行家', minExp: 10000, maxExp: 999999, color: '#FFD700' }
]

export const memberBenefits: MemberBenefit[] = [
  {
    id: 'b1',
    name: '专属头像框',
    description: '点亮您的专属身份标识',
    icon: '🎖️',
    level: 2
  },
  {
    id: 'b2',
    name: '旅行攻略库',
    description: '免费查看精选旅行攻略',
    icon: '📖',
    level: 3
  },
  {
    id: 'b3',
    name: '优先推荐',
    description: '您的足迹优先推荐给好友',
    icon: '⭐',
    level: 4
  },
  {
    id: 'b4',
    name: '高清地图',
    description: '解锁高清卫星地图模式',
    icon: '🗺️',
    level: 5
  },
  {
    id: 'b5',
    name: '专属客服',
    description: '1对1专属旅行顾问服务',
    icon: '💬',
    level: 6
  },
  {
    id: 'b6',
    name: '免费月度报告',
    description: '每月自动生成精美旅行报告',
    icon: '📊',
    level: 7
  },
  {
    id: 'b7',
    name: 'VIP活动邀请',
    description: '专属线下旅行聚会邀请',
    icon: '🎉',
    level: 8
  },
  {
    id: 'b8',
    name: '定制旅行方案',
    description: '专业团队为您定制旅行计划',
    icon: '✈️',
    level: 9
  }
]

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(u => u.id === id)
}
