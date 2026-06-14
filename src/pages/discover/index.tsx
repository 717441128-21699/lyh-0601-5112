import React, { useState, useMemo } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { mockDestinations, mockRoutes } from '@/data/destinations'
import { mockFootprints } from '@/data/footprints'
import { mockUsers } from '@/data/users'

const categories = [
  { key: 'recommend', label: '推荐' },
  { key: 'hot', label: '热门' },
  { key: 'nature', label: '自然风光' },
  { key: 'culture', label: '历史文化' },
  { key: 'food', label: '美食' },
  { key: 'beach', label: '海滨度假' }
]

const DiscoverPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('recommend')
  const [searchText, setSearchText] = useState('')

  const userFootprints = useMemo(() => {
    return mockFootprints.slice(0, 5).map(f => {
      const user = mockUsers.find(u => u.id === f.userId) || mockUsers[0]
      return { ...f, user }
    })
  }, [])

  const handleCategoryChange = (key: string) => {
    console.log('[Discover] 切换分类:', key)
    setActiveCategory(key)
  }

  const handleDestClick = (id: string) => {
    console.log('[Discover] 点击目的地:', id)
    Taro.navigateTo({ url: `/pages/destination-detail/index?id=${id}` })
  }

  const handleRouteClick = (id: string) => {
    console.log('[Discover] 点击路线:', id)
    Taro.navigateTo({ url: `/pages/destination-detail/index?id=${id}` })
  }

  const handleFootprintClick = (id: string) => {
    console.log('[Discover] 点击足迹:', id)
    Taro.navigateTo({ url: `/pages/footprint-detail/index?id=${id}` })
  }

  const handleUserClick = (userId: string) => {
    console.log('[Discover] 点击用户:', userId)
    Taro.navigateTo({ url: `/pages/profile/index?id=${userId}` })
  }

  const handleSearch = () => {
    console.log('[Discover] 搜索:', searchText)
    Taro.showToast({ title: '搜索功能开发中', icon: 'none' })
  }

  const getDifficultyText = (difficulty: string) => {
    const map: Record<string, string> = {
      easy: '简单',
      medium: '中等',
      hard: '挑战'
    }
    return map[difficulty] || difficulty
  }

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      {/* 搜索栏 */}
      <View className={styles.searchBar}>
        <View className={styles.searchInput} onClick={handleSearch}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchText}>搜索目的地、攻略、用户</Text>
        </View>
      </View>

      {/* 分类标签 */}
      <ScrollView scrollX className={styles.categoryTabs} showScrollbar={false}>
        {categories.map(cat => (
          <View
            key={cat.key}
            className={classnames(styles.categoryTab, activeCategory === cat.key && styles.active)}
            onClick={() => handleCategoryChange(cat.key)}
          >
            <Text>{cat.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 热门目的地 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>热门目的地</Text>
          <Text className={styles.sectionMore}>更多 ›</Text>
        </View>
        <ScrollView scrollX className={styles.destScroll} showScrollbar={false}>
          {mockDestinations.slice(0, 6).map(dest => (
            <View
              key={dest.id}
              className={styles.destCard}
              onClick={() => handleDestClick(dest.id)}
            >
              <Image
                className={styles.destCardImage}
                src={dest.image}
                mode='aspectFill'
                onError={(e) => console.error('[Discover] 目的地图片加载失败:', e)}
              />
              <View className={styles.destCardInfo}>
                <Text className={styles.destCardName}>{dest.name}</Text>
                <Text className={styles.destCardLocation}>{dest.city}</Text>
                <View className={styles.destCardBottom}>
                  <Text className={styles.destCardRating}>⭐ {dest.rating}</Text>
                  <Text className={styles.destCardCost}>¥{dest.costLevel * 500}起</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 精选路线 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>精选路线</Text>
          <Text className={styles.sectionMore}>更多 ›</Text>
        </View>
        <View className={styles.routeSection}>
          {mockRoutes.slice(0, 3).map(route => (
            <View
              key={route.id}
              className={styles.routeCard}
              onClick={() => handleRouteClick(route.id)}
            >
              <Image
                className={styles.routeImage}
                src={route.image}
                mode='aspectFill'
                onError={(e) => console.error('[Discover] 路线图片加载失败:', e)}
              />
              <View className={styles.routeInfo}>
                <View>
                  <Text className={styles.routeTitle}>{route.title}</Text>
                  <Text className={styles.routeMeta}>
                    {route.destinations.join(' → ')}
                  </Text>
                  <View className={styles.routeTags}>
                    {route.tags.slice(0, 2).map((tag, idx) => (
                      <Text key={idx} className={styles.routeTag}>{tag}</Text>
                    ))}
                  </View>
                </View>
                <View className={styles.routeBottom}>
                  <View style={{ display: 'flex', alignItems: 'center' }}>
                    <View className={classnames(styles.difficultyTag, styles[route.difficulty])}>
                      <Text>{getDifficultyText(route.difficulty)}</Text>
                    </View>
                    <Text className={styles.routeDays}>{route.days}天</Text>
                  </View>
                  <Text className={styles.routeCost}>¥{route.estimatedCost}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 好友动态 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>旅行达人</Text>
          <Text className={styles.sectionMore}>更多 ›</Text>
        </View>
        <View className={styles.feedList}>
          {userFootprints.map(footprint => (
            <View key={footprint.id} className={styles.feedCard}>
              <View className={styles.feedHeader}>
                <Image
                  className={styles.feedAvatar}
                  src={footprint.user.avatar}
                  mode='aspectFill'
                  onClick={() => handleUserClick(footprint.userId)}
                  onError={(e) => console.error('[Discover] 头像加载失败:', e)}
                />
                <View className={styles.feedUserInfo}>
                  <Text className={styles.feedNickname}>{footprint.user.nickname}</Text>
                  <Text className={styles.feedTime}>
                    Lv.{footprint.user.level} {footprint.user.levelName}
                  </Text>
                </View>
              </View>

              <View
                className={styles.feedContent}
                onClick={() => handleFootprintClick(footprint.id)}
              >
                <Text className={styles.feedTitle}>{footprint.title}</Text>
                <Text className={styles.feedDesc}>{footprint.content}</Text>
              </View>

              {footprint.photos.length > 0 && (
                <View
                  className={classnames(
                    styles.feedImages,
                    footprint.photos.length === 1 && styles.feedImagesOne,
                    footprint.photos.length === 2 && styles.feedImagesTwo
                  )}
                  onClick={() => handleFootprintClick(footprint.id)}
                >
                  {footprint.photos.slice(0, 3).map((photo, idx) => (
                    <Image
                      key={idx}
                      className={styles.feedImage}
                      src={photo}
                      mode='aspectFill'
                      onError={(e) => console.error('[Discover] 足迹图片加载失败:', e)}
                    />
                  ))}
                </View>
              )}

              <View className={styles.feedLocation}>
                <Text className={styles.feedLocationIcon}>📍</Text>
                <Text>{footprint.location.name}</Text>
              </View>

              <View className={styles.feedFooter}>
                <View className={styles.feedTags}>
                  {footprint.tags.slice(0, 2).map((tag, idx) => (
                    <Text key={idx} className={styles.feedTag}>{tag}</Text>
                  ))}
                </View>
                <View className={styles.feedActions}>
                  <View className={classnames(styles.feedAction, footprint.isLiked && styles.liked)}>
                    <Text className={styles.feedActionIcon}>
                      {footprint.isLiked ? '❤️' : '🤍'}
                    </Text>
                    <Text>{footprint.likes}</Text>
                  </View>
                  <View className={styles.feedAction}>
                    <Text className={styles.feedActionIcon}>💬</Text>
                    <Text>{footprint.comments}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default DiscoverPage
