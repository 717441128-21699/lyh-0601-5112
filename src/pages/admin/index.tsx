import React, { useMemo, useState } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { mockAdminStats } from '@/data/stats'
import { mockUsers } from '@/data/users'
import { formatNumber, formatDistance, formatCost } from '@/utils'

type FilterKey = '7d' | '30d' | '90d' | '180d' | '1y'

const AdminPage: React.FC = () => {
  const [filterKey, setFilterKey] = useState<FilterKey>('30d')

  const filterConfig: Record<FilterKey, { label: string; multiplier: number }> = {
    '7d': { label: '最近7天', multiplier: 7 / 30 },
    '30d': { label: '最近30天', multiplier: 1 },
    '90d': { label: '最近90天', multiplier: 3 },
    '180d': { label: '最近半年', multiplier: 6 },
    '1y': { label: '最近1年', multiplier: 12 }
  }

  const multiplier = filterConfig[filterKey].multiplier

  const stats = useMemo(() => {
    const s = mockAdminStats
    const m = multiplier
    return {
      totalUsers: s.totalUsers,
      activeUsers: Math.round(s.activeUsers * m * (0.8 + Math.random() * 0.4)),
      totalFootprints: Math.round(s.totalFootprints * m * 0.35),
      totalDistance: Math.round(s.totalDistance * m * 0.35),
      popularDestinations: s.popularDestinations.map(d => ({
        ...d,
        count: Math.round(d.count * (0.6 + Math.random() * 0.5))
      })).sort((a, b) => b.count - a.count),
      dailyActiveUsers: s.dailyActiveUsers.slice(0, 15).map((d, i) => ({
        date: d.date,
        count: Math.round(d.count * (0.7 + Math.random() * 0.5))
      }))
    }
  }, [multiplier])

  const maxDestinationCount = useMemo(() => {
    return Math.max(...stats.popularDestinations.map(d => d.count), 1)
  }, [stats.popularDestinations])

  const maxDayCount = useMemo(() => {
    return Math.max(...stats.dailyActiveUsers.map(d => d.count), 1)
  }, [stats.dailyActiveUsers])

  const activeUsers = useMemo(() => {
    return mockUsers.map((u, idx) => ({
      ...u,
      activityScore: Math.round((2000 - idx * 350 + Math.random() * 200)),
      footprintsInPeriod: Math.round((60 - idx * 10 + Math.random() * 20))
    }))
  }, [])

  const overviewStats = useMemo(() => {
    const active = stats.activeUsers
    return {
      activeRate: active > 0 ? ((active / stats.totalUsers) * 100).toFixed(1) : '0',
      avgFootprintsPerUser: active > 0 ? (stats.totalFootprints / active).toFixed(1) : '0',
      avgDistancePerDay: Math.round(stats.totalDistance / 30),
      peakHour: '20:00 - 22:00'
    }
  }, [stats])

  const handleBack = () => {
    Taro.navigateBack().catch(() => Taro.switchTab({ url: '/pages/stats/index' }))
  }

  const handleUserClick = (userId: string) => {
    Taro.navigateTo({ url: `/pages/profile/index?id=${userId}` })
  }

  const handleExport = () => {
    Taro.showToast({ title: '数据导出功能开发中', icon: 'none' })
  }

  return (
    <View className={styles.pageContainer}>
      {/* Hero 区 */}
      <View className={styles.hero}>
        <View className={styles.heroTop}>
          <View className={styles.backBtn} onClick={handleBack}>
            <Text className={styles.backIcon}>‹</Text>
          </View>
          <View className={styles.backBtn} onClick={handleExport}>
            <Text style={{ fontSize: '24rpx', color: 'white' }}>📤</Text>
          </View>
        </View>
        <View className={styles.heroTitleRow}>
          <View className={styles.heroBadge}>
            <Text className={styles.heroBadgeIcon}>🛡️</Text>
            <Text>管理员看板</Text>
          </View>
          <Text className={styles.heroTitle}>平台数据中心</Text>
          <Text className={styles.heroSubtitle}>
            实时监控平台运行数据，掌握用户旅行动态
          </Text>
        </View>
        {/* 时间筛选 */}
        <View className={styles.filterSection}>
          {(Object.keys(filterConfig) as FilterKey[]).map(key => (
            <View
              key={key}
              className={classnames(
                styles.filterItem,
                filterKey === key && styles.active
              )}
              onClick={() => setFilterKey(key)}
            >
              <Text>{filterConfig[key].label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 核心数据卡片 */}
      <View className={styles.statCards}>
        <View className={styles.statCard}>
          <Text className={styles.statCardIcon}>👥</Text>
          <Text className={styles.statCardValue}>
            {formatNumber(stats.totalUsers)}
            <Text className={styles.statCardUnit}> 人</Text>
          </Text>
          <Text className={styles.statCardLabel}>总用户数</Text>
          <View className={styles.statCardChange}>
            <Text className={styles.trendIcon}>↑</Text>
            <Text>12.5% 较上期</Text>
          </View>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statCardIcon}>🔥</Text>
          <Text className={styles.statCardValue}>
            {formatNumber(stats.activeUsers)}
            <Text className={styles.statCardUnit}> 人</Text>
          </Text>
          <Text className={styles.statCardLabel}>活跃用户</Text>
          <View className={styles.statCardChange}>
            <Text className={styles.trendIcon}>↑</Text>
            <Text>8.3% 较上期</Text>
          </View>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statCardIcon}>📸</Text>
          <Text className={styles.statCardValue}>
            {formatNumber(stats.totalFootprints)}
            <Text className={styles.statCardUnit}> 条</Text>
          </Text>
          <Text className={styles.statCardLabel}>新增足迹</Text>
          <View className={styles.statCardChange}>
            <Text className={styles.trendIcon}>↑</Text>
            <Text>15.7% 较上期</Text>
          </View>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statCardIcon}>🚗</Text>
          <Text className={styles.statCardValue}>
            {stats.totalDistance >= 10000
              ? `${formatNumber(Math.round(stats.totalDistance / 1000))}k`
              : formatNumber(stats.totalDistance)}
          </Text>
          <Text className={styles.statCardLabel}>累计里程(km)</Text>
          <View className={styles.statCardChange}>
            <Text className={styles.trendIcon}>↑</Text>
            <Text>9.2% 较上期</Text>
          </View>
        </View>
      </View>

      {/* 概览统计 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.sectionTitleLeft}>
            <Text className={styles.sectionIcon}>📊</Text>
            <Text>运营概览</Text>
          </View>
        </View>
        <View className={styles.overviewGrid}>
          <View className={styles.overviewCard}>
            <Text className={styles.overviewLabel}>用户活跃率</Text>
            <Text className={classnames(styles.overviewValue, styles.blue)}>
              {overviewStats.activeRate}%
            </Text>
            <Text className={styles.overviewDesc}>目标值 25%</Text>
          </View>
          <View className={styles.overviewCard}>
            <Text className={styles.overviewLabel}>人均足迹</Text>
            <Text className={classnames(styles.overviewValue, styles.orange)}>
              {overviewStats.avgFootprintsPerUser}
              <Text className={styles.overviewUnit}> 条/人</Text>
            </Text>
            <Text className={styles.overviewDesc}>活跃用户均值</Text>
          </View>
          <View className={styles.overviewCard}>
            <Text className={styles.overviewLabel}>日均里程</Text>
            <Text className={classnames(styles.overviewValue, styles.green)}>
              {formatNumber(overviewStats.avgDistancePerDay)}
              <Text className={styles.overviewUnit}> km</Text>
            </Text>
            <Text className={styles.overviewDesc}>全站累计均值</Text>
          </View>
          <View className={styles.overviewCard}>
            <Text className={styles.overviewLabel}>活跃高峰</Text>
            <Text className={classnames(styles.overviewValue, styles.purple)}>
              20-22
            </Text>
            <Text className={styles.overviewDesc}>{overviewStats.peakHour}</Text>
          </View>
        </View>
      </View>

      {/* 日活趋势图 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.sectionTitleLeft}>
            <Text className={styles.sectionIcon}>📈</Text>
            <Text>日活趋势</Text>
          </View>
          <Text className={styles.sectionMore}>共 {stats.dailyActiveUsers.length} 天</Text>
        </View>
        <View className={styles.chartSection}>
          <View className={styles.chartGrid}>
            {stats.dailyActiveUsers.map((day, idx) => {
              const heightPercent = (day.count / maxDayCount) * 100
              const isActive = day.count === maxDayCount
              return (
                <View key={idx} className={styles.chartColumn}>
                  <View
                    className={classnames(
                      styles.chartBar,
                      isActive && styles.active
                    )}
                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                  >
                    <View className={styles.chartTooltip}>
                      {formatNumber(day.count)}人
                    </View>
                  </View>
                  {idx % 2 === 0 && (
                    <Text className={styles.chartLabel}>
                      {day.date.split('-').slice(1).join('/')}
                    </Text>
                  )}
                </View>
              )
            })}
          </View>
          <View className={styles.chartLegend}>
            <View className={styles.legendItem}>
              <View className={classnames(styles.legendDot, styles.normal)} />
              <Text>日常日活</Text>
            </View>
            <View className={styles.legendItem}>
              <View className={classnames(styles.legendDot, styles.active)} />
              <Text>最高峰</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 热门目的地排行榜 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.sectionTitleLeft}>
            <Text className={styles.sectionIcon}>🏆</Text>
            <Text>热门目的地 TOP 8</Text>
          </View>
          <Text className={styles.sectionMore}>排行榜 ›</Text>
        </View>
        <View className={styles.destinationList}>
          {stats.popularDestinations.map((dest, idx) => {
            const widthPercent = (dest.count / maxDestinationCount) * 100
            return (
              <View key={dest.name} className={styles.destItem}>
                <Text className={classnames(
                  styles.destRank,
                  idx === 0 && styles.top1,
                  idx === 1 && styles.top2,
                  idx === 2 && styles.top3
                )}>
                  {idx === 0 && '🥇'}
                  {idx === 1 && '🥈'}
                  {idx === 2 && '🥉'}
                  {idx > 2 && idx + 1}
                </Text>
                <View className={styles.destInfo}>
                  <Text className={styles.destName}>{dest.name}</Text>
                  <Text className={styles.destCount}>
                    较上期 {idx < 3 ? '↑' : idx % 2 === 0 ? '↑' : '↓'} {Math.floor(Math.random() * 15 + 5)}%
                  </Text>
                </View>
                <View className={styles.destBarWrap}>
                  <View className={styles.destBar}>
                    <View
                      className={styles.destBarFill}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </View>
                </View>
                <Text className={styles.destValue}>
                  {formatNumber(dest.count)}
                </Text>
              </View>
            )
          })}
        </View>
      </View>

      {/* 活跃用户榜 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.sectionTitleLeft}>
            <Text className={styles.sectionIcon}>⭐</Text>
            <Text>活跃用户榜</Text>
          </View>
          <Text className={styles.sectionMore}>查看全部 ›</Text>
        </View>
        <View className={styles.activeUserList}>
          {activeUsers.slice(0, 5).map((user, idx) => (
            <View
              key={user.id}
              className={styles.activeUserItem}
              onClick={() => handleUserClick(user.id)}
            >
              <Image
                className={styles.activeUserAvatar}
                src={user.avatar}
                mode='aspectFill'
              />
              <View className={styles.activeUserInfo}>
                <Text className={styles.activeUserName}>
                  {idx === 0 && '👑 '}
                  {user.nickname}
                </Text>
                <Text className={styles.activeUserData}>
                  本期足迹 {user.footprintsInPeriod} 条 · Lv.{user.level} {user.levelName}
                </Text>
              </View>
              <Text className={styles.activeUserValue}>
                {formatNumber(user.activityScore)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 快捷操作 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.sectionTitleLeft}>
            <Text className={styles.sectionIcon}>⚡</Text>
            <Text>管理快捷入口</Text>
          </View>
        </View>
        <View className={styles.actionGrid}>
          <View
            className={styles.actionItem}
            onClick={() => Taro.showToast({ title: '用户管理', icon: 'none' })}
          >
            <Text className={styles.actionIcon}>👥</Text>
            <Text className={styles.actionLabel}>用户管理</Text>
          </View>
          <View
            className={styles.actionItem}
            onClick={() => Taro.showToast({ title: '内容审核', icon: 'none' })}
          >
            <Text className={styles.actionIcon}>✅</Text>
            <Text className={styles.actionLabel}>内容审核</Text>
          </View>
          <View
            className={styles.actionItem}
            onClick={() => Taro.showToast({ title: '推荐配置', icon: 'none' })}
          >
            <Text className={styles.actionIcon}>⚙️</Text>
            <Text className={styles.actionLabel}>推荐配置</Text>
          </View>
          <View
            className={styles.actionItem}
            onClick={() => Taro.showToast({ title: '系统消息', icon: 'none' })}
          >
            <Text className={styles.actionIcon}>📢</Text>
            <Text className={styles.actionLabel}>系统消息</Text>
          </View>
          <View
            className={styles.actionItem}
            onClick={() => Taro.showToast({ title: '活动管理', icon: 'none' })}
          >
            <Text className={styles.actionIcon}>🎉</Text>
            <Text className={styles.actionLabel}>活动管理</Text>
          </View>
          <View
            className={styles.actionItem}
            onClick={() => Taro.showToast({ title: '数据导出', icon: 'none' })}
          >
            <Text className={styles.actionIcon}>📦</Text>
            <Text className={styles.actionLabel}>数据导出</Text>
          </View>
          <View
            className={styles.actionItem}
            onClick={() => Taro.showToast({ title: '操作日志', icon: 'none' })}
          >
            <Text className={styles.actionIcon}>📋</Text>
            <Text className={styles.actionLabel}>操作日志</Text>
          </View>
          <View
            className={styles.actionItem}
            onClick={() => Taro.showToast({ title: '更多功能', icon: 'none' })}
          >
            <Text className={styles.actionIcon}>➕</Text>
            <Text className={styles.actionLabel}>更多</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default AdminPage
