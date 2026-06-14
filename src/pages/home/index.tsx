import React, { useMemo } from 'react'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { useAppStore } from '@/store/useAppStore'
import { mockDestinations } from '@/data/destinations'
import { formatNumber, formatDistance } from '@/utils'

const HomePage: React.FC = () => {
  const { currentUser, footprints } = useAppStore()

  const recommendedDests = useMemo(() => {
    return mockDestinations.slice(0, 4)
  }, [])

  const mapMarkers = useMemo(() => {
    return footprints.slice(0, 6).map((f, i) => ({
      id: f.id,
      left: `${15 + (i * 15) % 70}%`,
      top: `${20 + (i * 12) % 60}%`
    }))
  }, [footprints])

  const handleAddFootprint = () => {
    console.log('[Home] 点击添加足迹')
    Taro.navigateTo({ url: '/pages/add-footprint/index' })
  }

  const handleGoStats = () => {
    console.log('[Home] 点击查看统计')
    Taro.switchTab({ url: '/pages/stats/index' })
  }

  const handleGoChallenge = () => {
    console.log('[Home] 点击查看挑战')
    Taro.navigateTo({ url: '/pages/challenge-detail/index' })
  }

  const handleGoReport = () => {
    console.log('[Home] 点击月度报告')
    Taro.navigateTo({ url: '/pages/monthly-report/index' })
  }

  const handleDestClick = (id: string) => {
    console.log('[Home] 点击目的地:', id)
    Taro.navigateTo({ url: `/pages/destination-detail/index?id=${id}` })
  }

  const handleUserClick = () => {
    console.log('[Home] 点击用户头像')
    Taro.switchTab({ url: '/pages/mine/index' })
  }

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      {/* 顶部Header */}
      <View className={styles.header}>
        <View className={styles.userInfo} onClick={handleUserClick}>
          <Image
            className={styles.avatar}
            src={currentUser.avatar}
            mode='aspectFill'
            onError={(e) => console.error('[Home] 头像加载失败:', e)}
          />
          <View className={styles.userText}>
            <Text className={styles.nickname}>{currentUser.nickname}</Text>
            <View className={styles.levelBadge}>
              <Text>Lv.{currentUser.level} {currentUser.levelName}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 数据统计卡片 */}
      <View className={styles.statsCard}>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{currentUser.totalProvinces}</Text>
            <Text className={styles.statLabel}>省份</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{currentUser.totalCities}</Text>
            <Text className={styles.statLabel}>城市</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatNumber(currentUser.totalDistance)}</Text>
            <Text className={styles.statLabel}>总里程(km)</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{currentUser.totalFootprints}</Text>
            <Text className={styles.statLabel}>足迹</Text>
          </View>
        </View>
      </View>

      {/* 地图区域 */}
      <View className={styles.mapSection}>
        <View className={styles.mapHeader}>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Text className={styles.mapTitle}>我的足迹地图</Text>
            <Text className={styles.mapSubtitle}>{footprints.length}个足迹</Text>
          </View>
        </View>
        <View className={styles.mapView}>
          <View className={styles.mapPlaceholder}>
            <Text className={styles.mapIcon}>🗺️</Text>
            <Text className={styles.mapText}>足迹遍布大江南北</Text>
          </View>
          <View className={styles.mapMarkers}>
            {mapMarkers.map((marker) => (
              <View
                key={marker.id}
                className={styles.marker}
                style={{ left: marker.left, top: marker.top }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* 快捷入口 */}
      <View className={styles.quickActions}>
        <View className={styles.sectionTitle}>
          <Text className={styles.titleText}>快捷功能</Text>
        </View>
        <View className={styles.actionGrid}>
          <View className={styles.actionItem} onClick={handleAddFootprint}>
            <View className={styles.actionIcon}>📝</View>
            <Text className={styles.actionLabel}>添加足迹</Text>
          </View>
          <View className={styles.actionItem} onClick={handleGoChallenge}>
            <View className={`${styles.actionIcon} ${styles.actionOrange}`}>🏆</View>
            <Text className={styles.actionLabel}>旅行挑战</Text>
          </View>
          <View className={styles.actionItem} onClick={handleGoReport}>
            <View className={`${styles.actionIcon} ${styles.actionGreen}`}>📊</View>
            <Text className={styles.actionLabel}>月度报告</Text>
          </View>
          <View className={styles.actionItem} onClick={handleGoStats}>
            <View className={`${styles.actionIcon} ${styles.actionPurple}`}>📈</View>
            <Text className={styles.actionLabel}>数据统计</Text>
          </View>
        </View>
      </View>

      {/* 推荐目的地 */}
      <View className={styles.recommendSection}>
        <View className={styles.recommendHeader}>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Text className={styles.recommendTitle}>为你推荐</Text>
            <View className={styles.recommendTag}>
              <Text>智能推荐</Text>
            </View>
          </View>
          <Text className={styles.moreText}>查看更多</Text>
        </View>

        <View className={styles.destList}>
          {recommendedDests.map((dest) => (
            <View
              key={dest.id}
              className={styles.destCard}
              onClick={() => handleDestClick(dest.id)}
            >
              <Image
                className={styles.destImage}
                src={dest.image}
                mode='aspectFill'
                onError={(e) => console.error('[Home] 目的地图片加载失败:', e)}
              />
              <View className={styles.destInfo}>
                <View className={styles.destNameRow}>
                  <Text className={styles.destName}>{dest.name}</Text>
                  <View className={styles.destRating}>
                    <Text className={styles.starIcon}>⭐</Text>
                    <Text>{dest.rating}</Text>
                  </View>
                </View>
                <Text className={styles.destLocation}>
                  {dest.province} · {dest.city}
                </Text>
                <View className={styles.destTags}>
                  {dest.tags.slice(0, 3).map((tag, idx) => (
                    <Text key={idx} className={styles.destTag}>{tag}</Text>
                  ))}
                </View>
                <View className={styles.destBottom}>
                  <Text className={styles.destDistance}>
                    {formatDistance(dest.distance)}
                  </Text>
                  <Text className={styles.destCost}>
                    ¥{dest.costLevel * 500}起
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default HomePage
