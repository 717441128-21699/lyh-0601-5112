export interface Challenge {
  id: string
  title: string
  description: string
  type: 'province' | 'city' | 'distance' | 'footprint' | 'days'
  target: number
  current: number
  unit: string
  startDate: string
  endDate: string
  progress: number
  status: 'ongoing' | 'completed' | 'expired'
  participants: number
  image: string
  rewards: string[]
}

export interface ChallengeRankItem {
  rank: number
  userId: string
  nickname: string
  avatar: string
  progress: number
  value: number
}
