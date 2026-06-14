import React, { useState, useMemo } from 'react'
import { View, Text, Input, Textarea, Image, Picker, Slider, Button, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store/useAppStore'
import type { Footprint } from '@/types/footprint'
import { generateId, formatDate, formatCost } from '@/utils'

const landscapeIds = [1015, 1018, 1036, 1039, 1044, 292, 312, 326, 401, 431, 570, 580]

const presetLocations = [
  { name: '西湖风景区', address: '浙江省杭州市西湖区', province: '浙江省', city: '杭州市', latitude: 30.2432, longitude: 120.1445 },
  { name: '外滩', address: '上海市黄浦区中山东一路', province: '上海市', city: '上海市', latitude: 31.2304, longitude: 121.4737 },
  { name: '故宫博物院', address: '北京市东城区景山前街4号', province: '北京市', city: '北京市', latitude: 39.9163, longitude: 116.3972 },
  { name: '锦里古街', address: '四川省成都市武侯区', province: '四川省', city: '成都市', latitude: 30.6477, longitude: 104.0447 },
  { name: '八大关风景区', address: '山东省青岛市市南区', province: '山东省', city: '青岛市', latitude: 36.0407, longitude: 120.3588 }
]

const presetTags = ['自然风光', '历史文化', '美食', '摄影', '徒步', '海滨', '骑行', '休闲', '亲子', '建筑', '夜景', '古镇']

const AddFootprintPage: React.FC = () => {
  const addFootprint = useAppStore(state => state.addFootprint)
  const currentUser = useAppStore(state => state.currentUser)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(formatDate(new Date()))
  const [locationName, setLocationName] = useState('')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState(30)
  const [longitude, setLongitude] = useState(120)
  const [duration, setDuration] = useState(8)
  const [cost, setCost] = useState(200)
  const [distance, setDistance] = useState(10)
  const [tags, setTags] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = useMemo(() => {
    return title.trim() && locationName.trim() && province.trim() && city.trim()
  }, [title, locationName, province, city])

  const handleTagToggle = (tag: string) => {
    setTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag)
      }
      if (prev.length >= 5) {
        Taro.showToast({ title: '最多选择5个标签', icon: 'none' })
        return prev
      }
      return [...prev, tag]
    })
  }

  const handleQuickLocation = (loc: typeof presetLocations[0]) => {
    setLocationName(loc.name)
    setAddress(loc.address)
    setProvince(loc.province)
    setCity(loc.city)
    setLatitude(loc.latitude)
    setLongitude(loc.longitude)
  }

  const handleAddPhoto = async () => {
    try {
      if (photos.length >= 9) {
        Taro.showToast({ title: '最多上传9张照片', icon: 'none' })
        return
      }
      const randomId = landscapeIds[Math.floor(Math.random() * landscapeIds.length)]
      const newPhoto = `https://picsum.photos/id/${randomId}/750/500?t=${Date.now()}`
      setPhotos(prev => [...prev, newPhoto])
      Taro.showToast({ title: '照片已添加', icon: 'success' })
    } catch (e) {
      console.error('[AddFootprint] 添加照片失败:', e)
      Taro.showToast({ title: '添加照片失败', icon: 'none' })
    }
  }

  const handleDeletePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleDateChange = (e: any) => {
    setDate(e.detail.value)
  }

  const handleCostChange = (e: any) => {
    const val = parseInt(e.detail.value) || 0
    setCost(val)
  }

  const handleSubmit = async () => {
    if (!canSubmit) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    setIsSubmitting(true)
    console.log('[AddFootprint] 提交足迹:', { title, locationName, date })

    try {
      const newFootprint: Footprint = {
        id: generateId(),
        userId: currentUser.id,
        title: title.trim(),
        content: content.trim() || '记录下这段美好的旅行时光...',
        location: {
          name: locationName.trim(),
          address: address.trim() || `${province}${city}`,
          latitude,
          longitude,
          province: province.trim(),
          city: city.trim()
        },
        photos: photos.length > 0
          ? photos
          : [`https://picsum.photos/id/${landscapeIds[Math.floor(Math.random() * landscapeIds.length)]}/750/500`],
        date,
        duration,
        cost,
        distance,
        tags,
        likes: 0,
        comments: 0,
        isLiked: false,
        createdAt: new Date().toISOString()
      }

      addFootprint(newFootprint)

      Taro.showToast({ title: '足迹保存成功！', icon: 'success' })

      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    } catch (e) {
      console.error('[AddFootprint] 保存失败:', e)
      Taro.showToast({ title: '保存失败，请重试', icon: 'none' })
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (title || content || photos.length > 0) {
      Taro.showModal({
        title: '确认离开',
        content: '当前编辑的内容将丢失，确定离开吗？',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateBack()
          }
        }
      })
    } else {
      Taro.navigateBack()
    }
  }

  return (
    <View className={styles.pageContainer}>
      {/* 基础信息 */}
      <View className={styles.formSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📝</Text>
          <Text>基础信息</Text>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>标题
          </Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.textInput}
              placeholder='给这次旅行起个标题'
              value={title}
              onInput={(e: any) => setTitle(e.detail.value)}
              maxlength={30}
            />
            <Text className={styles.counter}>{title.length}/30</Text>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>日期
          </Text>
          <View className={styles.inputWrap}>
            <Picker mode='date' value={date} onChange={handleDateChange}>
              <View className={styles.pickerInput}>
                <Text className={styles.pickerText}>{date}</Text>
                <Text className={styles.pickerArrow}>›</Text>
              </View>
            </Picker>
          </View>
        </View>
      </View>

      {/* 地点信息 */}
      <View className={styles.formSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📍</Text>
          <Text>旅行地点</Text>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>省份
          </Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.textInput}
              placeholder='如：浙江省'
              value={province}
              onInput={(e: any) => setProvince(e.detail.value)}
              maxlength={20}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>城市
          </Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.textInput}
              placeholder='如：杭州市'
              value={city}
              onInput={(e: any) => setCity(e.detail.value)}
              maxlength={20}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>景点/地址
          </Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.textInput}
              placeholder='如：西湖风景区'
              value={locationName}
              onInput={(e: any) => setLocationName(e.detail.value)}
              maxlength={50}
            />
            {!locationName && (
              <View className={styles.quickLocation}>
                {presetLocations.slice(0, 3).map((loc, idx) => (
                  <View
                    key={idx}
                    className={styles.quickLocationItem}
                    onClick={() => handleQuickLocation(loc)}
                  >
                    <Text>{loc.name}</Text>
                  </View>
                ))}
              </View>
            )}
            {locationName && address && (
              <View className={styles.previewMap}>
                <Text className={styles.previewMapIcon}>🗺️</Text>
                <Text className={styles.previewMapText}>{address}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* 费用与时长 */}
      <View className={styles.formSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>💰</Text>
          <Text>费用与时长</Text>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>花费</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.textInput}
              type='number'
              placeholder='请输入花费金额'
              value={cost.toString()}
              onInput={handleCostChange}
            />
            <View className={styles.rangeValue}>
              <Text>约 {formatCost(cost)}</Text>
            </View>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>旅行时长</Text>
          <View className={styles.inputWrap}>
            <Slider
              min={1}
              max={24}
              step={1}
              value={duration}
              onChange={(e: any) => setDuration(e.detail.value)}
              activeColor='#2D7FF9'
              backgroundColor='#F2F3F5'
              blockColor='#2D7FF9'
              blockSize={24}
            />
            <View className={styles.rangeValue}>
              <Text>约</Text>
              <Text className={styles.rangeHighlight}>{duration}</Text>
              <Text>小时</Text>
            </View>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>行程距离</Text>
          <View className={styles.inputWrap}>
            <Slider
              min={1}
              max={500}
              step={1}
              value={distance}
              onChange={(e: any) => setDistance(e.detail.value)}
              activeColor='#FF7D4A'
              backgroundColor='#F2F3F5'
              blockColor='#FF7D4A'
              blockSize={24}
            />
            <View className={styles.rangeValue}>
              <Text>约</Text>
              <Text className={styles.rangeHighlight}>{distance}</Text>
              <Text>公里</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 旅行标签 */}
      <View className={styles.formSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>🏷️</Text>
          <Text>旅行标签</Text>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>选择标签</Text>
          <View className={styles.inputWrap}>
            <View className={styles.tagList}>
              {presetTags.map(tag => (
                <View
                  key={tag}
                  className={classnames(styles.tagItem, tags.includes(tag) && styles.selected)}
                  onClick={() => handleTagToggle(tag)}
                >
                  <Text>{tag}</Text>
                </View>
              ))}
            </View>
            <Text className={styles.counter}>已选 {tags.length}/5 个</Text>
          </View>
        </View>
      </View>

      {/* 旅行照片 */}
      <View className={styles.formSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📷</Text>
          <Text>旅行照片</Text>
          <Text style={{ fontSize: '22rpx', color: '#86909C', marginLeft: 'auto' }}>{photos.length}/9</Text>
        </View>
        <View className={styles.photoSection}>
          <View className={styles.photoList}>
            {photos.map((photo, idx) => (
              <View key={idx} className={styles.photoItem}>
                <Image
                  className={styles.photoImage}
                  src={photo}
                  mode='aspectFill'
                  onError={(e) => console.error('[AddFootprint] 照片加载失败:', e)}
                />
                <View className={styles.photoDelete} onClick={() => handleDeletePhoto(idx)}>
                  <Text>×</Text>
                </View>
              </View>
            ))}
            {photos.length < 9 && (
              <View className={styles.photoAdd} onClick={handleAddPhoto}>
                <Text className={styles.photoAddIcon}>+</Text>
                <Text className={styles.photoAddText}>添加照片</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* 游记内容 */}
      <View className={styles.formSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>✍️</Text>
          <Text>游记内容</Text>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>记录感受</Text>
          <View className={styles.inputWrap}>
            <Textarea
              className={styles.textareaInput}
              placeholder='记录下这次旅行的感受和故事吧...'
              value={content}
              onInput={(e: any) => setContent(e.detail.value)}
              maxlength={500}
              showConfirmBar={false}
            />
            <Text className={styles.counter}>{content.length}/500</Text>
          </View>
        </View>
      </View>

      {/* 底部操作栏 */}
      <View className={styles.footerBar}>
        <Button className={styles.cancelBtn} onClick={handleCancel}>
          取消
        </Button>
        <Button
          className={classnames(styles.submitBtn, (!canSubmit || isSubmitting) && styles.disabled)}
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? '保存中...' : '保存足迹'}
        </Button>
      </View>
    </View>
  )
}

export default AddFootprintPage
