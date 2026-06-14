import React, { useMemo, useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store/useAppStore'
import type { Footprint } from '@/types/footprint'
import { formatDateCN, formatDistance } from '@/utils'

const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'year_2024', label: '2024年' },
  { key: 'year_2023', label: '2023年' }
]

const FootprintPage: React.FC = () => {
  const { footprints, toggleLike } = useAppStore()
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredFootprints = useMemo(() => {
    if (activeFilter === 'all') return footprints
    const targetYear = parseInt(activeFilter.replace('year_', ''))
    return footprints.filter(f => {
      const date = new Date(f.date)
      return date.getFullYear() === targetYear
    })
  }, [footprints, activeFilter])

  const groupedFootprints = useMemo(() => {
    const groups: Record<string, Footprint[]> = {}
    filteredFootprints.forEach(f => {
      const date = new Date(f.date)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(f)
    })
    return Object.entries(groups)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, items]) => {
        const [year, month] = key.split('-')
        return {
          key,
          year: parseInt(year),
          month: parseInt(month),
          items
        }
      })
  }, [filteredFootprints])

  const yearGroups = useMemo(() => {
    const groups: Record<number, typeof groupedFootprints> = {}
    groupedFootprints.forEach(g => {
      if (!groups[g.year]) {
        groups[g.year] = []
      }
      groups[g.year].push(g)
    })
    return Object.entries(groups)
      .sort((a, b) => b[0] - a[0])
      .map(([year, months]) => ({
        year: parseInt(year),
        months,
        totalCount: months.reduce((sum, m) => sum + m.items.length, 0)
      }))
  }, [groupedFootprints])

  const filterYear = useMemo(() => {
    if (activeFilter.startsWith('year_')) {
      return parseInt(activeFilter.replace('year_', ''))
    }
    return null
  }, [activeFilter])

  const handleFilterChange = (key: string) => {
    console.log('[Footprint] 切换筛选:', key)
    setActiveFilter(key)
  }

  const handleFootprintClick = (id: string) => {
    console.log('[Footprint] 点击足迹:', id)
    Taro.navigateTo({ url: `/pages/footprint-detail/index?id=${id}` })
  }

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    console.log('[Footprint] 点赞:', id)
    toggleLike(id)
  }

  const handleAddFootprint = () => {
    console.log('[Footprint] 添加足迹')
    Taro.navigateTo({ url: '/pages/add-footprint/index' })
  }

  return (
    <View className={styles.pageContainer}>
      {/* 筛选栏 */}
      <View className={styles.filterBar}>
        {filterOptions.map(opt => (
          <View
            key={opt.key}
            className={classnames(styles.filterItem, activeFilter === opt.key && styles.active)}
            onClick={() => handleFilterChange(opt.key)}
          >
            <Text>{opt.label}</Text>
          </View>
        ))}
      </View>

      {filteredFootprints.length > 0 ? (
        <ScrollView scrollY className={styles.timelineContainer}>
          {yearGroups.map(yearGroup => (
            <View key={yearGroup.year} className={styles.yearSection}>
              <View className={styles.yearHeader}>
                <Text className={styles.yearText}>{yearGroup.year}</Text>
                <Text className={styles.yearCount}>{yearGroup.totalCount}个足迹</Text>
              </View>

              {yearGroup.months.map(monthGroup => (
                <View key={monthGroup.key} className={styles.monthSection}>
                  <View className={styles.monthHeader}>
                    <Text className={styles.monthText}>{monthGroup.month}月</Text>
                    <Text className={styles.monthCount}>{monthGroup.items.length}篇</Text>
                  </View>

                  {monthGroup.items.map(footprint => (
                    <View
                      key={footprint.id}
                      className={styles.footprintCard}
                      onClick={() => handleFootprintClick(footprint.id)}
                    >
                      <View className={styles.cardImageWrap}>
                        <Image
                          className={styles.cardImage}
                          src={footprint.photos[0]}
                          mode='aspectFill'
                          onError={(e) => console.error('[Footprint] 图片加载失败:', e)}
                        />
                        {footprint.photos.length > 1 && (
                          <View className={styles.photoCount}>
                            <Text>📷 {footprint.photos.length}</Text>
                          </View>
                        )}
                      </View>

                      <View className={styles.cardContent}>
                        <Text className={styles.cardTitle}>{footprint.title}</Text>

                        <View className={styles.cardLocation}>
                          <Text className={styles.locationIcon}>📍</Text>
                          <Text className={styles.locationText}>
                            {footprint.location.name}
                          </Text>
                        </View>

                        <Text className={styles.cardDate}>
                          {formatDateCN(footprint.date)} · {footprint.duration}小时
                        </Text>

                        <View className={styles.cardTags}>
                          {footprint.tags.slice(0, 3).map((tag, idx) => (
                            <Text key={idx} className={styles.cardTag}>{tag}</Text>
                          ))}
                        </View>

                        <View className={styles.cardMeta}>
                          <View className={styles.metaLeft}>
                            <View
                              className={classnames(
                                styles.metaItem,
                                footprint.isLiked && styles.metaLiked
                              )}
                              onClick={(e) => handleLike(e, footprint.id)}
                            >
                              <Text className={styles.metaIcon}>
                                {footprint.isLiked ? '❤️' : '🤍'}
                              </Text>
                              <Text>{footprint.likes}</Text>
                            </View>
                            <View className={styles.metaItem}>
                              <Text className={styles.metaIcon}>💬</Text>
                              <Text>{footprint.comments}</Text>
                            </View>
                          </View>
                          <Text className={styles.metaDistance}>
                            {formatDistance(footprint.distance)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📸</Text>
          <Text className={styles.emptyText}>
            {filterYear ? `${filterYear}年还没有旅行足迹，快去记录吧~` : '还没有旅行足迹，快去记录吧~'}
          </Text>
          <Button
            className={styles.emptyButton}
            onClick={handleAddFootprint}
          >
            记录足迹
          </Button>
        </View>
      )}

      {/* 悬浮添加按钮 */}
      <View className={styles.fabButton} onClick={handleAddFootprint}>
        <Text>+</Text>
      </View>
    </View>
  )
}

export default FootprintPage
