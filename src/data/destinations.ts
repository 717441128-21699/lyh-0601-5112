import type { Destination, RoutePlan, RecommendReason } from '@/types/destination'

const landscapeIds = [1015, 1018, 1036, 1039, 1044, 292, 312, 326, 401, 431, 570, 580]

export const mockDestinations: Destination[] = [
  {
    id: 'd1',
    name: '九寨沟',
    province: '四川省',
    city: '阿坝藏族羌族自治州',
    image: `https://picsum.photos/id/${landscapeIds[0]}/750/500`,
    description: '九寨沟以翠海、叠瀑、彩林、雪峰、藏情著称，被誉为"童话世界"。湖水清澈见底，色彩斑斓，是中国最美的水景之一。',
    rating: 4.8,
    reviewCount: 12580,
    bestSeason: ['春季', '秋季'],
    tags: ['自然风光', '摄影', '徒步'],
    distance: 1850,
    costLevel: 3,
    highlights: ['五花海', '诺日朗瀑布', '长海', '树正沟']
  },
  {
    id: 'd2',
    name: '三亚',
    province: '海南省',
    city: '三亚市',
    image: `https://picsum.photos/id/${landscapeIds[1]}/750/500`,
    description: '三亚是中国最美的海滨城市之一，拥有碧海蓝天、椰风海韵。亚龙湾、天涯海角、南山寺等景点令人流连忘返。',
    rating: 4.7,
    reviewCount: 28960,
    bestSeason: ['冬季', '春季'],
    tags: ['海滨度假', '水上活动', '休闲'],
    distance: 2580,
    costLevel: 4,
    highlights: ['亚龙湾', '天涯海角', '南山寺', '蜈支洲岛']
  },
  {
    id: 'd3',
    name: '丽江古城',
    province: '云南省',
    city: '丽江市',
    image: `https://picsum.photos/id/${landscapeIds[2]}/750/500`,
    description: '丽江古城是世界文化遗产，古朴的石板路、潺潺的流水、精美的纳西族建筑，构成了独特的高原水乡风貌。',
    rating: 4.6,
    reviewCount: 18720,
    bestSeason: ['春季', '秋季'],
    tags: ['历史文化', '古镇', '休闲'],
    distance: 2200,
    costLevel: 3,
    highlights: ['四方街', '木府', '玉龙雪山', '束河古镇']
  },
  {
    id: 'd4',
    name: '黄山',
    province: '安徽省',
    city: '黄山市',
    image: `https://picsum.photos/id/${landscapeIds[3]}/750/500`,
    description: '黄山以奇松、怪石、云海、温泉"四绝"著称于世，被誉为"天下第一奇山"。迎客松、飞来石、光明顶都是必看景点。',
    rating: 4.9,
    reviewCount: 15680,
    bestSeason: ['春季', '夏季', '秋季'],
    tags: ['自然风光', '登山', '摄影'],
    distance: 1280,
    costLevel: 3,
    highlights: ['迎客松', '光明顶', '飞来石', '西海大峡谷']
  },
  {
    id: 'd5',
    name: '厦门',
    province: '福建省',
    city: '厦门市',
    image: `https://picsum.photos/id/${landscapeIds[4]}/750/500`,
    description: '厦门是一座美丽的海滨城市，鼓浪屿的万国建筑、厦门大学的凤凰花、曾厝垵的文艺小店，都让人流连忘返。',
    rating: 4.5,
    reviewCount: 22350,
    bestSeason: ['春季', '秋季'],
    tags: ['海滨', '文艺', '美食'],
    distance: 850,
    costLevel: 3,
    highlights: ['鼓浪屿', '厦门大学', '曾厝垵', '南普陀寺']
  },
  {
    id: 'd6',
    name: '西藏拉萨',
    province: '西藏自治区',
    city: '拉萨市',
    image: `https://picsum.photos/id/${landscapeIds[5]}/750/500`,
    description: '拉萨是藏传佛教的圣地，布达拉宫巍峨壮观，大昭寺香火鼎盛。高原的蓝天、白云和经幡，构成了这片土地独特的魅力。',
    rating: 4.8,
    reviewCount: 9870,
    bestSeason: ['夏季', '秋季'],
    tags: ['历史文化', '自然风光', '朝圣'],
    distance: 3650,
    costLevel: 4,
    highlights: ['布达拉宫', '大昭寺', '纳木错', '羊卓雍错']
  },
  {
    id: 'd7',
    name: '西安',
    province: '陕西省',
    city: '西安市',
    image: `https://picsum.photos/id/${landscapeIds[6]}/750/500`,
    description: '西安是十三朝古都，兵马俑、大雁塔、古城墙见证了中华文明的辉煌。回民街的美食更是不容错过。',
    rating: 4.7,
    reviewCount: 19650,
    bestSeason: ['春季', '秋季'],
    tags: ['历史文化', '美食', '建筑'],
    distance: 980,
    costLevel: 2,
    highlights: ['兵马俑', '古城墙', '大雁塔', '回民街']
  },
  {
    id: 'd8',
    name: '青岛',
    province: '山东省',
    city: '青岛市',
    image: `https://picsum.photos/id/${landscapeIds[7]}/750/500`,
    description: '青岛是一座美丽的海滨城市，红瓦绿树、碧海蓝天是她的标志。啤酒、海鲜、八大关、崂山，构成了独特的青岛风情。',
    rating: 4.6,
    reviewCount: 14320,
    bestSeason: ['夏季', '秋季'],
    tags: ['海滨', '美食', '建筑'],
    distance: 680,
    costLevel: 2,
    highlights: ['八大关', '崂山', '栈桥', '青岛啤酒博物馆']
  }
]

export const mockRoutes: RoutePlan[] = [
  {
    id: 'r1',
    title: '云南深度游',
    days: 7,
    destinations: ['昆明', '大理', '丽江', '香格里拉'],
    totalDistance: 580,
    estimatedCost: 3500,
    image: `https://picsum.photos/id/${landscapeIds[8]}/750/400`,
    difficulty: 'medium',
    tags: ['自然风光', '民族风情', '深度游']
  },
  {
    id: 'r2',
    title: '川西小环线',
    days: 5,
    destinations: ['成都', '四姑娘山', '丹巴', '康定', '海螺沟'],
    totalDistance: 720,
    estimatedCost: 2800,
    image: `https://picsum.photos/id/${landscapeIds[9]}/750/400`,
    difficulty: 'hard',
    tags: ['自然风光', '摄影', '自驾']
  },
  {
    id: 'r3',
    title: '江浙沪周末游',
    days: 3,
    destinations: ['上海', '苏州', '杭州'],
    totalDistance: 350,
    estimatedCost: 1800,
    image: `https://picsum.photos/id/${landscapeIds[10]}/750/400`,
    difficulty: 'easy',
    tags: ['城市观光', '美食', '周末游']
  },
  {
    id: 'r4',
    title: '海南环岛自驾',
    days: 6,
    destinations: ['海口', '文昌', '三亚', '东方', '儋州'],
    totalDistance: 850,
    estimatedCost: 4200,
    image: `https://picsum.photos/id/${landscapeIds[11]}/750/400`,
    difficulty: 'medium',
    tags: ['海滨度假', '自驾', '休闲']
  }
]

export const mockRecommendReasons: RecommendReason[] = [
  { type: 'season', text: '当前季节最佳目的地' },
  { type: 'preference', text: '根据您的偏好推荐' },
  { type: 'trending', text: '本周热门目的地' },
  { type: 'nearby', text: '距离您最近的美景' }
]

export const getDestinationById = (id: string): Destination | undefined => {
  return mockDestinations.find(d => d.id === id)
}

export const getRouteById = (id: string): RoutePlan | undefined => {
  return mockRoutes.find(r => r.id === id)
}
