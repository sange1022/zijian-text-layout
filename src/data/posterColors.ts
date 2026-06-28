export type PosterColorCategory = {
  id: string
  label: string
  colors: string[]
}

export const POSTER_COLOR_CATEGORIES: PosterColorCategory[] = [
  { id: 'neutral', label: '黑白灰', colors: ['#FFFFFF', '#F4F1EA', '#D8D5CF', '#8D8A84', '#333333', '#111111'] },
  { id: 'earth', label: '米色大地', colors: ['#F3E9D2', '#D8C3A5', '#C8A27A', '#A67C52', '#7B5E45', '#4C3B2A'] },
  { id: 'morandi', label: '莫兰迪', colors: ['#D6D2C4', '#B7C4B8', '#A8B6C3', '#C6B5B9', '#B7A9C6', '#9FA8A3'] },
  { id: 'retro', label: '复古', colors: ['#F2D16B', '#D9824A', '#C4553D', '#7D8B5A', '#4E7180', '#7A4E48'] },
  { id: 'dark', label: '深色', colors: ['#14213D', '#1F2937', '#2F3E46', '#3D405B', '#4A3F35', '#2B2D2F'] },
]
