<template>
  <div class="space-y-5">
    <!-- Контейнер аналитики ИИ -->
    <div class="panel-gradient rounded-xl p-5 backdrop-blur-[10px] border border-white/10 space-y-4" 
         style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
      
      <!-- Заголовок и табы соцсетей -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 class="text-lg font-semibold text-white">Аналитика ИИ</h2>
        <div class="flex flex-wrap gap-1 sm:gap-2 items-center">
          <button
            v-for="(social, index) in activeSocialNetworks"
            :key="`social-${index}-${social.name}`"
            @click="selectNetwork(social.name)"
            :class="[
              'rounded-md transition-all p-1.5 sm:p-2 flex items-center gap-1 sm:gap-2',
              social.name === activeNetwork 
                ? 'bg-cyan-400/30 ring-2 ring-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]' 
                : 'bg-white/10 hover:bg-white/20'
            ]"
          >
            <img 
              :src="getSocialIcon(social.name)" 
              :alt="social.name" 
              class="w-3 h-3 sm:w-4 sm:h-4"
              @error="handleIconError($event, social.name)"
            />
            <span class="text-[10px] sm:text-xs text-white">{{ social.name }}</span>
          </button>
        </div>
      </div>

      <!-- Контент для выбранной соцсети -->
      <div v-if="isSecondaryInstagram" class="space-y-4">
        <!-- Компактный режим для Instagram 2 -->
        <div class="bg-white/10 rounded-lg p-3">
          <h3 class="text-xs font-medium text-white/80 mb-2">Краткий анализ</h3>
          <div class="grid grid-cols-2 gap-2">
            <div class="text-left space-y-0.5">
              <div class="text-[11px] text-white/60">ER</div>
              <div class="text-base font-semibold text-white">{{ (currentNetworkData && currentNetworkData.engagementRate) || aiData.er || '—' }}</div>
            </div>
            <div class="text-left space-y-0.5">
              <div class="text-[11px] text-white/60">Охваты</div>
              <div class="text-base font-semibold text-white">{{ currentReach }}</div>
            </div>
          </div>
        </div>

        <!-- Тематика для Instagram 2 -->
        <div v-if="(aiData.topics && aiData.topics.length) || (currentNetworkData && currentNetworkData.topics && currentNetworkData.topics.length)" class="bg-white/10 rounded-lg p-4">
          <h3 class="text-sm font-medium text-white/80 mb-2">Тематика</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(topic, i) in (aiData.topics && aiData.topics.length ? aiData.topics : (currentNetworkData ? currentNetworkData.topics : []))"
              :key="`topic-ig2-${i}`"
              class="text-xs px-2 py-1 rounded-md bg-white/15 text-white/90"
            >{{ topic }}</span>
          </div>
        </div>

        <!-- CTA подписки -->
        <div class="bg-white/10 rounded-lg p-3 sm:p-4">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
            <div class="flex-1">
              <div class="text-sm font-medium text-white">Полная аналитика доступна по подписке</div>
              <div class="text-xs text-white/70 mt-1">Оформите подписку, чтобы открыть все метрики и сравнения.</div>
            </div>
            <a href="/subscribe" class="inline-flex items-center justify-center px-3 py-2 rounded-md bg-cyan-500/90 text-white text-sm hover:bg-cyan-400 transition-colors w-full sm:w-auto">Оформить подписку</a>
          </div>
        </div>
      </div>

      <div v-else-if="isPrimaryInstagram" class="space-y-4">
        
        <!-- Количественный анализ -->
        <div class="bg-white/10 rounded-lg p-3">
          <h3 class="text-xs font-medium text-white/80 mb-2">Количественный анализ</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            <div class="text-left space-y-0.5">
              <div class="text-[11px] text-white/60">Avg Likes</div>
              <div class="text-base font-semibold text-white">{{ currentNetworkData.avgLikes || '0.0' }}</div>
            </div>
            <div class="text-left space-y-0.5">
              <div class="text-[11px] text-white/60">Avg Comments</div>
              <div class="text-base font-semibold text-white">{{ currentNetworkData.avgComments || '0.0' }}</div>
            </div>
            <div class="text-left space-y-0.5">
              <div class="text-[11px] text-white/60">Posts/Month</div>
              <div class="text-base font-semibold text-white">{{ currentNetworkData.postsPerMonth || '0.0' }}</div>
            </div>
            <div class="text-left space-y-0.5">
              <div class="text-[11px] text-white/60">Engagement Rate</div>
              <div class="text-base font-semibold text-white">{{ currentNetworkData.engagementRate || '0.00%' }}</div>
            </div>
            <div class="text-left space-y-0.5">
              <div class="text-[11px] text-white/60">Охваты постов</div>
              <div class="text-base font-semibold text-white">{{ currentNetworkData.avgReachPosts || '—' }}</div>
            </div>
            <div class="text-left space-y-0.5">
              <div class="text-[11px] text-white/60">Охваты рилсов</div>
              <div class="text-base font-semibold text-white">{{ currentNetworkData.avgReachReels || '—' }}</div>
            </div>
            <div class="text-left space-y-0.5">
              <div class="text-[11px] text-white/60">Подписчики</div>
              <div class="text-base font-semibold text-white">{{ formatNumber(currentNetworkData.followers) }}</div>
            </div>
            <div class="text-left space-y-0.5">
              <div class="text-[11px] text-white/60">Подписки</div>
              <div class="text-base font-semibold text-white">{{ formatNumber(currentNetworkData.following) }}</div>
            </div>
            <div class="text-left space-y-0.5">
              <div class="text-[11px] text-white/60">Подписчики/Подписки</div>
              <div class="text-base font-semibold text-white">{{ currentNetworkData.followersToFollowingRatio || '0' }}%</div>
            </div>
          </div>
        </div>

        <!-- Ссылка на блог -->
        <div v-if="currentProfileUrl" class="bg-white/10 rounded-lg p-3 sm:p-4">
          <h3 class="text-xs font-medium text-white/80 mb-2">Ссылка на блог</h3>
          <a :href="currentProfileUrl" target="_blank" rel="noopener" class="text-cyan-300 hover:underline break-all">{{ currentProfileUrl }}</a>
        </div>

        <!-- Оценки сервиса -->
        <div class="bg-white/10 rounded-lg p-3 sm:p-4">
          <!-- <h3 class="text-sm font-medium text-white/80 mb-3">Оценка Unpacks</h3> -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="text-left text-xs text-white/70 py-2"></th>
                  <th class="text-right text-xs text-white/70 py-2">Оценка</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-white/5">
                  <td class="text-sm text-white/90 py-2">Активность</td>
                  <td class="text-right">
                    <span class="text-lg font-semibold" :class="getScoreClass(currentNetworkData.activityScore)">
                      {{ currentNetworkData.activityScore || '0' }}
                    </span>
                  </td>
                </tr>
                <tr class="border-b border-white/5">
                  <td class="text-sm text-white/90 py-2">Тематика</td>
                  <td class="text-right">
                    <span class="text-lg font-semibold" :class="getScoreClass(currentNetworkData.thematicScore)">
                      {{ currentNetworkData.thematicScore || '0' }}
                    </span>
                  </td>
                </tr>
                <tr class="border-b border-white/5">
                  <td class="text-sm text-white/90 py-2">Вовлеченность</td>
                  <td class="text-right">
                    <span class="text-lg font-semibold" :class="getScoreClass(currentNetworkData.engagementScore)">
                      {{ currentNetworkData.engagementScore || '0' }}
                    </span>
                  </td>
                </tr>
                <tr class="border-t border-white/20 bg-white/5">
                  <td class="text-sm font-medium text-white py-2">Общая оценка</td>
                  <td class="text-right">
                    <span class="text-xl font-bold" :class="getScoreClass(currentNetworkData.overallScore)">
                      {{ currentNetworkData.overallScore || '0.0' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Уровень уверенности -->
          <div class="mt-4 pt-4 border-t border-white/10">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-white/70">Надежность оценки</div>
                <div class="text-sm font-medium text-white">{{ currentNetworkData.confidenceScore || 'Неизвестно' }}</div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :class="getConfidenceColor(currentNetworkData.confidenceScore)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Описание аудитории (если есть текст) -->
      <div v-if="isPrimaryInstagram && aiData && (aiData.audienceDescription || aiData.audienceComment)" class="bg-white/10 rounded-lg p-3 sm:p-4">
        <h3 class="text-sm font-medium text-white/80 mb-2">Аудитория</h3>
        <div class="text-white/90 text-sm leading-relaxed whitespace-pre-line">
          {{ aiData.audienceDescription || aiData.audienceComment }}
        </div>
      </div>

      <!-- Описание блога -->
      <div v-if="isPrimaryInstagram && aiData && aiData.blogDescription" class="bg-white/10 rounded-lg p-3 sm:p-4">
        <h3 class="text-sm font-medium text-white/80 mb-2">Описание блога</h3>
        <div class="text-white/90 text-sm leading-relaxed whitespace-pre-line">
          {{ aiData.blogDescription }}
        </div>
      </div>

      <!-- Тематика ниже общего описания -->
      <div v-if="isPrimaryInstagram && ((aiData.topics && aiData.topics.length) || (currentNetworkData && currentNetworkData.topics && currentNetworkData.topics.length))" class="bg-white/10 rounded-lg p-3 sm:p-4">
        <h3 class="text-sm font-medium text-white/80 mb-2">Тематика</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(topic, i) in (aiData.topics && aiData.topics.length ? aiData.topics : (currentNetworkData ? currentNetworkData.topics : []))"
            :key="`topic-bottom-${i}`"
            class="text-xs px-2 py-1 rounded-md bg-white/15 text-white/90"
          >{{ topic }}</span>
        </div>
      </div>

      <!-- Сообщение для других соцсетей -->
      <div v-if="!isPrimaryInstagram && !isSecondaryInstagram" class="space-y-4">
        <div class="bg-white/10 rounded-lg p-3 sm:p-4">
          <h3 class="text-xs font-medium text-white/80 mb-2">Охваты (заявленные блоггером)</h3>
          <div class="text-base font-semibold text-white">{{ currentReach }}</div>
        </div>
        <div v-if="(aiData.topics && aiData.topics.length) || (currentNetworkData && currentNetworkData.topics && currentNetworkData.topics.length)" class="bg-white/10 rounded-lg p-3 sm:p-4">
          <h3 class="text-sm font-medium text-white/80 mb-2">Тематика</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(topic, i) in (aiData.topics && aiData.topics.length ? aiData.topics : (currentNetworkData ? currentNetworkData.topics : []))"
              :key="`topic-other-${i}`"
              class="text-xs px-2 py-1 rounded-md bg-white/15 text-white/90"
            >{{ topic }}</span>
          </div>
        </div>
        <div class="bg-white/10 rounded-lg p-3 sm:p-4 text-center">
          <div class="text-white/70">Аналитика этой соцсети в разработке</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AiAnalytics',
  props: {
    socialNetworks: {
      type: Array,
      default: () => []
    },
    aiData: {
      type: Object,
      default: () => ({})
    },
    hasSubscription: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeNetwork: '',
      // Данные для каждой соцсети (в реальном проекте это будет приходить с API)
      networkAnalytics: {
        'Instagram': {
          avgLikes: 125.6,
          avgComments: 25.6,
          postsPerMonth: 12.5,
          engagementRate: '4.2%',
          followers: 64180,
          following: 234,
          followersToFollowingRatio: 274.27,
          avgReachPosts: '8.2K',
          avgReachReels: '15.6K',
          blogDescription: 'Аудитория блогера - преимущественно женщины в возрасте 25-40 лет, заинтересованные в здоровье детей, косметике и фитнесе. Они имеют средний и выше среднего уровень дохода, проживают в городах с развитой инфраструктурой.',
          overallScore: 4.6,
          activityScore: 3,
          thematicScore: 7,
          engagementScore: 2,
          confidenceScore: 'Средняя'
        },
        'TikTok': {
          avgLikes: 89.3,
          avgComments: 12.4,
          postsPerMonth: 8.2,
          engagementRate: '6.8%',
          followers: 25000,
          following: 156,
          followersToFollowingRatio: 160.26,
          avgReachPosts: '5.1K',
          avgReachReels: '12.3K',
          blogDescription: 'Молодая активная аудитория 18-30 лет, интересующаяся трендами, модой и развлечениями. Высокая вовлеченность в контент.',
          overallScore: 3.8,
          activityScore: 4,
          thematicScore: 6,
          engagementScore: 5,
          confidenceScore: 'Высокая'
        },
        'YouTube': {
          avgLikes: 45.2,
          avgComments: 8.7,
          postsPerMonth: 2.1,
          engagementRate: '2.1%',
          followers: 12000,
          following: 89,
          followersToFollowingRatio: 134.83,
          avgReachPosts: '3.2K',
          avgReachReels: '—',
          blogDescription: 'Более зрелая аудитория, интересующаяся подробными обзорами и образовательным контентом.',
          overallScore: 3.2,
          activityScore: 2,
          thematicScore: 5,
          engagementScore: 3,
          confidenceScore: 'Низкая'
        },
        'Telegram': {
          avgLikes: '—',
          avgComments: '—',
          postsPerMonth: 15.6,
          engagementRate: '8.4%',
          followers: 4000,
          following: 45,
          followersToFollowingRatio: 88.89,
          avgReachPosts: '2.8K',
          avgReachReels: '—',
          blogDescription: 'Лояльная аудитория подписчиков, активно взаимодействующая с контентом через комментарии.',
          overallScore: 4.1,
          activityScore: 6,
          thematicScore: 4,
          engagementScore: 7,
          confidenceScore: 'Средняя'
        }
      }
    }
  },
  computed: {
    activeSocialNetworks() {
      return this.socialNetworks.filter(social => social.active !== false)
    },
    currentNetworkData() {
      return this.networkAnalytics[this.activeNetwork] || null
    },
    isSecondaryInstagram() {
      const name = this.activeNetwork || ''
      return name.toLowerCase().includes('instagram 2') || name.toLowerCase().includes('instagram2')
    },
    isPrimaryInstagram() {
      const name = this.activeNetwork || ''
      return name.toLowerCase() === 'instagram'
    },
    currentProfileUrl() {
      const item = (this.socialNetworks || []).find(s => s && (s.name === this.activeNetwork || s.baseName === this.activeNetwork))
      const fromNetwork = item && item.profileUrl ? item.profileUrl : null
      return fromNetwork || (this.aiData && this.aiData.profileUrl) || null
    },
    currentReach() {
      const item = (this.socialNetworks || []).find(s => s && (s.name === this.activeNetwork || s.baseName === this.activeNetwork))
      return (item && item.reach) ? item.reach : (this.aiData && this.aiData.reach) ? this.aiData.reach : '—'
    },
    showFallback() {
      // Показывать нижний фолбек только если не компактный режим IG2
      return !(this.isSecondaryInstagram && !this.hasSubscription)
    }
  },
  methods: {
    selectNetwork(networkName) {
      this.activeNetwork = networkName
      this.$emit('network-selected', networkName)
    },
    getSocialIcon(socialName) {
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
      return iconMap[socialName] || '/icons/instagram.svg'
    },
    handleIconError(event, socialName) {
      console.log(`Ошибка загрузки иконки для ${socialName}`)
      event.target.src = '/icons/instagram.svg'
    },
    formatNumber(num) {
      if (!num) return '0'
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toString()
    },
    getScoreClass(score) {
      const num = parseFloat(score) || 0
      if (num >= 7) return 'text-emerald-300'
      if (num >= 5) return 'text-yellow-300'
      if (num >= 3) return 'text-orange-300'
      return 'text-red-300'
    },
    getConfidenceColor(confidence) {
      switch (confidence) {
        case 'Высокая': return 'bg-emerald-400'
        case 'Средняя': return 'bg-yellow-400'
        case 'Низкая': return 'bg-red-400'
        default: return 'bg-gray-400'
      }
    }
  },
  watch: {
    socialNetworks: {
      immediate: true,
      handler(newList) {
        if (!this.activeNetwork && Array.isArray(newList) && newList.length > 0) {
          const firstActive = newList.find(s => s && s.active !== false && s.name)
          if (firstActive && firstActive.name) {
            this.activeNetwork = firstActive.name
          }
        }
      }
    }
  },
  mounted() {
    // Автоматически выбираем первую доступную соцсеть
    if (this.activeSocialNetworks.length > 0) {
      this.activeNetwork = this.activeSocialNetworks[0].name
    }
  }
}
</script>
