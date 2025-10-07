<template>
  <div class="panel-gradient rounded-xl px-4 md:px-5 backdrop-blur-[10px] border border-white/10" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <div class="divide-y divide-white/10">
      <div class="py-2 flex items-baseline justify-between">
        <span class="text-xs md:text-sm text-white/70 lowercase">средний рейтинг</span>
        <span class="text-xl md:text-2xl font-bold text-white">{{ rating }}</span>
      </div>
      <div class="py-2 flex items-center justify-between">
        <span class="text-xs md:text-sm text-white/70 lowercase">статус</span>
        <span class="text-xl md:text-2xl font-bold text-white">{{ status }}</span>
      </div>
      <div class="py-2 flex items-center justify-between">
        <span class="text-xs md:text-sm text-white/70 lowercase">завершенные сделки</span>
        <span class="text-xl md:text-2xl font-bold text-white">{{ completedDeals }}</span>
      </div>
      <div class="py-2 flex items-center justify-between">
        <span class="text-xs md:text-sm text-white/70 lowercase">работает в сервисе</span>
        <span class="text-xl md:text-2xl font-bold text-white">{{ serviceTime }}</span>
      </div>
      <div class="py-2 flex items-center justify-between">
        <span class="text-xs md:text-sm text-white/70 lowercase">социальные сети</span>
        <div class="flex flex-wrap gap-2 items-center">
          <div
            v-for="social in socialNetworks"
            :key="social.name"
            class="flex flex-col items-center gap-1 bg-white/10 hover:bg-white/20 rounded-md px-2 py-1 cursor-pointer transition-colors"
            @click="openSocialPopup(social)"
          >
            <img 
              :src="social.iconPath" 
              :alt="social.name" 
              class="w-5 h-5 filter brightness-0 invert"
            />
            <span 
              v-if="social.reach" 
              class="text-xs text-cyan-400"
            >
              {{ social.reach }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsBlocks',
  props: {
    rating: {
      type: String,
      default: '5'
    },
    status: {
      type: String,
      default: 'ТОП'
    },
    completedDeals: {
      type: [String, Number],
      default: '82'
    },
    serviceTime: {
      type: String,
      default: '9 мес. 27 д.'
    },
    socialNetworks: {
      type: Array,
      default: () => []
    }
  },
  emits: ['open-social-popup'],
  methods: {
    openSocialPopup(social) {
      const socialData = {
        ...social,
        theme: this.getThemeForSocial(social.name),
        reach: this.getReachForSocial(social.name, social.count, social)
      }
      this.$emit('open-social-popup', socialData)
    },

    getThemeForSocial(name) {
      const themes = {
        'Instagram': 'Beauty & Lifestyle',
        'YouTube': 'Обзоры и влоги',
        'TikTok': 'Тренды и советы',
        'Telegram': 'Подборки и новости',
        'VK': 'Посты и сообщества',
        'Dzen': 'Истории и обзоры',
        'Rythm': 'Музыка',
        'Wibes': 'Экспериментальный контент'
      }
      return themes[name] || 'Не указана'
    },

    getReachForSocial(name, count, socialData) {
      // Используем реальные данные охватов из API (если есть)
      if (socialData.reach) {
        return socialData.reach
      }
      
      // Fallback: если данных из API нет, используем расчет по формуле
      const countNum = parseInt(count.replace(/[^\d]/g, ''))
      const multipliers = {
        'Instagram': 0.06,
        'YouTube': 0.05,
        'TikTok': 0.09,
        'Telegram': 0.12,
        'VK': 0.05,
        'Dzen': 0.04,
        'Rythm': 0.03,
        'Wibes': 0.03
      }
      const reach = Math.round(countNum * (multipliers[name] || 0.05))
      return reach > 1000 ? `${(reach / 1000).toFixed(1)}K` : reach.toString()
    }
  }
}
</script>
