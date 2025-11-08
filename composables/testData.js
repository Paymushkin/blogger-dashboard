// Тестовые данные для разработки

export const testBloggerData = {
  name: 'Анна Петрова',
  niche: 'Beauty & Lifestyle',
  avatar: '/images/test-avatar.jpg',
  buttonText: 'Предложить сделку'
}

export const testStats = {
  rating: '4.8',
  status: 'ТОП',
  completedDeals: '156',
  serviceTime: '2 г. 3 мес.'
}

// Варианты флагов (redFlags):
// - 'low_er' - низкий ER (менее 1%)
// - 'fake_engagement' - высокий ER (выше 6%) в сочетании с охватами менее 1000 = накрутка или чаты активности
// - 'high_frequency' - частотность публикации (более 10 в неделю)
// - 'hidden_likes' - скрыты лайки
// - 'low_reach_ratio' - соотношение охватов к подписчикам менее 15%
// - 'spam_blog' - соотношение охватов к подписчикам более 100% в сочетании с аномалией = спам блог

// Общие AI данные (используются для всех соцсетей с полным доступом)


export const getTestSocialNetworks = (socialIconByName) => [
  {
    name: 'Instagram',
    iconPath: socialIconByName.Instagram,
    count: '125K',
    active: true,
    aiAccess: 'full',
    analytics: {
      // redFlags: ['low_er', 'low_reach_ratio'],
      avgLikes: '7522',
      avgComments: '142',
      postsPerMonth: '17',
      engagementRate: '3.38%',
      followers: '226 898',
      following: '234',
      followersToFollowingRatio: '274.3',
      avgReachPosts: '557K',
      avgReachReels: '264K',
      overallScore: '7.5',
      activityScore: '7',
      thematicScore: '8',
      engagementScore: '7',
      confidenceScore: 'Средняя',
      dataDate: '20.12.2024',
      blogDescription: 'Тематика блогера охватывает уход за домом и лайфхаки, что делает его контент универсальным для товарных интеграций. Вовлеченность аудитории составляет 3.38%, что указывает на высокую, но не максимальную активность. Частота публикаций 0.61 постов в день свидетельствует о стабильной активности, но не о высокой.',
      audienceDescription: 'Аудитория блогера состоит преимущественно из женщин в возрасте 25-40 лет, проживающих в городах. Они имеют средний и выше среднего уровень дохода, что позволяет им активно интересоваться вопросами ухода за домом и организации пространства. Подписчицы ищут практические советы и лайфхаки для улучшения домашнего уюта и эффективного ведения хозяйства, а также вдохновение для кулинарных экспериментов.',
      topics: [
        'лайфхаки по уборке',
        'организация пространства',
        'экономия на доставке'
      ],
      profileUrl: 'https://www.instagram.com/ssh_ilina'
    }
  },
  {
    name: 'Instagram 2',
    iconPath: socialIconByName.Instagram,
    count: '1000',
    active: true,
    aiAccess: 'full',
    analytics: {
      redFlags: ['low_er', 'low_reach_ratio', 'hidden_likes'],
      avgLikes: '0',
      avgComments: '0',
      postsPerMonth: '0.8',
      engagementRate: '0',
      followers: '4269',
      following: '1224',
      followersToFollowingRatio: '274.3',
      avgReachPosts: '421',
      avgReachReels: '1893',
      overallScore: '2.8',
      activityScore: '2',
      thematicScore: '7',
      engagementScore: '0',
      confidenceScore: 'Средняя',
      dataDate: '20.12.2024',
      blogDescription: 'Тематика блогера охватывает области саморазвития, эстетики и отношений, что дает умеренную универсальность для товарных интеграций. Однако, Engagement Rate составляет 0.00%, что указывает на очень низкую вовлеченность аудитории. Частота публикаций также крайне низкая (0.03 постов/день), что свидетельствует о низкой активности блогера.',
      audienceDescription: 'Аудитория блогера состоит преимущественно из женщин в возрасте 20-30 лет, интересующихся саморазвитием и эстетикой повседневной жизни. Они, как правило, проживают в крупных городах и имеют средний уровень дохода, что позволяет им уделять внимание самообслуживанию и уходу за собой. Подписчики ищут вдохновение в микромоментах и стремятся к гармонии в отношениях, а также интересуются сотрудничеством с брендами, которые разделяют их ценности.',
      topics: ["осознанное потребление","микромоменты счастья","уход за собой"],
      profileUrl: 'https://www.instagram.com/heyitsllu'
    }
  },
  {
    name: 'TikTok',
    iconPath: socialIconByName.TikTok,
    count: '3000',
    active: true,
    aiAccess: 'basic',
    analytics: {
      // redFlags: ['low_er', 'low_reach_ratio', 'hidden_likes'],
      avgLikes: '0',
      avgComments: '0',
      postsPerMonth: '0.8',
      engagementRate: '4.85%',
      followers: '4269',
      following: '1224',
      followersToFollowingRatio: '274.3',
      avgReachPosts: '421',
      avgReachReels: '1893',
      overallScore: '2.8',
      activityScore: '2',
      thematicScore: '7',
      engagementScore: '0',
      confidenceScore: 'Средняя',
      dataDate: '20.12.2024',
      blogDescription: 'Тематика блогера охватывает области саморазвития, эстетики и отношений, что дает умеренную универсальность для товарных интеграций. Однако, Engagement Rate составляет 0.00%, что указывает на очень низкую вовлеченность аудитории. Частота публикаций также крайне низкая (0.03 постов/день), что свидетельствует о низкой активности блогера.',
      audienceDescription: 'Аудитория блогера состоит преимущественно из женщин в возрасте 20-30 лет, интересующихся саморазвитием и эстетикой повседневной жизни. Они, как правило, проживают в крупных городах и имеют средний уровень дохода, что позволяет им уделять внимание самообслуживанию и уходу за собой. Подписчики ищут вдохновение в микромоментах и стремятся к гармонии в отношениях, а также интересуются сотрудничеством с брендами, которые разделяют их ценности.',
      topics: ["татуировки","бьюти","мода"],
      profileUrl: 'https://www.instagram.com/heyitsllu'
    }
  },
  {
    name: 'YouTube',
    iconPath: socialIconByName.YouTube,
    count: '45K',
    active: true,
    aiAccess: 'unsupported',
    analytics: {
      reach: '12K',
      topics: ['обзоры', 'влоги']
    }
  },
  {
    name: 'Telegram',
    iconPath: socialIconByName.Telegram,
    count: '12K',
    active: true,
    aiAccess: 'unsupported',
    analytics: {
      reach: '3.5K',
      topics: ['новости', 'подборки']
    }
  },
  {
    name: 'VK',
    iconPath: socialIconByName.VK,
    count: '34K',
    active: true,
    aiAccess: 'unsupported',
    analytics: {
      reach: '8K',
      topics: ['посты', 'сообщества']
    }
  },
  {
    name: 'Dzen',
    iconPath: socialIconByName.Dzen,
    count: '23K',
    active: true,
    aiAccess: 'unsupported',
    analytics: {
      reach: '5K',
      topics: ['истории', 'обзоры']
    }
  },
  // {
  //   name: 'Rythm',
  //   iconPath: socialIconByName.Rythm,
  //   count: '15K',
  //   active: true,
  //   aiAccess: 'unsupported',
  //   analytics: {
  //     reach: '2.5K',
  //     topics: ['музыка']
  //   }
  // },
  // {
  //   name: 'Wibes',
  //   iconPath: socialIconByName.Wibes,
  //   count: '8K',
  //   active: true,
  //   aiAccess: 'unsupported',
  //   analytics: {
  //     reach: '1.2K',
  //     topics: ['эксперименты']
  //   }
  // }
]

export const testWorkExamples = [
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

// Общие AI данные (используются как fallback, если нет данных в analytics конкретной соцсети)
export const testAiData = {
  finalScore: '9.6/10',
  description: 'Эстетичный визуал, аутфиты, уход, сторис с рекомендациями. Часто использует рилсы и карусели.',
  productScore: '10',
  productComment: 'Идеальный fit с модой',
  audienceScore: '10',
  audienceComment: 'Ядро — молодые мамы, следят за стилем',
  matchScore: '9.6',
  matchComment: 'Максимальное соответствие'
}

export const testReviews = {
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

