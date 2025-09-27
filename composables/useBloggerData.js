export const useBloggerData = () => {
  const bloggerData = ref({
    name: 'Екатерина Иванова',
    niche: 'Lifestyle',
    avatar: '/images/avatar.png',
    buttonText: 'Предложить сделку'
  })
  
  const socialNetworks = ref([
    { name: 'Telegram', iconPath: '/icons/telegram.svg', count: '11K' },
    { name: 'YouTube', iconPath: '/icons/youtube.svg', count: '11K' },
    { name: 'TikTok', iconPath: '/icons/tiktok.svg', count: '11K' },
    { name: 'Instagram', iconPath: '/icons/instagram.svg', count: '11K' },
    { name: 'VK', iconPath: '/icons/vk.svg', count: '11K' },
    { name: 'Dzen', iconPath: '/icons/dzen.svg', count: '11K' },
    { name: 'Rythm', iconPath: '/icons/rythm.svg', count: '11K' },
    { name: 'Wibes', iconPath: '/icons/wibes.svg', count: '11K' }
  ])
  
  const stats = ref({
    rating: '4,96',
    status: 'ТОП',
    completedDeals: '285'
  })
  
  const workExamples = ref({
    title: 'Примеры работ',
    viewAllText: 'смотреть все',
    examples: [
      { video: '/video/reels-1.mp4', alt: 'Пример работы 1' },
      { video: '/video/reels-2.mp4', alt: 'Пример работы 2' },
      { video: '/video/reels-3.mp4', alt: 'Пример работы 3' },
      { video: '/video/reels-4.mp4', alt: 'Пример работы 4' },
      { video: '/video/reels-5.mp4', alt: 'Пример работы 5' }
    ]
  })
  
  // Функция для маскирования имени
  const maskName = (name) => {
    if (!name || name.length <= 2) return name
    if (name.length <= 4) return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
    return name[0] + name[1] + '*'.repeat(name.length - 4) + name[name.length - 2] + name[name.length - 1]
  }

  const reviews = ref({
    title: 'Отзывы (285)',
    viewAllText: 'смотреть все',
      reviews: [
        {
          name: maskName('samosveta_ru'),
          date: '1.8.2025',
          text: 'Все супер',
          rating: 5
        },
        {
          name: maskName('samosveta_ru'),
          date: '20.5.2025',
          text: 'Супер',
          rating: 5
        },
        {
          name: maskName('momysovenka'),
          date: '1.4.2025',
          text: 'Быстро одобрил. Если возникали вопросы то в чате их решили. Всё супер! Интеграция выложена',
          rating: 5
        },
        {
          name: maskName('RiErmO'),
          date: '5.3.2025',
          text: 'Все супер! Товар понравился!',
          rating: 5
        },
        {
          name: maskName('Jyatsuk'),
          date: '1.3.2025',
          text: 'Спасибо селлеру за классный продукт и возможность поэкспериментировать',
          rating: 5
        },
        {
          name: maskName('yaamina11'),
          date: '25.2.2025',
          text: 'Все понравилось',
          rating: 4
        },
        {
          name: maskName('nastenaandreeva'),
          date: '19.2.2025',
          text: 'Было приятно поработать 🩵',
          rating: 5
        },
        {
          name: maskName('solowey'),
          date: '17.2.2025',
          text: 'Все прекрасно!',
          rating: 5
        },
        {
          name: maskName('solowey'),
          date: '14.2.2025',
          text: 'Обожаю работать с этим селлером!',
          rating: 5
        },
        {
          name: maskName('solowey'),
          date: '13.2.2025',
          text: 'Все отлично!',
          rating: 5
        },
        {
          name: maskName('marisha423'),
          date: '13.2.2025',
          text: 'сделка прошла быстро, без заморочек, приятно было поработать с этим брендом',
          rating: 4
        },
        {
          name: maskName('SofaKarbova'),
          date: '12.2.2025',
          text: 'Отличный диффузор, закажу еще',
          rating: 5
        },
        {
          name: maskName('solowey'),
          date: '10.2.2025',
          text: 'Отлично!',
          rating: 5
        },
        {
          name: maskName('lyubov_matveeva'),
          date: '10.2.2025',
          text: 'Все прошло хорошо, я с удовольствием сделала обзор на товар, мне искренне понравился диффузор.',
          rating: 5
        },
        {
          name: maskName('Guzelka02'),
          date: '8.2.2025',
          text: 'Диффузор очень понравился, доставка была быстрой👍🏻',
          rating: 4
        },
        {
          name: maskName('anastebond'),
          date: '6.2.2025',
          text: 'Спасибо большое за сотрудничество',
          rating: 5
        },
        {
          name: maskName('lixay_a'),
          date: '6.2.2025',
          text: 'Все по этапно объяснили, дружелюбно разговаривали, быстро оформили все. Очень понравилась работа с селлером. Спасибо за всё🤍',
          rating: 5
        },
        {
          name: maskName('lubovbchk'),
          date: '5.2.2025',
          text: 'Благодарю за сотрудничество 🤍',
          rating: 5
        },
        {
          name: maskName('solowey'),
          date: '4.2.2025',
          text: 'Как всегда — отлично!',
          rating: 5
        },
        {
          name: maskName('solowey'),
          date: '3.2.2025',
          text: 'Потрясающий селлер! Быстро отвечает',
          rating: 5
        }
      ]
  })
  
  const totalFollowers = computed(() => {
    return socialNetworks.value.reduce((total, social) => {
      const count = parseInt(social.count.replace('K', '000'))
      return total + count
    }, 0)
  })
  
  return {
    bloggerData,
    socialNetworks,
    stats,
    workExamples,
    reviews,
    totalFollowers
  }
}
