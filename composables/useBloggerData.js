import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { getBloggerStats, getBloggerReviews, getBloggerReelsWithRetry } from '~/utils/api'

export const useBloggerData = () => {
  const bloggerData = ref({
    name: '',
    niche: '',
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

  const socialNetworks = ref([])
  
  const stats = ref({
    rating: '',
    status: '',
    completedDeals: '',
    serviceTime: ''
  })
  
  const workExamples = ref({
    title: 'Примеры работ',
    viewAllText: 'смотреть все',
    examples: []
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

  // AI данные
  const aiData = ref({
    finalScore: '',
    topics: [],
    description: '',
    followers: '',
    er: '',
    avgLikes: '',
    avgComments: '',
    reach: '',
    productScore: '',
    productComment: '',
    audienceScore: '',
    audienceComment: '',
    matchScore: '',
    matchComment: ''
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
    // Если нет ID или ID = 'test', загружаем тестовые данные
    if (!bloggerId || bloggerId === 'test') {
      loadTestData()
      return
    }

    // Проверяем, находимся ли мы на GitHub Pages
    const isGitHubPages = process.env.NODE_ENV === 'production' && window.location.hostname.includes('github.io')
    
    // Если на GitHub Pages И нет ID блогера, загружаем тестовые данные
    if (isGitHubPages && !bloggerId) {
      console.log('На GitHub Pages без ID, загружаем тестовые данные')
      loadTestData()
      return
    }

    // Показываем загрузку для API запросов
    isLoading.value = true
    isReelsLoading.value = true
    
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
        console.log('Обновляем профиль:', statsData.profile)
        // Профиль
        if (statsData.profile) {
          bloggerData.value.name = statsData.profile.firstname || bloggerData.value.name
          bloggerData.value.niche = statsData.profile.niche || bloggerData.value.niche
          // Если есть аватар — используем, иначе остается дефолтный
          if (statsData.profile.avatar) {
            bloggerData.value.avatar = statsData.profile.avatar
          }
          console.log('Профиль обновлен:', bloggerData.value)
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
      console.log('Результат загрузки рилсов:', reelsResult)
      if (reelsResult?.reels && reelsResult.reels.length > 0) {
        console.log(`Найдено ${reelsResult.reels.length} рилсов`)
        workExamples.value.examples = reelsResult.reels.map((reel, index) => ({
          video: reel.cdn_url || reel.video,
          alt: `Рилс ${index + 1}`,
          thumbnail: reel.thumbnail_url || reel.thumbnail,
          duration: reel.duration,
          platform: reel.platform || 'instagram',
          likesCount: reel.likes_count || 0,
          commentsCount: reel.comments_count || 0,
          viewsCount: reel.video_view_count || 0,
          caption: reel.caption || '',
          playCount: reel.video_play_count || 0
        }))
        console.log('Рилсы обработаны:', workExamples.value.examples)
      } else {
        // Если рилсов нет, показываем fallback рилсы для демонстрации
        workExamples.value.examples = []
        console.log('Рилсы не найдены или пустой массив. Результат:', reelsResult)
        
        // Добавляем fallback рилсы для демонстрации функционала
        console.log('Добавляем fallback рилсы для демонстрации')
        workExamples.value.examples = [
          {
            video: '/blogger-dashboard/video/reels-1.mp4',
            alt: 'Красивый макияж',
            thumbnail: '/blogger-dashboard/images/poster.png',
            duration: '0:15',
            platform: 'instagram',
            likesCount: 154,
            commentsCount: 8,
            viewsCount: 4630,
            caption: 'Артикул на ВБ: 253020586 \n\nНа вб акция на трусики минус 15% -  по 999 руб в течение августа 🔥\nНаши любимые- тонкие, дышащие, комфортные - идеально для активных деток. \nСпокойно выдерживают всю ночь 🌙 \n\n@hanibani_baby \n@hanibani.mama',
            playCount: 22930
          },
          {
            video: '/blogger-dashboard/video/reels-2.mp4',
            alt: 'Утренняя рутина',
            thumbnail: '/blogger-dashboard/images/poster.png',
            duration: '0:20',
            platform: 'tiktok',
            likesCount: 89,
            commentsCount: 12,
            viewsCount: 2150,
            caption: 'Утренняя рутина красоты ✨ Как я начинаю свой день',
            playCount: 8500
          },
          {
            video: '/blogger-dashboard/video/reels-3.mp4',
            alt: 'Обзор косметики',
            thumbnail: '/blogger-dashboard/images/poster.png',
            duration: '0:18',
            platform: 'instagram',
            likesCount: 203,
            commentsCount: 15,
            viewsCount: 3200,
            caption: 'Новый обзор косметики! Что стоит попробовать 💄',
            playCount: 12000
          }
        ]
        console.log('Добавлены fallback рилсы для демонстрации')
      }

      // Обновляем AI данные (пока статичные, можно расширить в будущем)
      // AI данные будут обновляться в компоненте AiInsights на основе socialNetworks

    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
      // При ошибке API загружаем тестовые данные как fallback
      console.log('Ошибка загрузки API данных, загружаем тестовые данные')
      
      // Если это CORS ошибка на GitHub Pages, показываем сообщение
      if (process.env.NODE_ENV === 'production' && window.location.hostname.includes('github.io')) {
        console.log('CORS ошибка на GitHub Pages, используем тестовые данные')
      }
      
      loadTestData()
    } finally {
      // Принудительно обновляем состояние загрузки
      isLoading.value = false
      isReelsLoading.value = false
      
      // Принудительное обновление реактивности
      nextTick(() => {
        console.log('Данные загружены, состояние обновлено')
      })
    }
  }

  // Функция для начала загрузки рилсов
  const startReelsLoading = () => {
    isReelsLoading.value = true
    reelsLoadingProgress.value = { current: 0, total: 4 }
  }

  // Функция загрузки тестовых данных
  const loadTestData = () => {
    console.log('Загружаем тестовые данные')
    
    // Обновляем профиль
    bloggerData.value = {
      name: 'Анна Петрова',
      niche: 'Beauty & Lifestyle',
      avatar: '/blogger-dashboard/images/test-avatar.jpg',
      buttonText: 'Предложить сделку'
    }
    
    // Обновляем статистику
    stats.value = {
      rating: '4.8',
      status: 'ТОП',
      completedDeals: '156',
      serviceTime: '2 г. 3 мес.'
    }
    
    // Обновляем социальные сети (8 разных + 2 Instagram аккаунта)
    socialNetworks.value = [
      { name: 'Instagram', iconPath: socialIconByName.Instagram, count: '125K', active: true },
      { name: 'Instagram 2', iconPath: socialIconByName.Instagram, count: '89K', active: true },
      { name: 'TikTok', iconPath: socialIconByName.TikTok, count: '78K', active: true },
      { name: 'YouTube', iconPath: socialIconByName.YouTube, count: '45K', active: true },
      { name: 'Telegram', iconPath: socialIconByName.Telegram, count: '12K', active: true },
      { name: 'VK', iconPath: socialIconByName.VK, count: '34K', active: true },
      { name: 'Dzen', iconPath: socialIconByName.Dzen, count: '23K', active: true },
      { name: 'Rythm', iconPath: socialIconByName.Rythm, count: '15K', active: true },
      { name: 'Wibes', iconPath: socialIconByName.Wibes, count: '8K', active: true }
    ]
    
    // Обновляем примеры работ с тестовыми видео (только 5 видео, без скелетона)
    workExamples.value.examples = [
      { 
        video: '/blogger-dashboard/video/reels-1.mp4', 
        alt: 'Красивый макияж', 
        thumbnail: '/blogger-dashboard/images/poster.png',
        duration: '0:15',
        platform: 'instagram',
        likesCount: 154,
        commentsCount: 8,
        viewsCount: 4630,
        caption: 'Артикул на ВБ: 253020586 \n\nНа вб акция на трусики минус 15% -  по 999 руб в течение августа 🔥\nНаши любимые- тонкие, дышащие, комфортные - идеально для активных деток. \nСпокойно выдерживают всю ночь 🌙 \n\n@hanibani_baby \n@hanibani.mama',
        playCount: 22930
      },
      { 
        video: '/blogger-dashboard/video/reels-2.mp4', 
        alt: 'Утренняя рутина', 
        thumbnail: '/blogger-dashboard/images/poster.png',
        duration: '0:20',
        platform: 'tiktok',
        likesCount: 89,
        commentsCount: 12,
        viewsCount: 2150,
        caption: 'Утренняя рутина красоты ✨ Как я начинаю свой день',
        playCount: 8500
      },
      { 
        video: '/blogger-dashboard/video/reels-3.mp4', 
        alt: 'Обзор косметики', 
        thumbnail: '/blogger-dashboard/images/poster.png',
        duration: '0:18',
        platform: 'instagram',
        likesCount: 203,
        commentsCount: 15,
        viewsCount: 3200,
        caption: 'Новый обзор косметики! Что стоит попробовать 💄',
        playCount: 12000
      },
      { 
        video: '/blogger-dashboard/video/reels-4.mp4', 
        alt: 'Стильный образ', 
        thumbnail: '/blogger-dashboard/images/poster.png',
        duration: '0:22',
        platform: 'tiktok',
        likesCount: 67,
        commentsCount: 5,
        viewsCount: 1800,
        caption: 'Стильный образ на выходные 👗',
        playCount: 6500
      },
      { 
        video: '/blogger-dashboard/video/reels-5.mp4', 
        alt: 'Тренды красоты', 
        thumbnail: '/blogger-dashboard/images/poster.png',
        duration: '0:16',
        platform: 'instagram',
        likesCount: 178,
        commentsCount: 9,
        viewsCount: 2800,
        caption: 'Тренды красоты 2024! Что актуально сейчас 💅',
        playCount: 9500
      }
    ]
    
    // Для тестовых данных не показываем загрузку
    isReelsLoading.value = false

    // Обновляем AI данные для тестовых данных
    aiData.value = {
      finalScore: '9.6/10',
      topics: ['мода', 'лайфстайл'],
      description: 'Эстетичный визуал, аутфиты, уход, сторис с рекомендациями. Часто использует рилсы и карусели.',
      followers: '12 500',
      er: '6,8%',
      avgLikes: '220',
      avgComments: '14',
      reach: '28K',
      productScore: '10',
      productComment: 'Идеальный fit с модой',
      audienceScore: '10',
      audienceComment: 'Ядро — молодые мамы, следят за стилем',
      matchScore: '9.6',
      matchComment: 'Максимальное соответствие'
    }

    // Обновляем отзывы
    reviews.value = {
      title: 'Отзывы (8)',
      viewAllText: 'смотреть все',
      reviews: [
        {
          name: 'Мария К.',
          date: '15.12.2024',
          rating: 5,
          text: 'Отличная работа! Очень довольна результатом. Рекомендую!',
          avatar: null
        },
        {
          name: 'Елена С.',
          date: '10.12.2024',
          rating: 5,
          text: 'Профессиональный подход, качественный контент. Спасибо!',
          avatar: null
        },
        {
          name: 'Анна В.',
          date: '05.12.2024',
          rating: 4,
          text: 'Хорошая работа, но можно было бы быстрее. В целом довольна.',
          avatar: null
        },
        {
          name: 'Ольга М.',
          date: '28.11.2024',
          rating: 5,
          text: 'Супер! Все сделано в срок и качественно. Буду обращаться еще.',
          avatar: null
        },
        {
          name: 'Ирина Л.',
          date: '20.11.2024',
          rating: 5,
          text: 'Отличный результат! Очень понравилось сотрудничество.',
          avatar: null
        },
        {
          name: 'Татьяна Р.',
          date: '15.11.2024',
          rating: 5,
          text: 'Профессионально и быстро. Рекомендую всем!',
          avatar: null
        },
        {
          name: 'Наталья П.',
          date: '08.11.2024',
          rating: 4,
          text: 'Хорошая работа, но есть небольшие замечания. В целом довольна.',
          avatar: null
        },
        {
          name: 'Светлана К.',
          date: '01.11.2024',
          rating: 5,
          text: 'Превосходно! Все сделано на высшем уровне. Спасибо!',
          avatar: null
        }
      ]
    }
    
    console.log('Тестовые данные загружены')
  }
  
  return {
    bloggerData,
    socialNetworks,
    stats,
    workExamples,
    reviews,
    aiData,
    totalFollowers,
    isLoading,
    isReelsLoading,
    reelsLoadingProgress,
    loadBloggerData,
    startReelsLoading
  }
}
//после перестроение 