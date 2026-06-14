import React, { useMemo } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useRouter, eventCenter, getCurrentInstance } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { mockChallenges, getChallengeById, mockChallengeRank } from '@/data/challenges'
import { useAppStore } from '@/store/useAppStore'
import type { Challenge } from '@/types/challenge'
import { formatDateCN, formatNumber } from '@/utils'

const ChallengeDetailPage: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useAppStore()
  const challengeId = router.params.id || 'c1'

  const challenge: Challenge | undefined = useMemo(() => {
    const found = getChallengeById(challengeId)
    return found || mockChallenges[0]
  }, [challengeId])

  if (!challenge) {
    return (
      <View className={styles.pageContainer}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🔍</Text>
          <Text className={styles.emptyText}>挑战不存在或已结束</Text>
          <Button className={styles.actionBtn} onClick={() => Taro.navigateBack()}>
            返回上一页
          </Button>
        </View>
      </View>
    )
  }

  const isCompleted = challenge.progress >= 100
  const daysLeft = useMemo(() => {
    const now = new Date().getTime()
    const end = new Date(challenge.endDate).getTime()
    return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)))
  }, [challenge.endDate])

  const handleBack = () => {
    Taro.navigateBack().catch(() => Taro.switchTab({ url: '/pages/home/index' }))
  }

  const handleShare = () => {
    Taro.showToast({ title: '分享功能开发中', icon: 'none' })
  }

  const handleAction = () => {
    if (isCompleted) {
      Taro.showModal({
        title: '🎉 恭喜完成挑战！',
        content: `你已完成"${challenge.title}"，奖励将发放至账户：\n${challenge.rewards.join('、')}`,
        showCancel: false,
        confirmText: '好的'
      })
    } else {
      Taro.showActionSheet({
        itemList: ['去记录新足迹', '查看我的足迹列表'],
        success: (res) => {
          if (res.tapIndex === 0) {
            Taro.navigateTo({ url: '/pages/add-footprint/index' })
          } else if (res.tapIndex === 1) {
            Taro.switchTab({ url: '/pages/footprint/index' })
          }
        }
      })
    }
  }

  const handleUserClick = (userId: string) => {
    Taro.navigateTo({ url: `/pages/profile/index?id=${userId}` })
  }

  return (
    <View className={styles.pageContainer}>
      {/* Hero封面 */}
      <View className={styles.hero}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text className={styles.backIcon}>‹</Text>
        </View>
        <Image
          className={styles.heroImage}
          src={challenge.image}
          mode='aspectFill'
        />
        <View className={styles.heroOverlay} />
        <View className={styles.heroContent}>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Text className={styles.heroBadge}>
              {challenge.type === 'province' && '🗺️ 省份挑战'}
              {challenge.type === 'city' && '�️ 城市挑战'}
              {challenge.type === 'distance' && '🚗 里程挑战'}
              {challenge.type === 'footprint' && '📸 足迹挑战'}
              {challenge.type === 'days' && '📅 天数挑战'}
            </Text>
            <Text className={styles.statusBadge}>
              {challenge.status === 'ongoing' && '进行中'}
              {challenge.status === 'completed' && '已完成'}
              {challenge.status === 'expired' && '已结束'}
            </Text>
          </View>
          <Text className={styles.heroTitle}>{challenge.title}</Text>
          <Text className={styles.heroDesc}>{challenge.description}</Text>
        </View>
      </View>

      {/* 进度卡片 */}
      <View className={styles.progressSection}>
        <View className={styles.progressRow}>
          <View>
            <Text className={classnames(styles.progressValue, isCompleted && styles.completed)}>
              {challenge.progress.toFixed(1)}%
            </Text>
          </View>
          <Text className={styles.progressTarget}>
            目标 {challenge.target} {challenge.unit}
          </Text>
        </View>
        <View className={styles.progressBarWrap}>
          <View
            className={classnames(styles.progressBar, isCompleted && styles.completed)}
            style={{ width: `${Math.min(100, challenge.progress)}%` }}
          />
        </View>
        <View className={styles.progressMeta}>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>✅</Text>
            <Text>已完成 {challenge.current} {challenge.unit}</Text>
          </View>
          <View className={styles.metaDivider} />
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>⏰</Text>
            <Text>剩余 {daysLeft} 天</Text>
          </View>
          <View className={styles.metaDivider} />
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>👥</Text>
            <Text>{formatNumber(challenge.participants)} 人参与</Text>
          </View>
        </View>
      </View>

      {/* 挑战说明 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📖</Text>
          <Text>挑战说明</Text>
        </View>
        <View className={styles.infoContent}>
          <Text className={styles.descText}>{challenge.description}</Text>
          <View className={styles.infoGrid}>
            <View className={styles.infoCard}>
              <Text className={styles.infoCardLabel}>当前进度</Text>
              <Text className={styles.infoCardValue}>
                {challenge.current}
                <Text className={styles.infoCardUnit}> {challenge.unit}</Text>
              </Text>
            </View>
            <View className={styles.infoCard}>
              <Text className={styles.infoCardLabel}>目标数量</Text>
              <Text className={styles.infoCardValue}>
                {challenge.target}
                <Text className={styles.infoCardUnit}> {challenge.unit}</Text>
              </Text>
            </View>
            <View className={styles.infoCard}>
              <Text className={styles.infoCardLabel}>开始日期</Text>
              <Text className={styles.infoCardValue} style={{ fontSize: '28rpx' }}>
                {formatDateCN(challenge.startDate)}
              </Text>
            </View>
            <View className={styles.infoCard}>
              <Text className={styles.infoCardLabel}>结束日期</Text>
              <Text className={styles.infoCardValue} style={{ fontSize: '28rpx' }}>
                {formatDateCN(challenge.endDate)}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: '24rpx' }}>
            <View className={styles.statLine}>
              <Text className={styles.statLabel}>参与人数</Text>
              <Text className={styles.statValue}>{formatNumber(challenge.participants)} 人</Text>
            </View>
            <View className={styles.statLine}>
              <Text className={styles.statLabel}>我的排名</Text>
              <Text className={styles.statValue}>
                第 {mockChallengeRank.findIndex(r => r.userId === currentUser.id) + 1 || '--'} 名
              </Text>
            </View>
            <View className={styles.statLine}>
              <Text className={styles.statLabel}>超越用户</Text>
              <Text className={styles.statValue}>
                {challenge.participants > 0
                  ? `${Math.round(challenge.progress / 2)}%`
                  : '--'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 挑战奖励 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>🎁</Text>
          <Text>挑战奖励</Text>
        </View>
        <View className={styles.rewardList}>
          {challenge.rewards.map((reward, idx) => (
            <View key={idx} className={styles.rewardItem}>
              <Text className={styles.rewardIcon}>
                {idx === 0 ? '🏅' : idx === 1 ? '⭐' : '💎'}
              </Text>
              <View className={styles.rewardContent}>
                <Text className={styles.rewardTitle}>{reward}</Text>
                <Text className={styles.rewardDesc}>
                  {idx === 0 && '完成挑战后立即解锁展示'}
                  {idx === 1 && '积分可用于兑换商城礼品'}
                  {idx === 2 && '专属限定奖励，错过不再有'}
                </Text>
              </View>
              <Text className={styles.rewardBadge}>
                {isCompleted ? '已解锁' : challenge.progress > 50 ? '即将解锁' : '未解锁'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 排行榜 */}
      <View className={styles.dataSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>🏆</Text>
          <Text>挑战排行榜</Text>
          <Text style={{ fontSize: '22rpx', color: '#86909C', marginLeft: 'auto' }}>TOP 5</Text>
        </View>
        <View className={styles.rankList}>
          {mockChallengeRank.map(rank => {
            const isSelf = rank.userId === currentUser.id
            return (
              <View
                key={rank.userId}
                className={classnames(styles.rankItem, isSelf && styles.selfRank)}
                onClick={() => handleUserClick(rank.userId)}
              >
                <Text className={classnames(
                  styles.rankNumber,
                  rank.rank === 1 && styles.top1,
                  rank.rank === 2 && styles.top2,
                  rank.rank === 3 && styles.top3
                )}>
                  {rank.rank === 1 && '🥇'}
                  {rank.rank === 2 && '🥈'}
                  {rank.rank === 3 && '🥉'}
                  {rank.rank > 3 && rank.rank}
                </Text>
                <Image
                  className={styles.rankAvatar}
                  src={rank.avatar}
                  mode='aspectFill'
                />
                <View className={styles.rankInfo}>
                  <Text className={classnames(styles.rankName, isSelf && styles.selfName)}>
                    {rank.nickname}
                    {isSelf && ' (我)'}
                  </Text>
                  <View className={styles.rankProgressWrap}>
                    <View className={styles.rankProgressBar}>
                      <View
                        className={styles.rankProgressFill}
                        style={{ width: `${rank.progress}%` }}
                      />
                    </View>
                    <Text className={styles.rankProgressValue}>{rank.progress}%</Text>
                  </View>
                </View>
                <Text className={styles.rankValue}>
                  {rank.value}{challenge.unit}
                </Text>
              </View>
            )
          })}
        </View>
      </View>

      {/* 温馨提示 */}
      <View className={styles.tipsCard}>
        <Text className={styles.tipsTitle}>💡 完成小贴士</Text>
        <Text className={styles.tipsContent}>
          {'\n'}• 每新增一条足迹都可以推进进度
          {'\n'}• 在「足迹」页面点击「+」即可记录新旅行
          {'\n'}• 挑战结束前完成即可获得全部奖励
          {'\n'}• 邀请好友一起参与，解锁更多隐藏奖励
        </Text>
      </View>

      {/* 底部操作栏 */}
      <View className={styles.footerBar}>
        <Button className={styles.shareBtn} onClick={handleShare}>
          <Text className={styles.shareIcon}>📤</Text>
          <Text>分享</Text>
        </Button>
        <Button
          className={classnames(styles.actionBtn, isCompleted && styles.completed)}
          onClick={handleAction}
        >
          {isCompleted ? '🎉 已完成，领取奖励' : `还差 ${challenge.target - challenge.current} ${challenge.unit}，去记录`}
        </Button>
      </View>
    </View>
  )
}

export default ChallengeDetailPage
