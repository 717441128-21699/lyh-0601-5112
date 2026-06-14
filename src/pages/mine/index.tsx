import React from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store/useAppStore'
import { memberBenefits } from '@/data/users'
import { formatNumber } from '@/utils'

const MinePage: React.FC = () => {
  const { currentUser } = useAppStore()

  const expProgress = (currentUser.exp / currentUser.expToNextLevel) * 100

  const handleEditProfile = () => {
    console.log('[Mine] 编辑资料')
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  const handleMyFootprints = () => {
    console.log('[Mine] 我的足迹')
    Taro.switchTab({ url: '/pages/footprint/index' })
  }

  const handleMyCollections = () => {
    console.log('[Mine] 我的收藏')
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  const handleMyChallenges = () => {
    console.log('[Mine] 我的挑战')
    Taro.navigateTo({ url: '/pages/challenge-detail/index' })
  }

  const handleMonthlyReport = () => {
    console.log('[Mine] 月度报告')
    Taro.navigateTo({ url: '/pages/monthly-report/index' })
  }

  const handleMemberBenefits = () => {
    console.log('[Mine] 会员权益')
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  const handleSettings = () => {
    console.log('[Mine] 设置')
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  const handleAbout = () => {
    console.log('[Mine] 关于我们')
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  const handleFollowers = () => {
    console.log('[Mine] 粉丝')
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  const handleFollowing = () => {
    console.log('[Mine] 关注')
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  const handleViewProfile = () => {
    console.log('[Mine] 查看个人主页')
    Taro.navigateTo({ url: `/pages/profile/index?id=${currentUser.id}` })
  }

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      {/* 用户信息头部 */}
      <View className={styles.userHeader}>
        <View className={styles.userInfo} onClick={handleEditProfile}>
          <Image
            className={styles.avatar}
            src={currentUser.avatar}
            mode='aspectFill'
            onError={(e) => console.error('[Mine] 头像加载失败:', e)}
          />
          <View className={styles.userText}>
            <Text className={styles.nickname}>{currentUser.nickname}</Text>
            <Text className={styles.bio}>{currentUser.bio}</Text>
          </View>
          <Text className={styles.editIcon}>⚙️</Text>
        </View>

        {/* 会员等级卡片 */}
        <View className={styles.levelCard} onClick={handleMemberBenefits}>
          <View className={styles.levelHeader}>
            <Text className={styles.levelName}>
              <Text className={styles.levelIcon}>🏅</Text>
              Lv.{currentUser.level} {currentUser.levelName}
            </Text>
            <Text className={styles.levelValue}>
              {currentUser.exp}/{currentUser.expToNextLevel} 经验
            </Text>
          </View>
          <View className={styles.levelProgress}>
            <View className={styles.progressBar}>
              <View
                className={styles.progressFill}
                style={{ width: `${expProgress}%` }}
              />
            </View>
            <Text className={styles.progressText}>{Math.round(expProgress)}%</Text>
          </View>
        </View>

        {/* 关注粉丝统计 */}
        <View className={styles.statsRow}>
          <View className={styles.statItem} onClick={handleFollowing}>
            <Text className={styles.statValue}>{currentUser.followingCount}</Text>
            <Text className={styles.statLabel}>关注</Text>
          </View>
          <View className={styles.statItem} onClick={handleFollowers}>
            <Text className={styles.statValue}>{currentUser.followerCount}</Text>
            <Text className={styles.statLabel}>粉丝</Text>
          </View>
          <View className={styles.statItem} onClick={handleViewProfile}>
            <Text className={styles.statValue}>{currentUser.totalFootprints}</Text>
            <Text className={styles.statLabel}>足迹</Text>
          </View>
        </View>
      </View>

      {/* 数据统计卡片 */}
      <View className={styles.statsSection}>
        <View className={styles.statsCard}>
          <View className={styles.statsCardItem}>
            <Text className={styles.statsCardValue}>{currentUser.totalProvinces}</Text>
            <Text className={styles.statsCardLabel}>省份</Text>
          </View>
          <View className={styles.statsCardItem}>
            <Text className={styles.statsCardValue}>{currentUser.totalCities}</Text>
            <Text className={styles.statsCardLabel}>城市</Text>
          </View>
          <View className={styles.statsCardItem}>
            <Text className={styles.statsCardValue}>{currentUser.totalDays}</Text>
            <Text className={styles.statsCardLabel}>天数</Text>
          </View>
          <View className={styles.statsCardItem}>
            <Text className={styles.statsCardValue}>{formatNumber(currentUser.totalDistance)}</Text>
            <Text className={styles.statsCardLabel}>公里</Text>
          </View>
        </View>
      </View>

      {/* 会员权益 */}
      <View className={styles.benefitsSection}>
        <View className={styles.benefitsHeader}>
          <Text className={styles.benefitsTitle}>会员权益</Text>
          <Text className={styles.benefitsMore} onClick={handleMemberBenefits}>
            全部权益 ›
          </Text>
        </View>
        <View className={styles.benefitsGrid}>
          {memberBenefits.slice(0, 4).map(benefit => (
            <View
              key={benefit.id}
              className={classnames(
                styles.benefitItem,
                benefit.level > currentUser.level && styles.locked
              )}
              onClick={handleMemberBenefits}
            >
              <Text className={styles.benefitIcon}>{benefit.icon}</Text>
              <Text className={styles.benefitName}>{benefit.name}</Text>
              <Text className={styles.benefitDesc}>
                {benefit.level > currentUser.level ? `Lv.${benefit.level}解锁` : '已解锁'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 功能菜单 */}
      <View className={styles.menuSection}>
        <View className={styles.menuGroup}>
          <View className={styles.menuItem} onClick={handleMyFootprints}>
            <View className={styles.menuIcon}>📸</View>
            <Text className={styles.menuText}>我的足迹</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={handleMyCollections}>
            <View className={classnames(styles.menuIcon, styles.menuIconOrange)}>⭐</View>
            <Text className={styles.menuText}>我的收藏</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={handleMyChallenges}>
            <View className={classnames(styles.menuIcon, styles.menuIconOrange)}>🏆</View>
            <Text className={styles.menuText}>我的挑战</Text>
            <View className={styles.menuBadge}>3</View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <View className={styles.menuGroup}>
          <View className={styles.menuItem} onClick={handleMonthlyReport}>
            <View className={classnames(styles.menuIcon, styles.menuIconGreen)}>📊</View>
            <Text className={styles.menuText}>月度报告</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={handleMemberBenefits}>
            <View className={classnames(styles.menuIcon, styles.menuIconPurple)}>💎</View>
            <Text className={styles.menuText}>会员中心</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <View className={styles.menuGroup}>
          <View className={styles.menuItem} onClick={handleSettings}>
            <View className={classnames(styles.menuIcon, styles.menuIconPurple)}>⚙️</View>
            <Text className={styles.menuText}>设置</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={handleAbout}>
            <View className={classnames(styles.menuIcon, styles.menuIconOrange)}>ℹ️</View>
            <Text className={styles.menuText}>关于我们</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default MinePage
