<template>
  <div class="space-y-5">
  <!-- Контейнер 1. Оценка блога -->
  <div class="panel-gradient rounded-xl p-5 backdrop-blur-[10px] border border-white/10 space-y-4" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <!-- Табы соцсетей -->
    <div class="flex items-center justify-between gap-3">
      <div class="flex flex-wrap gap-2 items-center">
        <button
          v-for="(s, index) in (socialNetworks || []).filter(sn => sn.active !== false && sn.name)"
          :key="`social-${index}-${s.name || 'unknown'}`"
          @click="$emit('select', s.name)"
          :class="['rounded-md transition-all p-1', s.name === activeNetwork ? 'bg-cyan-400/30 ring-2 ring-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]' : 'bg-white/10 hover:bg-white/20']"
        >
          <img 
            :src="getSocialIcon(s.name)" 
            :alt="s.name" 
            class="w-5 h-5"
            @error="handleIconError($event, s.name)"
          />
        </button>
      </div>
      <div class="hidden md:flex items-center gap-2">
        <span class="text-xs text-white/70">Итоговая оценка</span>
        <span class="text-2xl font-semibold" :class="scoreClass">{{ displayData.finalScore }}</span>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <h3 class="text-sm text-white/80">{{ activeNetwork || 'Соцсеть' }}</h3>
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
      <div class="bg-white/10 rounded-lg p-4 col-span-2 sm:col-span-1">
        <div class="text-xs text-white/70">Тематика</div>
        <div class="text-white/90 text-sm">{{ displayData.topics.join(', ') }}</div>
      </div>
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70">Подписчики</div>
        <div class="text-2xl font-semibold text-white">{{ displayData.followers }}</div>
      </div>
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70">ER</div>
        <div class="text-2xl font-semibold text-white">{{ displayData.er }}</div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70">Среднее число лайков</div>
        <div class="text-2xl font-semibold text-white">{{ displayData.avgLikes }}</div>
      </div>
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70">Среднее число комментариев</div>
        <div class="text-2xl font-semibold text-white">{{ displayData.avgComments }}</div>
      </div>
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70">Средний охват</div>
        <div class="text-2xl font-semibold text-white">{{ displayData.reach }}</div>
      </div>
      <div class="bg-white/10 rounded-lg p-4 md:hidden">
        <div class="text-xs text-white/70">Итоговая оценка</div>
        <div class="text-2xl font-semibold" :class="scoreClass">{{ displayData.finalScore }}</div>
      </div>
    </div>

    <div class="bg-white/10 rounded-lg p-4">
      <div class="text-xs text-white/70 mb-1">Описание</div>
      <div class="text-white/90 text-sm whitespace-pre-line">{{ displayData.description }}</div>
    </div>
  </div>

  <!-- Контейнер 2. Оценка товар/аудитория/соответствие -->
  <div class="panel-gradient rounded-xl p-5 backdrop-blur-[10px] border border-white/10 space-y-4 mt-5" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <h3 class="text-sm text-white/80">Оценка товара и соответствия</h3>
    <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
      <!-- Блок оценки товара временно скрыт по запросу
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70">Оценка товара</div>
        <div class="text-xl font-semibold text-white">{{ data.productScore }}</div>
        <div class="text-white/80 text-sm mt-1">{{ data.productComment }}</div>
      </div>
      -->
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70">Оценка аудитории</div>
        <div class="text-xl font-semibold text-white">{{ displayData.audienceScore }}</div>
        <div class="text-white/80 text-sm mt-1">{{ displayData.audienceComment }}</div>
      </div>
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70">Соответствие блога товару</div>
        <div class="text-xl font-semibold text-white">{{ displayData.matchScore }}</div>
        <div class="text-white/80 text-sm mt-1">{{ displayData.matchComment }}</div>
      </div>
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70">Оценка товара</div>
        <div class="text-xl font-semibold text-white">{{ displayData.productScore }}</div>
        <div class="text-white/80 text-sm mt-1">{{ displayData.productComment }}</div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'AiInsights',
  props: {
    data: {
      type: Object,
      default: () => ({
        finalScore: '9/10',
        topics: ['материнство', 'мода и стиль', 'UGC-контент'],
        description: 'Создаю эстетичный контент со смыслом🎞️ В декрете, но выбираю ухоженность и стиль\nМатеринство • спорт • осознанность',
        followers: '12 500',
        er: '6,2%',
        avgLikes: '138',
        avgComments: '8',
        productScore: '10',
        productComment: "Тематика товара (модный свитер) отлично совпадает с ключевыми темами блога: 'мода и стиль', 'распаковки WB' и 'эстетика'",
        audienceScore: '10',
        audienceComment: 'Идеальное попадание: молодые мамы, следящие за стилем и маркетплейсами. Уверенность высокая.',
        matchScore: '9.4',
        matchComment: 'Идеальное соответствие'
      })
    },
    socialNetworks: { type: Array, default: () => [] },
    activeNetwork: { type: String, default: '' }
  },
  methods: {
    getSocialIcon(socialName) {
      console.log('Получение иконки для:', socialName)
      const iconMap = {
        'Instagram': '/icons/instagram.svg',
        'YouTube': '/icons/youtube.svg',
        'TikTok': '/icons/tiktok.svg',
        'Telegram': '/icons/telegram.svg',
        'VK': '/icons/vk.svg',
        'Dzen': '/icons/dzen.svg',
        'Rythm': '/icons/rythm.svg',
        'Wibes': '/icons/wibes.svg'
      }
      const iconPath = iconMap[socialName] || '/icons/instagram.svg'
      console.log('Путь к иконке:', iconPath)
      return iconPath
    },
    handleIconError(event, socialName) {
      console.log(`Ошибка загрузки иконки для ${socialName}`)
      // Показываем дефолтную иконку Instagram
      event.target.src = '/icons/instagram.svg'
    }
  },
  mounted() {
    console.log('AiInsights mounted, socialNetworks:', this.socialNetworks)
  },
  computed: {
    displayData() {
      const map = {
        Instagram: { finalScore: '9.6/10', productScore: '10', productComment: 'Идеальный fit с модой', followers: '12 500', er: '6,8%', avgLikes: '220', avgComments: '14', reach: '28K', topics: ['мода', 'лайфстайл'], audienceScore: '10', audienceComment: 'Ядро — молодые мамы, следят за стилем', matchScore: '9.6', matchComment: 'Максимальное соответствие', description: 'Эстетичный визуал, аутфиты, уход, сторис с рекомендациями. Часто использует рилсы и карусели.' },
        YouTube: { finalScore: '9.0/10', productScore: '9', productComment: 'Отлично для обзоров', followers: '3 100', er: '5,1%', avgLikes: '180', avgComments: '22', reach: '6.2K', topics: ['обзоры', 'влоги'], audienceScore: '9', audienceComment: 'Немного шире ядра, но релевантно', matchScore: '9.0', matchComment: 'Высокое соответствие', description: 'Длинные обзоры покупок, влоги из повседневной жизни, подробные разборы образов.' },
        TikTok: { finalScore: '9.5/10', productScore: '10', productComment: 'Сильный трендовый канал', followers: '25 000', er: '9,2%', avgLikes: '1 100', avgComments: '35', reach: '55K', topics: ['тренды', 'советы'], audienceScore: '10', audienceComment: 'Очень активная молодая аудитория', matchScore: '9.5', matchComment: 'Идеальное соответствие', description: 'Короткие трендовые видео, быстрые советы по стилю и уходу, динамичная подача.' },
        Telegram: { finalScore: '8.9/10', productScore: '8', productComment: 'Хорошо для подборок', followers: '4 000', er: '12,3%', avgLikes: '—', avgComments: '—', reach: '3.1K', topics: ['подборки', 'новости'], audienceScore: '9', audienceComment: 'Лояльное ядро подписчиков', matchScore: '8.8', matchComment: 'Хорошее соответствие', description: 'Подборки, ссылки на товары, промокоды, личные заметки и бэкстейдж.' },
        VK: { finalScore: '8.6/10', productScore: '8', productComment: 'Подходит для постов', followers: '8 000', er: '4,9%', avgLikes: '90', avgComments: '6', reach: '5.6K', topics: ['посты', 'сообщества'], audienceScore: '8', audienceComment: 'Чуть шире, часть вне ядра', matchScore: '8.5', matchComment: 'Средне-высокое соответствие', description: 'Длинные посты с фото, репосты из других сетей, активность в сообществах.' },
        Dzen: { finalScore: '7.9/10', productScore: '7', productComment: 'Истории/обзоры', followers: '2 000', er: '3,9%', avgLikes: '45', avgComments: '5', reach: '1.2K', topics: ['истории', 'обзоры'], audienceScore: '7', audienceComment: 'Более зрелая аудитория', matchScore: '7.9', matchComment: 'Умеренное соответствие', description: 'Истории и текстовые обзоры с фото, упор на жизненный опыт и полезность.' },
        Rythm: { finalScore: '7.0/10', productScore: '6', productComment: 'Вспомогательный канал', followers: '1 000', er: '—', avgLikes: '—', avgComments: '—', reach: '—', topics: ['музыка'], audienceScore: '6', audienceComment: 'Небольшая доля', matchScore: '7.0', matchComment: 'Нейтрально', description: 'Редкие публикации, акцент на музыку/ритм, экспериментальные форматы.' },
        Wibes: { finalScore: '7.0/10', productScore: '6', productComment: 'Экспериментальная сеть', followers: '700', er: '—', avgLikes: '—', avgComments: '—', reach: '—', topics: ['соцсеть'], audienceScore: '6', audienceComment: 'Небольшая доля', matchScore: '7.0', matchComment: 'Нейтрально', description: 'Тестирует площадку, публикует короткие заметки и подборки.' }
      }
      return map[this.activeNetwork] || this.data
    },
    scoreClass() {
      // извлекаем числовое значение перед "/10"
      const raw = (this.displayData.finalScore || '').toString()
      const num = parseFloat(raw.replace(/[,]/g, '.')) || 0
      if (num >= 9) return 'text-emerald-300'
      if (num >= 7.5) return 'text-yellow-300'
      return 'text-red-300'
    }
  }
}
</script>


