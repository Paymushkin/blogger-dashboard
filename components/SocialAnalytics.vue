<template>
  <div class="panel-gradient rounded-xl p-5 backdrop-blur-[10px] border border-white/10" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm text-white/80">Аналитика (ИИ)</h3>
      <span class="text-xs text-white/60">{{ activeNetwork }}</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70">Средний охват</div>
        <div class="text-2xl font-semibold text-white">{{ data.reach }}</div>
      </div>
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70">ER (вовлечённость)</div>
        <div class="text-2xl font-semibold text-white">{{ data.er }}</div>
      </div>
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70">Частота публикаций</div>
        <div class="text-2xl font-semibold text-white">{{ data.frequency }}</div>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70 mb-1">Тематика контента</div>
        <div class="text-white/90 text-sm">{{ data.topics.join(', ') }}</div>
      </div>
      <div class="bg-white/10 rounded-lg p-4">
        <div class="text-xs text-white/70 mb-1">Рекомендации ИИ</div>
        <ul class="list-disc list-inside text-white/90 text-sm space-y-1">
          <li v-for="(tip, i) in data.tips" :key="i">{{ tip }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
const defaults = {
  Instagram: {
    reach: '12K', er: '7.8%', frequency: '3/нед',
    topics: ['лайфстайл', 'бьюти', 'обзоры'],
    tips: ['Снимайте карусели до 8 кадров', 'Добавляйте CTA в описания', 'Используйте трендовые аудио']
  },
  YouTube: {
    reach: '8.5K', er: '6.2%', frequency: '1/нед',
    topics: ['обзоры', 'влоги'],
    tips: ['Делайте главы в видео', 'Оптимизируйте превью и заголовки']
  },
  TikTok: {
    reach: '25K', er: '9.4%', frequency: '5/нед',
    topics: ['тренды', 'короткие советы'],
    tips: ['Первые 2 секунды — самое важное', 'Добавляйте субтитры']
  },
  Telegram: {
    reach: '3.1K', er: '12.3%', frequency: '4/нед',
    topics: ['новости', 'подборки'],
    tips: ['Используйте предпросмотр ссылок', 'Через день — опрос или викторина']
  },
  VK: {
    reach: '5.6K', er: '5.2%', frequency: '2/нед',
    topics: ['длинные посты', 'сообщества'],
    tips: ['Добавляйте товары/коллекции', 'Публикуйте сторис при каждом посте']
  },
  Dzen: {
    reach: '2.4K', er: '4.1%', frequency: '2/нед',
    topics: ['истории', 'обзоры'],
    tips: ['Используйте кликабельные заголовки', 'Картинка с крупным объектом']
  },
  Rythm: { reach: 'n/a', er: 'n/a', frequency: 'n/a', topics: ['музыка'], tips: ['Ожидаем данные'] },
  Wibes: { reach: 'n/a', er: 'n/a', frequency: 'n/a', topics: ['соцсеть'], tips: ['Ожидаем данные'] }
}

export default {
  name: 'SocialAnalytics',
  props: {
    activeNetwork: { type: String, required: true }
  },
  computed: {
    data() {
      return defaults[this.activeNetwork] || { reach: 'n/a', er: 'n/a', frequency: 'n/a', topics: [], tips: [] }
    }
  }
}
</script>



