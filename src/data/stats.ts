import type { MonthlyStats, AdminStats } from '@/types/stats'

export const mockMonthlyStats: MonthlyStats = {
  year: 2024,
  month: 6,
  totalFootprints: 12,
  totalDistance: 2580,
  totalDays: 18,
  totalCost: 8650,
  newCities: 6,
  newProvinces: 2,
  dailyStats: Array.from({ length: 30 }, (_, i) => ({
    date: `2024-06-${String(i + 1).padStart(2, '0')}`,
    duration: Math.floor(Math.random() * 10) + 2,
    cost: Math.floor(Math.random() * 500) + 100,
    distance: Math.floor(Math.random() * 200) + 10,
    footprintCount: Math.random() > 0.6 ? 1 : 0
  })),
  topTags: [
    { tag: '自然风光', count: 8 },
    { tag: '摄影', count: 6 },
    { tag: '美食', count: 5 },
    { tag: '历史文化', count: 4 },
    { tag: '徒步', count: 3 }
  ]
}

export const mockAdminStats: AdminStats = {
  totalUsers: 128560,
  activeUsers: 25680,
  totalFootprints: 892340,
  totalDistance: 12580000,
  popularDestinations: [
    { name: '杭州西湖', count: 15680 },
    { name: '成都', count: 12850 },
    { name: '三亚', count: 11230 },
    { name: '丽江', count: 9870 },
    { name: '西安', count: 8650 },
    { name: '厦门', count: 7890 },
    { name: '北京', count: 7560 },
    { name: '青岛', count: 6780 }
  ],
  dailyActiveUsers: Array.from({ length: 30 }, (_, i) => ({
    date: `2024-06-${String(i + 1).padStart(2, '0')}`,
    count: Math.floor(Math.random() * 5000) + 15000
  }))
}

export const getYearStats = (year: number) => {
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    footprints: Math.floor(Math.random() * 20) + 5,
    distance: Math.floor(Math.random() * 3000) + 500,
    cost: Math.floor(Math.random() * 10000) + 2000,
    days: Math.floor(Math.random() * 15) + 3
  }))

  return {
    year,
    totalFootprints: months.reduce((sum, m) => sum + m.footprints, 0),
    totalDistance: months.reduce((sum, m) => sum + m.distance, 0),
    totalCost: months.reduce((sum, m) => sum + m.cost, 0),
    totalDays: months.reduce((sum, m) => sum + m.days, 0),
    months
  }
}
