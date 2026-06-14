import React, { useMemo } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store/useAppStore'
import { mockChallenges } from '@/data/challenges'
import { mockMonthlyStats, getYearStats } from '@/data/stats'
import { formatNumber, formatCost, formatDistance } from '@/utils'

const StatsPage: React.FC = () => {
  const { currentUser } = useAppStore()

  const yearStats = useMemo(() => getYearStats(2024), [])
  const monthlyStats = mockMonthlyStats

  const maxFootprints = useMemo(() => {
    return Math.max(...yearStats.months.map(m => m.footprints), 1)
  }, [yearStats])

  const handleGoReport = () => {
    console.log('[Stats] 点击月度报告')
    Taro.navigateTo({ url: '/pages/monthly-report/index' })
  }

  const handleGoChallenge = (id: string) => {
    console.log('[Stats] 点击挑战:', id)
    Taro.navigateTo({ url: `/pages/challenge-detail/index?id=${id}` })
  }

  const handleGoAdmin = () => {
    console.log('[Stats] 点击管理员看板')
    Taro.navigateTo({ url: '/pages/admin/index' })
  }

  const handleSeeAllChallenges = () => {
    console.log('[Stats] 查看全部挑战')
    Taro.navigateTo({ url: '/pages/challenge-detail/index' })
  }

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      {/* 顶部Header */}
      <View className={styles.statsHeader}>
        <Text className={styles.headerTitle}>旅行数据</Text>
        <Text className={styles.headerSubtitle}>记录你走过的每一步</Text>
      </View>

      {/* 数据概览卡片 */}
      <View className={styles.overviewCards}>
        <View className={styles.overviewCard}>
          <Text className={classnames(styles.cardValue, styles.cardValueHighlight)}>
            {currentUser.totalFootprints}
          </Text>
          <Text className={styles.cardLabel}>
            <Text className={styles.cardIcon}>📸</Text>
            总足迹数
          </Text>
        </View>
        <View className={styles.overviewCard}>
          <Text className={styles.cardValue}>{currentUser.totalProvinces}</Text>
          <Text className={styles.cardLabel}>
            <Text className={styles.cardIcon}>🗺️</Text>
            到访省份
          </Text>
        </View>
        <View className={styles.overviewCard}>
          <Text className={styles.cardValue}>{currentUser.totalCities}</Text>
          <Text className={styles.cardLabel}>
            <Text className={styles.cardIcon}>🏙️</Text>
            走过城市
          </Text>
        </View>
        <View className={styles.overviewCard}>
          <Text className={styles.cardValue}>{currentUser.totalDays}</Text>
          <Text className={styles.cardLabel}>
            <Text className={styles.cardIcon}>📅</Text>
            旅行天数
          </Text>
        </View>
        <View className={classnames(styles.overviewCard, styles.overviewCardFull)}>
          <Text className={classnames(styles.cardValue, styles.cardValueHighlight)}>
            {formatNumber(currentUser.totalDistance)}km
          </Text>
          <Text className={styles.cardLabel}>
            <Text className={styles.cardIcon}>🛣️</Text>
            总旅行里程
          </Text>
        </View>
      </View>

      {/* 月度报告卡片 */}
      <View className={styles.reportCard} onClick={handleGoReport}>
        <Text className={styles.reportTitle}>
          <Text className={styles.reportIcon}>📊</Text>
          2024年6月旅行报告
        </Text>
        <Text className={styles.reportDesc}>查看本月足迹汇总与统计分析</Text>
        <View className={styles.reportStats}>
          <Text className={styles.reportStat}>
            足迹<Text className={styles.reportStatValue}>{monthlyStats.totalFootprints}个</Text>
          </Text>
          <Text className={styles.reportStat}>
            里程<Text className={styles.reportStatValue}>{formatDistance(monthlyStats.totalDistance)}</Text>
          </Text>
          <Text className={styles.reportStat}>
            花费<Text className={styles.reportStatValue}>{formatCost(monthlyStats.totalCost)}</Text>
          </Text>
        </View>
        <Text className={styles.reportArrow}>›</Text>
      </View>

      {/* 月度足迹统计图表 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>2024年月度足迹</Text>
          <Text className={styles.sectionMore}>年度统计</Text>
        </View>
        <View className={styles.chartContainer}>
          <Text className={styles.chartTitle}>
            全年共 {yearStats.totalFootprints} 个足迹
          </Text>
          <View className={styles.barChart}>
            {yearStats.months.map((month, idx) => (
              <View key={idx} className={styles.barItem}>
                <View
                  className={classnames(
                    styles.bar,
                    idx === 5 && styles.barActive
                  )}
                  style={{ height: `${(month.footprints / maxFootprints) * 160 + 8}rpx` }}
                />
                <Text className={styles.barLabel}>{month.month}月</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 旅行标签 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>旅行偏好标签</Text>
        </View>
        <View className={styles.tagCloud}>
          {monthlyStats.topTags.map((tag, idx) => (
            <View
              key={tag.tag}
              className={classnames(
                styles.tagItem,
                idx === 0 && styles.tagItemLarge
              )}
            >
              <Text>{tag.tag}</Text>
              <Text className={styles.tagCount}>{tag.count}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 进行中的挑战 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>进行中的挑战</Text>
          <Text className={styles.sectionMore} onClick={handleSeeAllChallenges}>
            全部 ›
          </Text>
        </View>
        <View className={styles.challengeList}>
          {mockChallenges.slice(0, 3).map(challenge => (
            <View
              key={challenge.id}
              className={styles.challengeItem}
              onClick={() => handleGoChallenge(challenge.id)}
            >
              <View className={styles.challengeIcon}>🏆</View>
              <View className={styles.challengeInfo}>
                <Text className={styles.challengeName}>{challenge.title}</Text>
                <View className={styles.challengeProgress}>
                  <View className={styles.progressBar}>
                    <View
                      className={styles.progressFill}
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </View>
                  <Text className={styles.progressText}>{challenge.progress}%</Text>
                </View>
                <View className={styles.challengeMeta}>
                  <Text>已完成 {challenge.current}/{challenge.target}{challenge.unit}</Text>
                  <Text>{challenge.participants}人参与</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 管理员入口 */}
      <View className={styles.adminEntry} onClick={handleGoAdmin}>
        <View className={styles.adminEntryLeft}>
          <Text className={styles.adminEntryIcon}>📊</Text>
          <Text className={styles.adminEntryText}>管理员数据看板</Text>
        </View>
        <Text className={styles.adminEntryArrow}>›</Text>
      </View>
    </ScrollView>
  )
}

export default StatsPage
