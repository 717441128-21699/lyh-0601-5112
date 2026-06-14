import type { Challenge, ChallengeRankItem } from '@/types/challenge'

const landscapeIds = [1015, 1018, 1036, 1039, 1044, 292, 312]
const avatarIds = [64, 91, 177, 338, 1027]

export const mockChallenges: Challenge[] = [
  {
    id: 'c1',
    title: '打卡10个省份',
    description: '一年内打卡10个省份，解锁"省省高手"勋章',
    type: 'province',
    target: 10,
    current: 7,
    unit: '个',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    progress: 70,
    status: 'ongoing',
    participants: 12580,
    image: `https://picsum.photos/id/${landscapeIds[0]}/750/400`,
    rewards: ['省省高手勋章', '1000积分', '专属头像框']
  },
  {
    id: 'c2',
    title: '百城计划',
    description: '一生要去的100个城市，你完成了多少？',
    type: 'city',
    target: 100,
    current: 48,
    unit: '个',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    progress: 48,
    status: 'ongoing',
    participants: 8960,
    image: `https://picsum.photos/id/${landscapeIds[1]}/750/400`,
    rewards: ['百城达人勋章', '5000积分', '定制旅行地图']
  },
  {
    id: 'c3',
    title: '万里行',
    description: '累计旅行里程达到10000公里',
    type: 'distance',
    target: 10000,
    current: 8520,
    unit: '公里',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    progress: 85.2,
    status: 'ongoing',
    participants: 6540,
    image: `https://picsum.photos/id/${landscapeIds[2]}/750/400`,
    rewards: ['万里行者勋章', '3000积分', '免费旅行攻略']
  },
  {
    id: 'c4',
    title: '百日挑战',
    description: '连续100天打卡旅行足迹',
    type: 'days',
    target: 100,
    current: 56,
    unit: '天',
    startDate: '2024-04-01',
    endDate: '2024-07-09',
    progress: 56,
    status: 'ongoing',
    participants: 3280,
    image: `https://picsum.photos/id/${landscapeIds[3]}/750/400`,
    rewards: ['坚持不懈勋章', '2000积分', 'VIP会员1个月']
  },
  {
    id: 'c5',
    title: '年度50景',
    description: '一年打卡50个旅行目的地',
    type: 'footprint',
    target: 50,
    current: 32,
    unit: '个',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    progress: 64,
    status: 'ongoing',
    participants: 5680,
    image: `https://picsum.photos/id/${landscapeIds[4]}/750/400`,
    rewards: ['足迹达人勋章', '2500积分', '专属电子证书']
  },
  {
    id: 'c6',
    title: '川藏线挑战',
    description: '完成川藏线全程旅行',
    type: 'distance',
    target: 2142,
    current: 0,
    unit: '公里',
    startDate: '2024-06-01',
    endDate: '2024-09-30',
    progress: 0,
    status: 'ongoing',
    participants: 2350,
    image: `https://picsum.photos/id/${landscapeIds[5]}/750/400`,
    rewards: ['川藏勇士勋章', '4000积分', '定制纪念徽章']
  }
]

export const mockChallengeRank: ChallengeRankItem[] = [
  {
    rank: 1,
    userId: 'u2',
    nickname: '背包客阿明',
    avatar: `https://picsum.photos/id/${avatarIds[1]}/200/200`,
    progress: 100,
    value: 10
  },
  {
    rank: 2,
    userId: 'u5',
    nickname: '山与海',
    avatar: `https://picsum.photos/id/${avatarIds[4]}/200/200`,
    progress: 90,
    value: 9
  },
  {
    rank: 3,
    userId: 'u3',
    nickname: '摄影师小雨',
    avatar: `https://picsum.photos/id/${avatarIds[2]}/200/200`,
    progress: 80,
    value: 8
  },
  {
    rank: 4,
    userId: 'u1',
    nickname: '旅行达人小王',
    avatar: `https://picsum.photos/id/${avatarIds[0]}/200/200`,
    progress: 70,
    value: 7
  },
  {
    rank: 5,
    userId: 'u4',
    nickname: '吃货旅行家',
    avatar: `https://picsum.photos/id/${avatarIds[3]}/200/200`,
    progress: 60,
    value: 6
  }
]

export const getChallengeById = (id: string): Challenge | undefined => {
  return mockChallenges.find(c => c.id === id)
}
