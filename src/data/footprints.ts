import type { Footprint } from '@/types/footprint'

const landscapeIds = [1015, 1018, 1036, 1039, 1044, 292, 312, 326, 401, 431]

export const mockFootprints: Footprint[] = [
  {
    id: '1',
    userId: 'u1',
    title: '西湖晨雾',
    content: '清晨的西湖，薄雾缭绕，仿佛置身仙境。沿着苏堤漫步，感受江南水乡的温婉与宁静。',
    location: {
      name: '西湖风景区',
      address: '浙江省杭州市西湖区',
      latitude: 30.2432,
      longitude: 120.1445,
      province: '浙江省',
      city: '杭州市'
    },
    photos: [
      `https://picsum.photos/id/${landscapeIds[0]}/750/500`,
      `https://picsum.photos/id/${landscapeIds[1]}/750/500`,
      `https://picsum.photos/id/${landscapeIds[2]}/750/500`
    ],
    date: '2024-06-15',
    duration: 8,
    cost: 320,
    distance: 12.5,
    tags: ['自然风光', '历史文化', '摄影'],
    likes: 128,
    comments: 24,
    isLiked: false,
    createdAt: '2024-06-15T18:30:00Z'
  },
  {
    id: '2',
    userId: 'u1',
    title: '张家界天门山',
    content: '天门山的玻璃栈道真的太刺激了！站在99道弯的山顶俯瞰，云雾缭绕，宛如天宫。',
    location: {
      name: '天门山国家森林公园',
      address: '湖南省张家界市永定区',
      latitude: 29.0481,
      longitude: 110.4789,
      province: '湖南省',
      city: '张家界市'
    },
    photos: [
      `https://picsum.photos/id/${landscapeIds[3]}/750/500`,
      `https://picsum.photos/id/${landscapeIds[4]}/750/500`
    ],
    date: '2024-06-10',
    duration: 10,
    cost: 580,
    distance: 8.2,
    tags: ['自然风光', '登山', '刺激'],
    likes: 256,
    comments: 42,
    isLiked: true,
    createdAt: '2024-06-10T20:15:00Z'
  },
  {
    id: '3',
    userId: 'u1',
    title: '成都美食之旅',
    content: '火锅、串串、龙抄手、担担面...成都简直是美食天堂！锦里的夜景也超美。',
    location: {
      name: '锦里古街',
      address: '四川省成都市武侯区',
      latitude: 30.6477,
      longitude: 104.0447,
      province: '四川省',
      city: '成都市'
    },
    photos: [
      `https://picsum.photos/id/${landscapeIds[5]}/750/500`,
      `https://picsum.photos/id/${landscapeIds[6]}/750/500`,
      `https://picsum.photos/id/${landscapeIds[7]}/750/500`
    ],
    date: '2024-05-28',
    duration: 12,
    cost: 450,
    distance: 5.6,
    tags: ['美食', '历史文化', '城市漫步'],
    likes: 189,
    comments: 31,
    isLiked: false,
    createdAt: '2024-05-28T22:00:00Z'
  },
  {
    id: '4',
    userId: 'u1',
    title: '大理洱海骑行',
    content: '租一辆电动车环洱海骑行，蓝天白云倒映在湖水中，美得像一幅画。',
    location: {
      name: '洱海',
      address: '云南省大理市',
      latitude: 25.7837,
      longitude: 100.1633,
      province: '云南省',
      city: '大理白族自治州'
    },
    photos: [
      `https://picsum.photos/id/${landscapeIds[8]}/750/500`,
      `https://picsum.photos/id/${landscapeIds[9]}/750/500`
    ],
    date: '2024-05-20',
    duration: 9,
    cost: 280,
    distance: 120,
    tags: ['自然风光', '骑行', '休闲'],
    likes: 312,
    comments: 56,
    isLiked: true,
    createdAt: '2024-05-20T19:45:00Z'
  },
  {
    id: '5',
    userId: 'u1',
    title: '故宫博物院',
    content: '第一次走进故宫，被古建筑群的震撼深深打动。红墙黄瓦，见证着六百年的历史。',
    location: {
      name: '故宫博物院',
      address: '北京市东城区景山前街4号',
      latitude: 39.9163,
      longitude: 116.3972,
      province: '北京市',
      city: '北京市'
    },
    photos: [
      `https://picsum.photos/id/${landscapeIds[0]}/750/500`,
      `https://picsum.photos/id/${landscapeIds[1]}/750/500`
    ],
    date: '2024-05-01',
    duration: 7,
    cost: 120,
    distance: 6.8,
    tags: ['历史文化', '建筑', '摄影'],
    likes: 445,
    comments: 78,
    isLiked: false,
    createdAt: '2024-05-01T17:30:00Z'
  },
  {
    id: '6',
    userId: 'u2',
    title: '桂林山水甲天下',
    content: '坐着竹筏漂流在漓江上，两岸的山峰倒映在水中，真是舟行碧波上，人在画中游。',
    location: {
      name: '漓江',
      address: '广西壮族自治区桂林市',
      latitude: 25.2736,
      longitude: 110.2907,
      province: '广西壮族自治区',
      city: '桂林市'
    },
    photos: [
      `https://picsum.photos/id/${landscapeIds[2]}/750/500`,
      `https://picsum.photos/id/${landscapeIds[3]}/750/500`
    ],
    date: '2024-06-12',
    duration: 6,
    cost: 380,
    distance: 83,
    tags: ['自然风光', '水上活动', '摄影'],
    likes: 276,
    comments: 38,
    isLiked: false,
    createdAt: '2024-06-12T16:20:00Z'
  },
  {
    id: '7',
    userId: 'u3',
    title: '上海外滩夜景',
    content: '外滩的夜晚灯火辉煌，万国建筑博览群在灯光下格外迷人。陆家嘴的天际线太震撼了！',
    location: {
      name: '外滩',
      address: '上海市黄浦区中山东一路',
      latitude: 31.2304,
      longitude: 121.4737,
      province: '上海市',
      city: '上海市'
    },
    photos: [
      `https://picsum.photos/id/${landscapeIds[4]}/750/500`,
      `https://picsum.photos/id/${landscapeIds[5]}/750/500`
    ],
    date: '2024-06-08',
    duration: 4,
    cost: 150,
    distance: 3.2,
    tags: ['城市风光', '夜景', '建筑'],
    likes: 198,
    comments: 27,
    isLiked: false,
    createdAt: '2024-06-08T21:00:00Z'
  },
  {
    id: '8',
    userId: 'u1',
    title: '青岛海滨漫步',
    content: '吹着海风走在八大关的林荫道上，红瓦绿树碧海蓝天，青岛夏天真的太舒服了！',
    location: {
      name: '八大关风景区',
      address: '山东省青岛市市南区',
      latitude: 36.0407,
      longitude: 120.3588,
      province: '山东省',
      city: '青岛市'
    },
    photos: [
      `https://picsum.photos/id/${landscapeIds[6]}/750/500`,
      `https://picsum.photos/id/${landscapeIds[7]}/750/500`
    ],
    date: '2024-07-05',
    duration: 7,
    cost: 260,
    distance: 8.5,
    tags: ['海滨', '建筑', '休闲'],
    likes: 167,
    comments: 22,
    isLiked: false,
    createdAt: '2024-07-05T18:45:00Z'
  }
]

export const getFootprintsByUserId = (userId: string): Footprint[] => {
  return mockFootprints.filter(f => f.userId === userId)
}

export const getFootprintById = (id: string): Footprint | undefined => {
  return mockFootprints.find(f => f.id === id)
}
