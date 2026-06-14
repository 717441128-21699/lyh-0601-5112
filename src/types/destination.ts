export interface Destination {
  id: string
  name: string
  province: string
  city: string
  image: string
  description: string
  rating: number
  reviewCount: number
  bestSeason: string[]
  tags: string[]
  distance: number
  costLevel: number
  highlights: string[]
}

export interface RoutePlan {
  id: string
  title: string
  days: number
  destinations: string[]
  totalDistance: number
  estimatedCost: number
  image: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

export interface RecommendReason {
  type: 'season' | 'preference' | 'trending' | 'nearby'
  text: string
}
