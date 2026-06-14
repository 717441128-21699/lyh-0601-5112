import React, { useMemo, useState } from 'react'
import { View, Text, Image, Button, Picker, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { mockMonthlyStats, getYearStats } from '@/data/stats'
import { useAppStore } from '@/store/useAppStore'
import { formatCost, formatDistance, formatNumber, formatDateCN, formatDate } from '@/utils'

const MonthlyReportPage: React.FC = () => {
  const router = useRouter()
  const { footprints } = useAppStore()

  const [selectedYear, setSelectedYear] = useState(mockMonthlyStats.year)
  const [selectedMonth, setSelectedMonth] = useState(mockMonthlyStats.month)

  const yearMonthStr = useMemo(() => {
    return `${selectedYear}年${selectedMonth}月`
  }, [selectedYear, selectedMonth])

  const dynamicStats = useMemo(() => {
    const targetMonth = selectedMonth
    const targetYear = selectedYear
    const monthFootprints = footprints.filter(f => {
      const d = new Date(f.date)
      return d.getFullYear() === targetYear && d.getMonth() + 1 === targetMonth
    })

    if (monthFootprints.length === 0) {
      return {
        hasData: false,
        totalFootprints: 0,
        totalDistance: 0,
        totalCost: 0,
        totalDays: 0,
        newCities: 0,
        newProvinces: 0,
        photos: [],
        tags: [],
        dailyStats: [],
        topTags: [],
        footprints: []
      }
    }

    const uniqueCities = new Set(monthFootprints.map(f => f.location.city))
    const uniqueProvinces = new Set(monthFootprints.map(f => f.location.province))
    const allPhotos = monthFootprints.flatMap(f => f.photos).slice(0, 24)
    const tagMap = new Map<string, number>()
    monthFootprints.forEach(f => {
      f.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    })
    const topTags = Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    const totalDistance = monthFootprints.reduce((sum, f) => sum + f.distance, 0)
    const totalCost = monthFootprints.reduce((sum, f) => sum + f.cost, 0)
    const totalDuration = monthFootprints.reduce((sum, f) => sum + f.duration, 0)
    const totalDays = Math.max(1, Math.ceil(totalDuration / 8))

    return {
      hasData: true,
      totalFootprints: monthFootprints.length,
      totalDistance: Math.round(totalDistance),
      totalCost: Math.round(totalCost),
      totalDays,
      newCities: uniqueCities.size,
      newProvinces: uniqueProvinces.size,
      photos: allPhotos,
      topTags,
      dailyStats: mockMonthlyStats.dailyStats,
      footprints: monthFootprints
    }
  }, [footprints, selectedYear, selectedMonth])

  const stats = useMemo(() => {
    return dynamicStats
  }, [dynamicStats])

  const chartData = useMemo(() => {
    const maxDaysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
    const displayDays = Math.min(maxDaysInMonth, 30)
    const data = Array.from({ length: displayDays }, (_, i) => ({
      day: i + 1,
      count: stats.hasData && i < stats.dailyStats.length
        ? stats.dailyStats[i]?.footprintCount || 0
        : 0
    }))
    const maxCount = Math.max(...data.map(d => d.count), 1)
    return { data, maxCount }
  }, [stats.dailyStats, stats.hasData, selectedYear, selectedMonth])

  const handleBack = () => {
    Taro.navigateBack().catch(() => Taro.switchTab({ url: '/pages/stats/index' }))
  }

  const handleMonthChange = (e: any) => {
    const val = e.detail.value
    const [y, m] = val.split('-').map(Number)
    setSelectedYear(y)
    setSelectedMonth(m)
  }

  const handleExport = () => {
    Taro.showToast({ title: 'PDF导出功能开发中', icon: 'none' })
  }

  const handleShare = () => {
    Taro.showToast({ title: '分享功能开发中', icon: 'none' })
  }

  const getQuote = () => {
    const quotes = [
      '旅行不是为了逃离生活，而是为了让生活不被遗忘。',
      '世界是一本书，不旅行的人只看到了其中的一页。',
      '每一次旅行都是一次与未知的浪漫约会。',
      '人生最好的旅行，就是你在一个陌生的地方，发现一种久违的感动。',
      '走过的路，看过的风景，都会成为心中最美的回忆。'
    ]
    return quotes[Math.floor((selectedYear + selectedMonth) % quotes.length)]
  }

  const displayPhotos = stats.photos.slice(0, 9)
  const remainingPhotos = Math.max(0, stats.photos.length - 9)

  return (
    <View className={styles.pageContainer}>
      {/* 渐变头部 */}
      <View className={styles.hero}>
        <View className={styles.heroHeader}>
          <View className={styles.backBtn} onClick={handleBack}>
            <Text className={styles.backIcon}>‹</Text>
          </View>
          <Picker
            mode='date'
            fields='month'
            value={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`}
            onChange={handleMonthChange}
          >
            <View className={styles.monthPicker}>
              <Text className={styles.monthPickerText}>{yearMonthStr}</Text>
              <Text className={styles.monthPickerArrow}>▾</Text>
            </View>
          </Picker>
          <View className={styles.exportBtn} onClick={handleExport}>
            <Text className={styles.exportIcon}>📄</Text>
            <Text>PDF</Text>
          </View>
        </View>

        <View className={styles.heroMain}>
          <Text className={styles.badgeText}>
            <Text className={styles.badgeIcon}>✨</Text>
            <Text>{stats.hasData ? '你的月度旅行报告' : '本月暂无旅行记录'}</Text>
          </Text>
          <Text className={styles.monthTitle}>{yearMonthStr}</Text>
          <Text className={styles.monthSubtitle}>
            {stats.totalFootprints > 0
              ? `共记录了 ${stats.totalFootprints} 段旅行，走过 ${stats.totalDays} 天美好时光`
              : '去记录你的第一次旅行吧~'}
          </Text>
        </View>
      </View>

      {/* 核心数据卡片 */}
      <View className={styles.statCards}>
        <View className={styles.statGrid}>
          <View className={classnames(styles.statCard, styles.statCardHighlight)}>
            <Text className={styles.statCardIcon}>�</Text>
            <Text className={styles.statCardValue}>
              {stats.totalFootprints}
            </Text>
            <Text className={styles.statCardLabel}>足迹数量</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statCardIcon}>🚗</Text>
            <Text className={styles.statCardValue}>
              {stats.totalDistance >= 1000
                ? `${(stats.totalDistance / 1000).toFixed(1)}k`
                : stats.totalDistance}
              <Text className={styles.statCardUnit}>km</Text>
            </Text>
            <Text className={styles.statCardLabel}>总里程</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statCardIcon}>💰</Text>
            <Text className={styles.statCardValue}>
              {stats.totalCost >= 10000
                ? `${(stats.totalCost / 10000).toFixed(1)}w`
                : stats.totalCost}
            </Text>
            <Text className={styles.statCardLabel}>总花费(元)</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statCardIcon}>🏙️</Text>
            <Text className={styles.statCardValue}>{stats.newCities}</Text>
            <Text className={styles.statCardLabel}>到访城市</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statCardIcon}>🗺️</Text>
            <Text className={styles.statCardValue}>{stats.newProvinces}</Text>
            <Text className={styles.statCardLabel}>到访省份</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statCardIcon}>📅</Text>
            <Text className={styles.statCardValue}>{stats.totalDays}</Text>
            <Text className={styles.statCardLabel}>旅行天数</Text>
          </View>
        </View>
      </View>

      {/* 月度感悟 */}
      <View className={styles.summeryCard}>
        <Text className={styles.summeryQuote}>{getQuote()}</Text>
      </View>

      {/* 照片汇总 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.sectionTitleLeft}>
            <Text className={styles.sectionIcon}>📷</Text>
            <Text>照片汇总</Text>
          </View>
          <Text className={styles.sectionMore}>共 {stats.photos.length} 张 ›</Text>
        </View>
        <View className={styles.photoSection}>
          {displayPhotos.length > 0 ? (
            <View className={styles.photoGrid}>
              {displayPhotos.map((photo, idx) => (
                <View key={idx} className={styles.photoItem}>
                  <Image
                    className={styles.photoImage}
                    src={photo}
                    mode='aspectFill'
                  />
                  {idx === 8 && remainingPhotos > 0 && (
                    <View className={styles.photoMore}>
                      <Text className={styles.photoMoreNum}>+{remainingPhotos}</Text>
                      <Text className={styles.photoMoreText}>更多</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyPhoto}>
              <Text className={styles.emptyIcon}>📷</Text>
              <Text className={styles.emptyPhotoText}>本月暂无旅行照片</Text>
            </View>
          )}
        </View>
      </View>

      {/* 详细数据 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.sectionTitleLeft}>
            <Text className={styles.sectionIcon}>��</Text>
            <Text>详细数据</Text>
          </View>
        </View>
        <View className={styles.detailSection}>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>
              <Text className={styles.detailLabelIcon}>📸</Text>
              <Text>平均每周足迹</Text>
            </Text>
            <Text className={classnames(styles.detailValue, styles.detailValueHighlight)}>
              {(stats.totalFootprints / 4.3).toFixed(1)} 次
            </Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>
              <Text className={styles.detailLabelIcon}>🚗</Text>
              <Text>平均每日里程</Text>
            </Text>
            <Text className={styles.detailValue}>
              {stats.totalDays > 0 ? Math.round(stats.totalDistance / stats.totalDays) : 0} km
            </Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>
              <Text className={styles.detailLabelIcon}>💳</Text>
              <Text>单次平均花费</Text>
            </Text>
            <Text className={styles.detailValue}>
              {stats.totalFootprints > 0 ? Math.round(stats.totalCost / stats.totalFootprints) : 0} 元
            </Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>
              <Text className={styles.detailLabelIcon}>💰</Text>
              <Text>日均花费</Text>
            </Text>
            <Text className={classnames(styles.detailValue, styles.detailValueAccent)}>
              {stats.totalDays > 0 ? Math.round(stats.totalCost / stats.totalDays) : 0} 元/天
            </Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>
              <Text className={styles.detailLabelIcon}>🏙️</Text>
              <Text>城市密度</Text>
            </Text>
            <Text className={styles.detailValue}>
              {stats.totalFootprints > 0
                ? `${((stats.newCities / stats.totalFootprints) * 100).toFixed(0)}% 为新城市`
                : '--'}
            </Text>
          </View>
        </View>
      </View>

      {/* 月度足迹分布图 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.sectionTitleLeft}>
            <Text className={styles.sectionIcon}>📈</Text>
            <Text>每日足迹分布</Text>
          </View>
        </View>
        <View className={styles.chartSection}>
          {stats.hasData ? (
            <View className={styles.chartGrid}>
              {chartData.data.slice(0, 15).map((item, idx) => {
                const heightPercent = (item.count / chartData.maxCount) * 100
                const isMax = item.count === chartData.maxCount && item.count > 0
                return (
                  <View key={idx} className={styles.chartColumn}>
                    <View
                      className={classnames(styles.chartBar, isMax && styles.max)}
                      style={{ height: `${Math.max(heightPercent, 2)}%` }}
                    />
                    <Text className={styles.chartLabel}>{item.day}</Text>
                  </View>
                )
              })}
            </View>
          ) : (
            <View className={styles.emptyChart}>
              <Text className={styles.emptyIcon}>📊</Text>
              <Text className={styles.emptyPhotoText}>本月暂无足迹分布数据</Text>
            </View>
          )}
          {stats.hasData && (
            <View className={styles.chartLegend}>
              <View className={styles.legendItem}>
                <View className={classnames(styles.legendDot, styles.normal)} />
                <Text>日常足迹</Text>
              </View>
              <View className={styles.legendItem}>
                <View className={classnames(styles.legendDot, styles.max)} />
                <Text>高峰日</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* 旅行标签云 */}
      {stats.topTags.length > 0 && (
        <View className={styles.dataSection}>
          <View className={styles.sectionTitle}>
            <View className={styles.sectionTitleLeft}>
              <Text className={styles.sectionIcon}>🏷️</Text>
              <Text>本月旅行标签</Text>
            </View>
          </View>
          <View className={styles.tagSection}>
            <View className={styles.tagCloud}>
              {stats.topTags.map((item, idx) => (
                <Text
                  key={item.tag}
                  className={classnames(
                    styles.tagItem,
                    idx === 0 && styles.level1,
                    idx >= 1 && idx <= 2 && styles.level2,
                    idx >= 5 && styles.level3
                  )}
                >
                  {item.tag}
                  <Text className={styles.tagCount}>×{item.count}</Text>
                </Text>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* 本月足迹列表 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.sectionTitleLeft}>
            <Text className={styles.sectionIcon}>📔</Text>
            <Text>本月足迹</Text>
          </View>
          <Text className={styles.sectionMore}>共 {stats.footprints.length} 条 ›</Text>
        </View>
        {stats.footprints.length > 0 ? (
          <View className={styles.monthlyFpList}>
            {stats.footprints.map(fp => (
              <View
                key={fp.id}
                className={styles.monthlyFpCard}
                onClick={() => Taro.navigateTo({ url: `/pages/footprint-detail/index?id=${fp.id}` })}
              >
                <Image
                  className={styles.monthlyFpImage}
                  src={fp.photos[0]}
                  mode='aspectFill'
                />
                <View className={styles.monthlyFpInfo}>
                  <Text className={styles.monthlyFpTitle}>{fp.title}</Text>
                  <Text className={styles.monthlyFpLocation}>
                    📍 {fp.location.city}
                  </Text>
                  <View className={styles.monthlyFpMeta}>
                    <Text className={styles.monthlyFpMetaItem}>📅 {formatDate(fp.date)}</Text>
                    <Text className={styles.monthlyFpMetaItem}>💰 {formatCost(fp.cost)}</Text>
                    <Text className={styles.monthlyFpMetaItem}>🚶 {fp.duration}h</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyFpList}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyPhotoText}>本月还没有足迹记录</Text>
          </View>
        )}
      </View>

      {/* 底部操作栏 */}
      <View className={styles.footerBar}>
        <Button className={styles.shareBtn} onClick={handleShare}>
          <Text className={styles.shareIcon}>📤</Text>
          <Text>分享报告</Text>
        </Button>
        <Button className={styles.exportBtnMain} onClick={handleExport}>
          导出 PDF 报告
        </Button>
      </View>
    </View>
  )
}

export default MonthlyReportPage
