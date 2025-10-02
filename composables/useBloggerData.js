import { ref, computed, onMounted, watch } from 'vue'
import { getBloggerStats, getBloggerReviews, getBloggerReelsWithRetry } from '~/utils/api'

export const useBloggerData = () => {
  const bloggerData = ref({
    name: 'Екатерина Иванова',
    niche: 'Lifestyle',
    avatar: '/blogger-dashboard/images/default-avatar.png',
    buttonText: 'Предложить сделку'
  })
  
  const withBase = (p) => `/blogger-dashboard${p.startsWith('/') ? '' : '/'}${p.replace(/^\/?blogger-dashboard\//, '').replace(/^\//, '')}`

  const socialIconByName = {
    Telegram: withBase('/icons/telegram.svg'),
    YouTube: withBase('/icons/youtube.svg'),
    TikTok: withBase('/icons/tiktok.svg'),
    Instagram: withBase('/icons/instagram.svg'),
    VK: withBase('/icons/vk.svg'),
    Dzen: withBase('/icons/dzen.svg'),
    Rythm: withBase('/icons/rythm.svg'),
    Wibes: withBase('/icons/wibes.svg')
  }

  const socialNetworks = ref([
    { name: 'Telegram', iconPath: socialIconByName.Telegram, count: '11K', active: true },
    { name: 'YouTube', iconPath: socialIconByName.YouTube, count: '11K', active: true },
    { name: 'TikTok', iconPath: socialIconByName.TikTok, count: '11K', active: true },
    { name: 'Instagram', iconPath: socialIconByName.Instagram, count: '11K', active: true },
    { name: 'VK', iconPath: socialIconByName.VK, count: '11K', active: true },
    { name: 'Dzen', iconPath: socialIconByName.Dzen, count: '11K', active: true },
    { name: 'Rythm', iconPath: socialIconByName.Rythm, count: '11K', active: true },
    { name: 'Wibes', iconPath: socialIconByName.Wibes, count: '11K', active: true }
  ])
  
  const stats = ref({
    rating: '5',
    status: 'ТОП',
    completedDeals: '82',
    serviceTime: '9 мес. 27 д.'
  })
  
  const workExamples = ref({
    title: 'Примеры работ',
    viewAllText: 'смотреть все',
    examples: [
      { video: '/blogger-dashboard/video/reels-1.mp4', alt: 'Пример работы 1' },
      { video: '/blogger-dashboard/video/reels-2.mp4', alt: 'Пример работы 2' },
      { video: '/blogger-dashboard/video/reels-3.mp4', alt: 'Пример работы 3' },
      { video: '/blogger-dashboard/video/reels-4.mp4', alt: 'Пример работы 4' },
      { video: '/blogger-dashboard/video/reels-5.mp4', alt: 'Пример работы 5' }
    ]
  })
  
  // Функция для маскирования имени
  const maskName = (name) => {
    if (!name || name.length <= 2) return name
    if (name.length <= 4) return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
    return name[0] + name[1] + '*'.repeat(name.length - 4) + name[name.length - 2] + name[name.length - 1]
  }

  const reviews = ref({
    title: 'Отзывы (0)',
    viewAllText: 'смотреть все',
    reviews: []
  })
  
  const totalFollowers = computed(() => {
    return socialNetworks.value.reduce((total, social) => {
      const count = parseInt(social.count.replace('K', '000'))
      return total + count
    }, 0)
  })
  
  // Состояния загрузки
  const isLoading = ref(false)
  const isReelsLoading = ref(false)
  const reelsLoadingProgress = ref({ current: 0, total: 4 })

  // Функция форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
  }

  // Функция загрузки данных блогера
  const loadBloggerData = async (bloggerId = null) => {
    if (!bloggerId) return

    isLoading.value = true
    
    try {
      // Загружаем данные параллельно
      const [statsData, reviewsData, reelsResult] = await Promise.all([
        getBloggerStats(bloggerId),
        getBloggerReviews(bloggerId),
        getBloggerReelsWithRetry(bloggerId, 4, [10000, 10000, 10000, 20000], 9, (progress) => {
          reelsLoadingProgress.value = progress
        })
      ])

      // Обновляем профиль и статистику с учетом фактической структуры API
      if (statsData) {
        // Профиль
        if (statsData.profile) {
          bloggerData.value.name = statsData.profile.firstname || bloggerData.value.name
          // Если есть аватар — используем, иначе остается дефолтный
          if (statsData.profile.avatar) {
            bloggerData.value.avatar = statsData.profile.avatar
          }
        }

        // Статистика
        const avgRating = statsData.stats?.rating?.average
        const dealsClosed = statsData.stats?.deals?.closed
        const humanService = statsData.stats?.timeOnPlatform?.humanReadable

        stats.value = {
          rating: (avgRating != null ? avgRating : 5).toString(),
          status: stats.value.status || 'ТОП',
          completedDeals: (dealsClosed != null ? dealsClosed : 82).toString(),
          serviceTime: humanService || stats.value.serviceTime || '9 мес. 27 д.'
        }
      }

      // Обновляем социальные сети с нормализацией путей к иконкам
      if (statsData?.socialNetworks) {
        console.log('Данные соцсетей из API:', statsData.socialNetworks)
        const aliasToName = { inst: 'Instagram', tg: 'Telegram' }
        // В новых данных имя сети находится в social.network.name
        let nameCounts = {}
        const processedNetworks = statsData.socialNetworks
          .filter(social => social && (social.name || social.network?.name))
          .map((social) => {
            const originalName = (social.name || social.network?.name || '').toString()
            const normalizedName = aliasToName[originalName?.toLowerCase?.()] || originalName
            const lower = ((social.iconPath || '')).toLowerCase()
            // Если пришел абсолютный URL — используем как есть
            const isAbsolute = /^https?:\/\//.test(social.iconPath || '')
            let iconPath = socialIconByName[normalizedName] || socialIconByName.Instagram
            if (isAbsolute) {
              iconPath = social.iconPath
            } else if (lower.endsWith('inst.svg') || lower.includes('instagram')) {
              iconPath = socialIconByName.Instagram
            } else if (lower.endsWith('tg.svg') || lower.includes('telegram')) {
              iconPath = socialIconByName.Telegram
            } else if (lower.includes('youtube')) {
              iconPath = socialIconByName.YouTube
            } else if (lower.includes('tiktok')) {
              iconPath = socialIconByName.TikTok
            } else if (lower.includes('vk')) {
              iconPath = socialIconByName.VK
            } else if (lower.includes('dzen')) {
              iconPath = socialIconByName.Dzen
            } else if (lower.includes('rythm')) {
              iconPath = socialIconByName.Rythm
            } else if (lower.includes('wibes')) {
              iconPath = socialIconByName.Wibes
            }
            // Нумерация дублей: Instagram, Instagram 2, ...
            nameCounts[normalizedName] = (nameCounts[normalizedName] || 0) + 1
            const displayName = nameCounts[normalizedName] > 1 ? `${normalizedName} ${nameCounts[normalizedName]}` : normalizedName

            return {
              name: displayName,
              baseName: normalizedName,
              iconPath,
              count: (social.followersCount != null
                ? social.followersCount.toLocaleString('ru-RU')
                : (social.count || '0')), // fallback
              active: social.active !== false
            }
          })
          // Не удаляем дубликаты — показываем все с нумерацией
        
        console.log('Обработанные соцсети:', processedNetworks)
        socialNetworks.value = processedNetworks
      } else {
        console.log('Нет данных соцсетей в statsData:', statsData)
      }

      // Обновляем отзывы
      if (reviewsData?.items) {
        reviews.value.reviews = reviewsData.items.map(review => ({
          name: review.author?.firstname || review.author?.maskedName || 'Пользователь',
          date: formatDate(review.createdAt),
          rating: review.rating || 5,
          text: review.description || 'Без описания',
          avatar: review.author?.avatar || null
        }))
        
        // Обновляем заголовок с актуальным количеством отзывов
        reviews.value.title = `Отзывы (${reviewsData.items.length})`
      }

      // Обновляем примеры работ
      if (reelsResult?.reels) {
        workExamples.value.examples = reelsResult.reels.map((reel, index) => ({
          video: reel.cdn_url || reel.video,
          alt: `Рилс ${index + 1}`,
          thumbnail: reel.thumbnail_url || reel.thumbnail,
          duration: reel.duration,
          platform: reel.platform || 'instagram'
        }))
      }

    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      isLoading.value = false
      isReelsLoading.value = false
    }
  }

  // Функция для начала загрузки рилсов
  const startReelsLoading = () => {
    isReelsLoading.value = true
    reelsLoadingProgress.value = { current: 0, total: 4 }
  }

  return {
    bloggerData,
    socialNetworks,
    stats,
    workExamples,
    reviews,
    totalFollowers,
    isLoading,
    isReelsLoading,
    reelsLoadingProgress,
    loadBloggerData,
    startReelsLoading
  }
}
//после перестроение 