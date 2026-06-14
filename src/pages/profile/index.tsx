import React, { useMemo, useState } from 'react'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { mockUsers, getUserById } from '@/data/users'
import { getFootprintsByUserId } from '@/data/footprints'
import { useAppStore } from '@/store/useAppStore'
import { formatDate, formatCost, formatNumber } from '@/utils'

const landscapeIds = [1015, 1018, 1036, 1039, 1044]

type FilterType = 'all' | 'year' | 'city'

const ProfilePage: React.FC = () => {
  const router = useRouter()
  const {
    currentUser: storeCurrentUser,
    footprints: storeFootprints,
    social,
    toggleFollow,
    isFollowing,
    toggleLike
  } = useAppStore()

  const userId = router.params.id || 'u1'
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectedCity, setSelectedCity] = useState<string>('')

  const isSelf = userId === storeCurrentUser.id

  const targetUser = useMemo(() => {
    if (isSelf) return storeCurrentUser
    const found = getUserById(userId)
    if (found) return found
    return mockUsers[1]
  }, [userId, isSelf, storeCurrentUser])

  const allUserFootprints = useMemo(() => {
    if (isSelf) {
      return storeFootprints
    }
    return getFootprintsByUserId(targetUser.id)
  }, [isSelf, targetUser.id, storeFootprints])

  const availableCities = useMemo(() => {
    const citySet = new Set(allUserFootprints.map(f => f.location.city))
    return Array.from(citySet)
  }, [allUserFootprints])

  const filteredFootprints = useMemo(() => {
    let result = [...allUserFootprints]

    if (activeFilter === 'year') {
      const currentYear = new Date().getFullYear()
      result = result.filter(f => new Date(f.date).getFullYear() === currentYear)
    } else if (activeFilter === 'city' && selectedCity) {
      result = result.filter(f => f.location.city === selectedCity)
    }

    return result
  }, [allUserFootprints, activeFilter, selectedCity])

  const displayFootprints = useMemo(() => {
    return filteredFootprints.slice(0, 10)
  }, [filteredFootprints])

  const userStats = useMemo(() => {
    const u = targetUser
    return {
      avgCostPerFootprint: u.totalFootprints > 0
        ? Math.round(u.totalCost / u.totalFootprints)
        : 0,
      avgDistancePerFootprint: u.totalFootprints > 0
        ? Math.round(u.totalDistance / u.totalFootprints)
        : 0,
      avgDaysPerMonth: 12,
      levelProgress: u.expToNextLevel > 0
        ? Math.min(100, Math.round((u.exp / u.expToNextLevel) * 100))
        : 100,
      popularTags: ['自然风光', '摄影', '美食', '历史文化', '徒步']
    }
  }, [targetUser])

  const mapDots = useMemo(() => {
    const count = Math.min(allUserFootprints.length, 8)
    return Array.from({ length: count }, (_, i) => ({
      left: 15 + (i * 11) % 80,
      top: 20 + (i * 17) % 60,
      accent: i % 2 === 0
    }))
  }, [allUserFootprints.length])

  const isFollowingTarget = useMemo(() => {
    return isFollowing(targetUser.id)
  }, [social.followingUserIds, targetUser.id, isFollowing])

  useDidShow(() => {
    console.log('[Profile] 页面显示, userId:', userId)
  })

  const handleBack = () => {
    Taro.navigateBack().catch(() => Taro.switchTab({ url: '/pages/discover/index' }))
  }

  const handleFollow = () => {
    if (isSelf) return
    toggleFollow(targetUser.id)
    Taro.showToast({
      title: isFollowingTarget ? '已取消关注' : '关注成功',
      icon: 'success'
    })
  }

  const handleFootprintClick = (fpId: string) => {
    Taro.navigateTo({ url: `/pages/footprint-detail/index?id=${fpId}` })
  }

  const handleLike = (e: any, fpId: string) => {
    e.stopPropagation()
    toggleLike(fpId)
  }

  const handleShare = () => {
    Taro.showToast({ title: '分享功能开发中', icon: 'none' })
  }

  const handleViewAllFootprints = () => {
    if (isSelf) {
      Taro.switchTab({ url: '/pages/footprint/index' })
    } else {
      Taro.showToast({ title: `查看 ${targetUser.nickname} 的全部足迹`, icon: 'none' })
    }
  }

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
    if (filter === 'city' && availableCities.length > 0 && !selectedCity) {
      setSelectedCity(availableCities[0])
    }
  }

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
  }

  const displayFollowerCount = useMemo(() => {
    if (isSelf) return targetUser.followerCount
    const base = targetUser.followerCount
    return isFollowingTarget ? base : base
  }, [targetUser.followerCount, isFollowingTarget, isSelf])

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      {/* Hero区 */}
      <View className={styles.hero}>
        <Image
          className={styles.heroBg}
          src={`https://picsum.photos/id/${landscapeIds[Math.abs(targetUser.id.charCodeAt(1) % landscapeIds.length)]}/750/500`}
          mode='aspectFill'
        />
        <View className={styles.heroOverlay} />

        <View className={styles.heroHeader}>
          <View className={styles.backBtn} onClick={handleBack}>
            <Text className={styles.backIcon}>‹</Text>
          </View>
          <View className={styles.shareBtn} onClick={handleShare}>
            <Text className={styles.shareIcon}>↗</Text>
          </View>
        </View>

        <View className={styles.heroContent}>
          <View className={styles.userInfoRow}>
            <Image
              className={styles.avatar}
              src={targetUser.avatar}
              mode='aspectFill'
            />
            <View className={styles.userText}>
              <View className={styles.userNameRow}>
                <Text className={styles.userName}>{targetUser.nickname}</Text>
                <View className={styles.levelBadge}>
                  <Text className={styles.levelIcon}>⭐</Text>
                  <Text>Lv.{targetUser.level} {targetUser.levelName}</Text>
                </View>
              </View>
              <Text className={styles.userBio}>{targetUser.bio}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 统计数据 */}
      <View className={styles.statCards}>
        <View className={styles.statGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{targetUser.totalFootprints}</Text>
            <Text className={styles.statLabel}>足迹</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {targetUser.totalDistance >= 1000
                ? `${(targetUser.totalDistance / 1000).toFixed(1)}k`
                : targetUser.totalDistance
            }
            <Text className={styles.statCardUnit}> km</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{targetUser.totalProvinces}</Text>
            <Text className={styles.statLabel}>省份</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{targetUser.totalCities}</Text>
            <Text className={styles.statLabel}>城市</Text>
          </View>
        </View>
        <View className={styles.expSection}>
          <View className={styles.expRow}>
            <Text className={styles.expText}>会员成长值</Text>
            <Text className={styles.expValue}>
              {formatNumber(targetUser.exp)} / {formatNumber(targetUser.expToNextLevel)}</Text>
          </View>
          <View className={styles.expBar}>
            <View
              className={styles.expFill}
              style={{ width: `${userStats.levelProgress}%` }}
            />
          </View>
        </View>
      </View>

      {/* 粉丝关注 */}
      <View className={styles.socialRow}>
        <View className={styles.socialCard}>
          <Text className={styles.socialValue}>{formatNumber(displayFollowerCount)}</Text>
          <Text className={styles.socialLabel}>粉丝</Text>
        </View>
        <View className={styles.socialCard}>
          <Text className={styles.socialValue}>{formatNumber(targetUser.followingCount)}</Text>
          <Text className={styles.socialLabel}>关注</Text>
        </View>
        <View className={styles.socialCard}>
          <Text className={styles.socialValue}>{targetUser.totalDays}</Text>
          <Text className={styles.socialLabel}>旅行天数</Text>
        </View>
      </View>

      {/* 操作按钮 */}
      {!isSelf && (
        <View className={styles.actionSection}>
          <Button
            className={classnames(
              styles.actionBtn,
              isFollowingTarget ? styles.secondary : styles.primary
            )}
            onClick={handleFollow}
          >
            <Text className={styles.actionIcon}>
              {isFollowingTarget ? '✓' : '+'}
            </Text>
            <Text>{isFollowingTarget ? '已关注' : '关注TA'}</Text>
          </Button>
          <Button
            className={classnames(styles.actionBtn, styles.secondary)}
            onClick={() => Taro.showToast({ title: '私信功能开发中', icon: 'none' })}
          >
            <Text className={styles.actionIcon}>💬</Text>
            <Text>私信</Text>
          </Button>
        </View>
      )}

      {isSelf && (
        <View className={styles.actionSection}>
          <Button className={classnames(styles.actionBtn, styles.accent)} onClick={handleShare}>
            <Text className={styles.actionIcon}>🎖️</Text>
            <Text>我的等级权益</Text>
          </Button>
          <Button
            className={classnames(styles.actionBtn, styles.secondary)}
            onClick={() => Taro.switchTab({ url: '/pages/mine/index' })}
          >
            <Text className={styles.actionIcon}>⚙️</Text>
            <Text>个人设置</Text>
          </Button>
        </View>
      )}

      {/* 足迹概览地图 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>🗺️</Text>
          <Text>足迹地图</Text>
        </View>
        <View className={styles.mapPreview}>
          <View className={styles.mapDots}>
            {mapDots.map((dot, idx) => (
              <View
                key={idx}
                className={classnames(styles.mapDot, dot.accent && styles.accent)}
                style={{ left: `${dot.left}%`, top: `${dot.top}%` }}
              />
            ))}
          </View>
          <Text className={styles.mapIcon}>📍</Text>
          <Text className={styles.mapText}>
            足迹已覆盖 {targetUser.totalProvinces} 个省份，{targetUser.totalCities} 座城市
          </Text>
        </View>
      </View>

      {/* 旅行数据概览 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📊</Text>
          <Text>旅行数据概览</Text>
        </View>
        <View className={styles.detailGrid}>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>
              <Text className={styles.detailLabelIcon}>📅</Text>
              <Text>累计旅行天数</Text>
            </Text>
            <Text className={classnames(styles.detailValue, styles.detailValueHighlight)}>
              {targetUser.totalDays} 天</Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>
              <Text className={styles.detailLabelIcon}>💰</Text>
              <Text>累计花费总额</Text>
            </Text>
            <Text className={classnames(styles.detailValue, styles.detailValueAccent)}>
              {formatCost(targetUser.totalCost)}
            </Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>
              <Text className={styles.detailLabelIcon}>💳</Text>
              <Text>单次平均花费</Text>
            </Text>
            <Text className={styles.detailValue}>
              {formatCost(userStats.avgCostPerFootprint)}</Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>
              <Text className={styles.detailLabelIcon}>🚗</Text>
              <Text>单次平均里程</Text>
            </Text>
            <Text className={styles.detailValue}>
              {userStats.avgDistancePerFootprint} km
            </Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>
              <Text className={styles.detailLabelIcon}>🏙️</Text>
              <Text>最喜欢的标签</Text>
            </Text>
            <Text className={styles.detailValue}>
              {userStats.popularTags.slice(0, 2).join('、')}
            </Text>
          </View>
        </View>
      </View>

      {/* 最新足迹 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Text className={styles.sectionIcon}>📸</Text>
            <Text>{isSelf ? '我的足迹' : 'TA的足迹'}</Text>
          </View>
          <Text
            className={styles.detailValue}
            style={{ fontSize: '24rpx', color: '#86909C', fontWeight: 'normal', marginLeft: 'auto' }}
            onClick={handleViewAllFootprints}
          >
            查看全部 ›
          </Text>
        </View>

        {/* 筛选条 */}
        <View className={styles.filterBar}>
          <View
            className={classnames(styles.filterItem, activeFilter === 'all' && styles.active)}
            onClick={() => handleFilterChange('all')}
          >
            <Text>全部</Text>
          </View>
          <View
            className={classnames(styles.filterItem, activeFilter === 'year' && styles.active)}
            onClick={() => handleFilterChange('year')}
          >
            <Text>今年</Text>
          </View>
          {availableCities.length > 0 && (
            <View
              className={classnames(styles.filterItem, activeFilter === 'city' && styles.active)}
              onClick={() => handleFilterChange('city')}
            >
              <Text>按城市</Text>
            </View>
          )}
        </View>

        {/* 城市子筛选 */}
        {activeFilter === 'city' && availableCities.length > 0 && (
          <ScrollView scrollX className={styles.cityFilterBar}>
            {availableCities.map(city => (
              <View
                key={city}
                className={classnames(styles.cityChip, selectedCity === city && styles.cityChipActive)}
                onClick={() => handleCityChange(city)}
              >
                <Text>{city}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* 足迹列表 */}
        {displayFootprints.length > 0 ? (
          <View className={styles.footprintList}>
            {displayFootprints.map(fp => (
              <View
                key={fp.id}
                className={styles.footprintCard}
                onClick={() => handleFootprintClick(fp.id)}
              >
                <Image
                  className={styles.footprintImage}
                  src={fp.photos[0]}
                  mode='aspectFill'
                />
                <View className={styles.footprintContent}>
                  <Text className={styles.footprintTitle}>{fp.title}</Text>
                  <Text className={styles.footprintLocation}>
                    📍 {fp.location.province} · {fp.location.city}
                  </Text>
                  <View className={styles.footprintMeta}>
                    <View className={styles.metaItem}>
                      <Text className={styles.metaIcon}>📅</Text>
                      <Text>{formatDate(fp.date)}</Text>
                    </View>
                    <View
                      className={classnames(styles.metaItem, styles.likeItem)}
                      onClick={(e) => handleLike(e, fp.id)}
                    >
                      <Text className={classnames(styles.metaIcon, fp.isLiked && styles.liked)}>
                        {fp.isLiked ? '❤️' : '🤍'}
                      </Text>
                      <Text>{fp.likes}</Text>
                    </View>
                    <View className={styles.metaItem}>
                      <Text className={styles.metaIcon}>💬</Text>
                      <Text>{fp.comments}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🏞️</Text>
            <Text className={styles.emptyText}>
              {isSelf
                ? '还没有足迹，去记录你的第一次旅行吧~'
                : activeFilter === 'year'
                  ? `${targetUser.nickname} 今年还没有足迹`
                  : activeFilter === 'city'
                    ? `${selectedCity} 还没有足迹记录`
                    : `${targetUser.nickname} 还没有公开的足迹`
              }
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default ProfilePage
