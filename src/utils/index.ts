import dayjs from 'dayjs'

export const formatDate = (date: string, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format)
}

export const formatDateCN = (date: string): string => {
  return dayjs(date).format('YYYY年M月D日')
}

export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

export const formatDistance = (distance: number): string => {
  if (distance >= 1000) {
    return (distance / 1000).toFixed(1) + 'km'
  }
  return distance + 'm'
}

export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    return Math.floor(hours * 60) + '分钟'
  }
  if (hours < 24) {
    return hours.toFixed(1) + '小时'
  }
  const days = Math.floor(hours / 24)
  const remainingHours = Math.floor(hours % 24)
  return `${days}天${remainingHours}小时`
}

export const formatCost = (cost: number): string => {
  return '¥' + cost.toLocaleString()
}

export const getRelativeTime = (date: string): string => {
  const now = dayjs()
  const target = dayjs(date)
  const diffDays = now.diff(target, 'day')

  if (diffDays === 0) {
    const diffHours = now.diff(target, 'hour')
    if (diffHours === 0) {
      const diffMinutes = now.diff(target, 'minute')
      return diffMinutes <= 0 ? '刚刚' : `${diffMinutes}分钟前`
    }
    return `${diffHours}小时前`
  }
  if (diffDays === 1) {
    return '昨天'
  }
  if (diffDays < 7) {
    return `${diffDays}天前`
  }
  if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}周前`
  }
  return formatDate(date)
}

export const getSeason = (month?: number): string => {
  const m = month ?? dayjs().month() + 1
  if (m >= 3 && m <= 5) return '春季'
  if (m >= 6 && m <= 8) return '夏季'
  if (m >= 9 && m <= 11) return '秋季'
  return '冬季'
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
