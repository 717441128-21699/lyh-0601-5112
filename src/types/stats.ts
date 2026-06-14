export interface DailyStat {
  date: string
  duration: number
  cost: number
  distance: number
  footprintCount: number
}

export interface MonthlyStats {
  year: number
  month: number
  totalFootprints: number
  totalDistance: number
  totalDays: number
  totalCost: number
  newCities: number
  newProvinces: number
  dailyStats: DailyStat[]
  topTags: { tag: string; count: number }[]
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalFootprints: number
  totalDistance: number
  popularDestinations: { name: string; count: number }[]
  dailyActiveUsers: { date: string; count: number }[]
}
