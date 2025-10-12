import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { getBloggerStats, getBloggerReviews, getBloggerReelsWithRetry } from '~/utils/api'

export const useBloggerData = () => {
  const bloggerData = ref({
    name: '',
    niche: '',
    avatar: '/images/default-avatar.png',
    buttonText: 'Предложить сделку'
  })
  
  const withBase = (p) => p.startsWith('/') ? p : `/${p}`

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
    title: 'Примеры работ из инстаграм и сделок',
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
  const isInitialLoading = ref(false) // Новое состояние для первоначальной загрузки
  const isFirstReelsAttempt = ref(true) // Отслеживание первой попытки загрузки рилсов
  
  // Состояния ошибок
  const error = ref(null)
  const bloggerNotFound = ref(false)

  // Функция форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
  }

  // Функция обновления статистики и профиля
  const updateStatsAndProfile = (statsData) => {
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

      // Обновляем социальные сети с нормализацией путей к иконкам
      if (statsData.socialNetworks) {
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

            // Формируем ссылку на профиль если есть данные
            let profileUrl = null
            const baseUrl = social.network?.baseUrl || social.baseUrl
            // Для Wibes используем externalId, для остальных - username
            const identifier = social.username || social.network?.externalId
            
            if (baseUrl && identifier) {
              profileUrl = `${baseUrl}${identifier}`
            }

            return {
              name: displayName,
              baseName: normalizedName,
              iconPath,
              count: (social.followersCount != null
                ? social.followersCount.toLocaleString('ru-RU')
                : (social.count || '0')), // fallback
              reach: social.reach || null, // Сохраняем охваты из API
              active: social.active !== false,
              profileUrl: profileUrl // Ссылка на профиль
            }
          })
          // Не удаляем дубликаты — показываем все с нумерацией
        
        socialNetworks.value = processedNetworks
      }
    }
  }

  // Функция загрузки отзывов
  const loadReviews = async (bloggerId) => {
    // Проверяем, не показана ли уже ошибка "блогера нет"
    if (bloggerNotFound.value) {
      console.log('Блогер не найден, пропускаем загрузку отзывов')
      return
    }
    
    try {
      const reviewsData = await getBloggerReviews(bloggerId)
      
      // Обновляем отзывы сразу после получения
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
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error)
      
      // Если получили 400 или 404, сразу показываем ошибку "блогера нет"
      if (error.status === 400 || error.status === 404 || error.message?.includes('400') || error.message?.includes('404')) {
        bloggerNotFound.value = true
        error.value = 'Такого блогера не существует'
      }
    }
  }

  // Функция для обновления средних охватов Instagram на основе просмотров рилсов
  const updateInstagramReachFromReels = (reels) => {
    if (!reels || reels.length === 0) return
    
    // Фильтруем только Instagram рилсы с данными просмотров
    const instagramReels = reels.filter(reel => 
      (reel.platform || '').toLowerCase() === 'instagram' && 
      reel.video_view_count && 
      reel.video_view_count > 0
    )
    
    console.log(`Найдено Instagram рилсов с данными: ${instagramReels.length}`)
    
    // Если есть рилсы с данными - рассчитываем для первого Instagram
    if (instagramReels.length > 0) {
      // Логируем данные каждого рилса для отладки
      console.log('Instagram рилсы для расчета охватов:')
      instagramReels.forEach((reel, index) => {
        console.log(`Рилс ${index + 1}: просмотры = ${reel.video_view_count}`)
      })
      
      // Рассчитываем средний охват
      const totalViews = instagramReels.reduce((sum, reel) => sum + (reel.video_view_count || 0), 0)
      const averageReach = Math.round(totalViews / instagramReels.length)
      
      console.log(`Общие просмотры: ${totalViews}, Instagram рилсов: ${instagramReels.length}, средний охват: ${averageReach}`)
      
      // Обновляем охваты только для первого Instagram
      socialNetworks.value = socialNetworks.value.map((social, index) => {
        if ((social.baseName === 'Instagram' || social.name === 'Instagram') && 
            index === socialNetworks.value.findIndex(s => (s.baseName === 'Instagram' || s.name === 'Instagram'))) {
          return {
            ...social,
            reach: averageReach > 1000 ? `${(averageReach / 1000).toFixed(1)}K` : averageReach.toString()
          }
        }
        return social
      })
    } else {
      // Если нет рилсов с данными - все Instagram профили используют reach из API
      console.log('Нет Instagram рилсов с данными просмотров, все профили используют reach из API')
    }
  }

  // Функция загрузки рилсов
  const loadReels = async (bloggerId) => {
    // Проверяем, не показана ли уже ошибка "блогера нет"
    if (bloggerNotFound.value) {
      console.log('Блогер не найден, пропускаем загрузку рилсов')
      return
    }
    
    try {
      const reelsResult = await getBloggerReelsWithRetry(bloggerId, 4, [10000, 10000, 10000, 20000], 9, (progress) => {
        reelsLoadingProgress.value = progress
      })

      // Сбрасываем флаг первой попытки после получения результатов
      isFirstReelsAttempt.value = false

      // Обновляем примеры работ
      console.log('Результат загрузки рилсов:', reelsResult)
      if (reelsResult?.reels && reelsResult.reels.length > 0) {
        console.log(`Найдено ${reelsResult.reels.length} рилсов`)
        
        // Рассчитываем средние охваты Instagram на основе просмотров рилсов
        updateInstagramReachFromReels(reelsResult.reels)
        
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
        // Если рилсов нет, оставляем пустой массив
        workExamples.value.examples = []
        console.log('Рилсы не найдены или пустой массив. Результат:', reelsResult)
      }

      // Завершаем загрузку рилсов
      isReelsLoading.value = false
      
    } catch (error) {
      console.error('Ошибка загрузки рилсов:', error)
      isReelsLoading.value = false
      
      // Если получили 400 или 404, сразу показываем ошибку "блогера нет"
      if (error.status === 400 || error.status === 404 || error.message?.includes('400') || error.message?.includes('404')) {
        bloggerNotFound.value = true
        error.value = 'Такого блогера не существует'
      }
    }
  }

  // Функция загрузки отзывов и рилсов (теперь запускает их независимо)
  const loadReviewsAndReels = async (bloggerId) => {
    // Проверяем, не показана ли уже ошибка "блогера нет"
    if (bloggerNotFound.value) {
      console.log('Блогер не найден, пропускаем загрузку отзывов и рилсов')
      return
    }
    
    // Запускаем загрузку отзывов и рилсов независимо
    loadReviews(bloggerId)
    loadReels(bloggerId)
  }

  // Функция загрузки данных блогера
  const loadBloggerData = async (bloggerId = null) => {
    // Сброс состояний ошибок
    error.value = null
    bloggerNotFound.value = false
    
    // Если нет ID или ID = 'test', загружаем тестовые данные
    if (!bloggerId || bloggerId === 'test') {
      loadTestData()
      return
    }

    // Проверяем, находимся ли мы на продакшене без ID блогера
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Если на продакшене И нет ID блогера, загружаем тестовые данные
    if (isProduction && !bloggerId) {
      console.log('На продакшене без ID, загружаем тестовые данные')
      loadTestData()
      return
    }

    // Показываем первоначальную загрузку
    isInitialLoading.value = true
    isLoading.value = true
    isReelsLoading.value = true
    
    try {
      // Сначала проверяем статистику - если блогера нет, сразу показываем ошибку
      const statsData = await getBloggerStats(bloggerId)
      
      // Как только получили первые данные, убираем перекрывающий лоадер
      isInitialLoading.value = false
      
      // Сразу обновляем данные статистики и профиля
      updateStatsAndProfile(statsData)
      
      // Загружаем остальные данные параллельно без ожидания
      loadReviewsAndReels(bloggerId)

    } catch (err) {
      console.error('Ошибка загрузки данных:', err)
      
      // Проверяем тип ошибки
      if (err.status === 400 || err.status === 404 || err.message?.includes('400') || err.message?.includes('404')) {
        bloggerNotFound.value = true
        error.value = 'Такого блогера не существует'
      } else {
        error.value = 'Произошла ошибка при загрузке данных'
      }
      
      // При ошибке API загружаем тестовые данные как fallback только для некритичных ошибок
      if (err.status !== 400 && err.status !== 404 && !err.message?.includes('400') && !err.message?.includes('404')) {
        console.log('Ошибка загрузки API данных, загружаем тестовые данные')
        
        // Если это CORS ошибка на продакшене, показываем сообщение
        if (process.env.NODE_ENV === 'production') {
          console.log('CORS ошибка на продакшене, используем тестовые данные')
        }
        
        loadTestData()
      }
    } finally {
      // Принудительно обновляем состояние загрузки
      isLoading.value = false
      
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
      avatar: '/images/test-avatar.jpg',
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
        video: '/video/reels-1.mp4', 
        alt: 'Красивый макияж', 
        thumbnail: '/images/poster.png',
        duration: '0:15',
        platform: 'instagram',
        likesCount: 154,
        commentsCount: 8,
        viewsCount: 4630,
        caption: 'Артикул на ВБ: 253020586 \n\nНа вб акция на трусики минус 15% -  по 999 руб в течение августа 🔥\nНаши любимые- тонкие, дышащие, комфортные - идеально для активных деток. \nСпокойно выдерживают всю ночь 🌙 \n\n@hanibani_baby \n@hanibani.mama',
        playCount: 22930
      },
      { 
        video: '/video/reels-2.mp4', 
        alt: 'Утренняя рутина', 
        thumbnail: '/images/poster.png',
        duration: '0:20',
        platform: 'tiktok',
        likesCount: 89,
        commentsCount: 12,
        viewsCount: 2150,
        caption: 'Утренняя рутина красоты ✨ Как я начинаю свой день',
        playCount: 8500
      },
      { 
        video: '/video/reels-3.mp4', 
        alt: 'Обзор косметики', 
        thumbnail: '/images/poster.png',
        duration: '0:18',
        platform: 'instagram',
        likesCount: 203,
        commentsCount: 15,
        viewsCount: 3200,
        caption: 'Новый обзор косметики! Что стоит попробовать 💄',
        playCount: 12000
      },
      { 
        video: '/video/reels-4.mp4', 
        alt: 'Стильный образ', 
        thumbnail: '/images/poster.png',
        duration: '0:22',
        platform: 'tiktok',
        likesCount: 67,
        commentsCount: 5,
        viewsCount: 1800,
        caption: 'Стильный образ на выходные 👗',
        playCount: 6500
      },
      { 
        video: '/video/reels-5.mp4', 
        alt: 'Тренды красоты', 
        thumbnail: '/images/poster.png',
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
    isInitialLoading,
    isFirstReelsAttempt,
    error,
    bloggerNotFound,
    loadBloggerData,
    startReelsLoading
  }
}
//после перестроение 