export interface Location {
  name: string
  address: string
  latitude: number
  longitude: number
  province: string
  city: string
}

export interface Footprint {
  id: string
  userId: string
  title: string
  content: string
  location: Location
  photos: string[]
  date: string
  duration: number
  cost: number
  distance: number
  tags: string[]
  likes: number
  comments: number
  isLiked: boolean
  createdAt: string
}

export interface FootprintTimelineGroup {
  date: string
  year: number
  month: number
  items: Footprint[]
}
