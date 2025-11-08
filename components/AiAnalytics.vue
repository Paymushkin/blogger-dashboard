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
      <!-- Базовый доступ (укороченная аналитика) -->
      <div v-if="isBasicAccess" class="space-y-4">
        <!-- Компактный режим -->
        <div class="bg-white/10 rounded-lg p-3">
          <h3 class="text-xs font-medium text-white/80 mb-2">Краткий анализ</h3>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-2">
              <div class="text-left space-y-0.5">
                <div class="text-[11px] text-white/60">ER</div>
                <div class="text-base font-semibold text-white">{{ currentNetworkData?.engagementRate || '—' }}</div>
              </div>
              <div class="text-left space-y-0.5">
                <div class="text-[11px] text-white/60">Ср. просмотры</div>
                <div class="text-base font-semibold text-white">{{ formatNumber(currentReach) }}</div>
              </div>
            </div>
            <!-- Тематика -->
            <div v-if="currentTopics && currentTopics.length" class="pt-2 border-t border-white/10">
              <div class="text-[11px] text-white/60 mb-1.5">Тематика</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(topic, i) in currentTopics"
                  :key="`topic-basic-${i}`"
                  class="text-xs px-2 py-1 rounded-md bg-white/15 text-white/90"
                >{{ topic }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Переход на соц сеть (недоступен) -->
        <div v-if="currentProfileUrl" class="bg-white/10 rounded-lg p-3 sm:p-4">
          <div class="flex items-center gap-2 text-white/70">
            <LockIcon :size="20" class-prop="text-white/70" />
            <span class="text-sm">Переход на соц сеть доступен с подпиской</span>
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

      <!-- Полный доступ (полная аналитика) -->
      <div v-else-if="isFullAccess" class="space-y-4">
        
        <!-- Всегда видимый блок: ER, охваты, оценка, флаги, ссылка -->
        <div class="bg-white/10 rounded-lg p-3 sm:p-4">
          <div class="flex flex-wrap flex-col sm:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <!-- ER -->
            <div class="flex flex-col">
              <div class="flex items-center gap-1 mb-1">
                <span class="text-xs text-white/70">ER</span>
                <button
                  @click="showTooltip('er')"
                  class="text-white/50 hover:text-white/80 transition-colors"
                >
                  <QuestionIcon :size="14" class-prop="text-white/50" />
                </button>
              </div>
              <span class="text-base font-semibold text-white">{{ currentNetworkData?.engagementRate || '0.00%' }}</span>
            </div>

            <!-- Охваты -->
            <div class="flex flex-col">
              <div class="flex items-center gap-1 mb-1">
                <span class="text-xs text-white/70">Ср. просмотры</span>
                <button
                  @click="showTooltip('reach')"
                  class="text-white/50 hover:text-white/80 transition-colors"
                >
                  <QuestionIcon :size="14" class-prop="text-white/50" />
                </button>
              </div>
              <span class="text-base font-semibold text-white">{{ currentNetworkData?.avgReachPosts || currentReach }}</span>
            </div>

            <!-- Оценка сервиса -->
            <div class="flex flex-col">
              <div class="flex items-center gap-1 mb-1">
                <span class="text-xs text-white/70">Оценка сервиса</span>
                <button
                  @click="showTooltip('score')"
                  class="text-white/50 hover:text-white/80 transition-colors"
                >
                  <QuestionIcon :size="14" class-prop="text-white/50" />
                </button>
              </div>
              <span class="text-base font-semibold" :class="getScoreClass(currentNetworkData?.overallScore)">
                {{ currentNetworkData?.overallScore || '0.0' }} / 10
              </span>
            </div>

            <!-- Иконки флагов -->
            <div v-if="currentNetworkData?.redFlags && currentNetworkData.redFlags.length" class="flex flex-col md:items-center gap-1">
              <div class="flex items-center gap-1 mb-1">
                <span class="text-xs text-white/70">Ред флаги</span>
                <button
                  @click="showTooltip('flags')"
                  class="text-white/50 hover:text-white/80 transition-colors"
                >
                  <QuestionIcon :size="14" class-prop="text-white/50" />
                </button>
              </div>
              <div class="flex items-center">
                <RedFlag
                  v-for="(flag, i) in currentNetworkData.redFlags"
                  :key="`flag-${i}`"
                  :size="20"
                  class-prop="text-red-500 fill-red-500"
                  style="color: #ef4444;"
                />
              </div>
            </div>

            <!-- Ссылка - смотреть соц сеть -->
            <div v-if="hasSubscription && currentProfileUrl" class="flex flex-col md:items-center gap-1">
              <span class="text-xs text-white/70">Перейти</span>
              <a 
                :href="currentProfileUrl" 
                target="_blank" 
                rel="noopener" 
                class="text-cyan-300 hover:text-cyan-200 hover:underline text-sm whitespace-nowrap"
              >
                профиль
              </a>
            </div>
          </div>
        </div>

        <!-- Тематика -->
        <div v-if="currentTopics && currentTopics.length" class="bg-white/10 rounded-lg p-3 sm:p-4">
          <h3 class="text-sm font-medium text-white/80 mb-2">Тематика</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(topic, i) in currentTopics"
              :key="`topic-full-${i}`"
              class="text-xs px-2 py-1 rounded-md bg-white/15 text-white/90"
            >{{ topic }}</span>
          </div>
        </div>

        <!-- Подробная аналитика (details или замочек) -->
        <div v-if="hasSubscription" class="bg-white/10 rounded-lg p-3 sm:p-4">
          <details>
            <summary class="text-sm font-medium text-white/90 mb-0 list-none flex items-center justify-between cursor-pointer select-none hover:text-white transition-colors">
              <span>Подробная аналитика</span>
              <span class="arrow text-white/60 text-xs">▼</span>
            </summary>
            <div class="content space-y-0 mt-4">
              <!-- Количественный анализ -->
              <div class="pb-4 border-b border-white/10">
                <h3 class="text-xs font-medium text-white/80 mb-2">Количественный анализ (средние значения)</h3>
                <div class="grid gap-2" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));">
                  <div class="text-left space-y-0.5">
                    <div class="text-[11px] text-white/60">Лайки</div>
                    <div class="text-base font-semibold text-white">{{ currentNetworkData?.avgLikes || '0.0' }}</div>
                  </div>
                  <div class="text-left space-y-0.5">
                    <div class="text-[11px] text-white/60">Комментарии</div>
                    <div class="text-base font-semibold text-white">{{ currentNetworkData?.avgComments || '0.0' }}</div>
                  </div>
                  <div class="text-left space-y-0.5">
                    <div class="text-[11px] text-white/60">Пост/месяц</div>
                    <div class="text-base font-semibold text-white">{{ currentNetworkData?.postsPerMonth || '0.0' }}</div>
                  </div>
                  <div class="text-left space-y-0.5">
                    <div class="text-[11px] text-white/60">Просмотры постов</div>
                    <div class="text-base font-semibold text-white">{{ currentNetworkData?.avgReachPosts || '—' }}</div>
                  </div>
                  <div class="text-left space-y-0.5">
                    <div class="text-[11px] text-white/60">Просмотры рилсов</div>
                    <div class="text-base font-semibold text-white">{{ currentNetworkData?.avgReachReels || '—' }}</div>
                  </div>
                  <div class="text-left space-y-0.5">
                    <div class="text-[11px] text-white/60">Подписчики</div>
                    <div class="text-base font-semibold text-white">{{ currentNetworkData?.followers ? formatNumber(currentNetworkData.followers) : '—' }}</div>
                  </div>
                </div>
              </div>

              <!-- Оценка сервиса -->
              <div class="py-4 border-b border-white/10">
                <h3 class="text-xs font-medium text-white/80 mb-2">Оценка сервиса</h3>
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center gap-1">
                      <span class="text-white/90">Активность</span>
                      <button
                        @click="showTooltip('activity')"
                        class="text-white/50 hover:text-white/80 transition-colors"
                      >
                        <QuestionIcon :size="12" class-prop="text-white/50" />
                      </button>
                    </div>
                    <span class="font-semibold" :class="getScoreClass(currentNetworkData?.activityScore)">
                      {{ currentNetworkData?.activityScore || '0' }}/10
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center gap-1">
                      <span class="text-white/90">Тематика</span>
                      <button
                        @click="showTooltip('thematic')"
                        class="text-white/50 hover:text-white/80 transition-colors"
                      >
                        <QuestionIcon :size="12" class-prop="text-white/50" />
                      </button>
                    </div>
                    <span class="font-semibold" :class="getScoreClass(currentNetworkData?.thematicScore)">
                      {{ currentNetworkData?.thematicScore || '0' }}/10
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center gap-1">
                      <span class="text-white/90">Вовлеченность</span>
                      <button
                        @click="showTooltip('engagement')"
                        class="text-white/50 hover:text-white/80 transition-colors"
                      >
                        <QuestionIcon :size="12" class-prop="text-white/50" />
                      </button>
                    </div>
                    <span class="font-semibold" :class="getScoreClass(currentNetworkData?.engagementScore)">
                      {{ currentNetworkData?.engagementScore || '0' }}/10
                    </span>
                  </div>
                </div>
              </div>

              <!-- Описание аудитории -->
              <div v-if="currentNetworkData?.audienceDescription || aiData?.audienceDescription || aiData?.audienceComment" class="py-4 border-b border-white/10">
                <h3 class="text-sm font-medium text-white/80 mb-2">Аудитория</h3>
                <div class="text-white/90 text-sm leading-relaxed whitespace-pre-line">
                  {{ currentNetworkData?.audienceDescription || aiData?.audienceDescription || aiData?.audienceComment }}
                </div>
              </div>

              <!-- Описание блога -->
              <div v-if="currentNetworkData?.blogDescription || aiData?.blogDescription" class="py-4">
                <h3 class="text-sm font-medium text-white/80 mb-2">Описание блога</h3>
                <div class="text-white/90 text-sm leading-relaxed whitespace-pre-line">
                  {{ currentNetworkData?.blogDescription || aiData?.blogDescription }}
                </div>
              </div>
            </div>
          </details>
        </div>

        <!-- Замочек если нет подписки -->
        <div v-else class="bg-white/10 rounded-lg p-3 sm:p-4">
          <div class="flex items-center gap-2 text-white/70">
            <LockIcon :size="20" class-prop="text-white/70" />
            <span class="text-sm">Подробная аналитика</span>
          </div>
        </div>

        <!-- Дата актуальности данных -->
        <div class="flex items-center justify-center gap-3 pt-2">
          <span class="text-xs text-white/50">Данные актуальны на {{ currentDataDate }}</span>
          <button
            @click="refreshData"
            class="text-xs text-cyan-300 hover:text-cyan-200 hover:underline transition-colors"
          >
            обновить данные
          </button>
        </div>
      </div>

      <!-- Не поддерживается -->
      <div v-else-if="isNotSupported" class="space-y-4">
        <div class="bg-white/10 rounded-lg p-3 sm:p-4">
          <h3 class="text-xs font-medium text-white/80 mb-2">Охваты (заявленные блоггером)</h3>
          <div class="text-base font-semibold text-white">{{ currentReach }}</div>
        </div>
        <div v-if="currentTopics && currentTopics.length" class="bg-white/10 rounded-lg p-3 sm:p-4">
          <h3 class="text-sm font-medium text-white/80 mb-2">Тематика</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(topic, i) in currentTopics"
              :key="`topic-not-supported-${i}`"
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

  <!-- Попап с описанием -->
  <InfoTooltip
    :is-visible="tooltipVisible"
    :title="tooltipTitle"
    :description="tooltipDescription"
    :use-html="tooltipUseHtml"
    @close="closeTooltip"
  />

  <!-- Попап обновления данных -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="refreshPopupVisible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click.self="closeRefreshPopup"
      >
        <div
          class="bg-[#1C4366] rounded-lg p-6 max-w-md mx-4 border border-white/10 shadow-xl"
          @click.stop
        >
          <div class="flex items-start justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Обновление данных</h3>
            <button
              @click="closeRefreshPopup"
              class="text-white/70 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="text-white/90 text-sm leading-relaxed mb-6">
            Для обновления данных аналитики необходимо оплатить 50 рублей. После оплаты данные будут обновлены в течение нескольких минут.
          </div>
          <div class="flex gap-3">
            <button
              @click="closeRefreshPopup"
              class="flex-1 px-4 py-2 rounded-md bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
            >
              Отмена
            </button>
            <button
              @click="payForRefresh"
              class="flex-1 px-4 py-2 rounded-md bg-cyan-500/90 text-white text-sm hover:bg-cyan-400 transition-colors font-medium"
            >
              Оплатить 50₽
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import RedFlag from '~/components/icons/redFlag.vue'
import QuestionIcon from '~/components/icons/QuestionIcon.vue'
import LockIcon from '~/components/icons/LockIcon.vue'
import InfoTooltip from '~/components/InfoTooltip.vue'

export default {
  name: 'AiAnalytics',
  components: {
    RedFlag,
    QuestionIcon,
    LockIcon,
    InfoTooltip
  },
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
      tooltipVisible: false,
      tooltipTitle: '',
      tooltipDescription: '',
      tooltipUseHtml: false,
      refreshPopupVisible: false
    }
  },
  computed: {
    activeSocialNetworks() {
      return this.socialNetworks.filter(social => social.active !== false)
    },
    currentNetwork() {
      return this.socialNetworks.find(s => s.name === this.activeNetwork) || null
    },
    currentNetworkData() {
      return this.currentNetwork?.analytics || null
    },
    aiAccess() {
      return this.currentNetwork?.aiAccess || 'unsupported'
    },
    isFullAccess() {
      return this.aiAccess === 'full'
    },
    isBasicAccess() {
      return this.aiAccess === 'basic'
    },
    isNotSupported() {
      return this.aiAccess === 'unsupported'
    },
    currentProfileUrl() {
      return this.currentNetworkData?.profileUrl || this.aiData?.profileUrl || null
    },
    currentReach() {
      return this.currentNetworkData?.reach || this.currentNetwork?.count || '—'
    },
    currentTopics() {
      return this.currentNetworkData?.topics || this.aiData?.topics || []
    },
    currentDataDate() {
      if (this.currentNetworkData?.dataDate) {
        return this.currentNetworkData.dataDate
      }
      // Форматируем текущую дату в формате ДД.ММ.ГГГГ
      const now = new Date()
      const day = String(now.getDate()).padStart(2, '0')
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const year = now.getFullYear()
      return `${day}.${month}.${year}`
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
      if (!num) return '—'
      // Если это строка, убираем пробелы и преобразуем в число
      const numValue = typeof num === 'string' ? parseInt(num.replace(/\s/g, '')) : num
      if (isNaN(numValue)) return num.toString() // Если не число, возвращаем как есть
      if (numValue >= 1000) {
        return (numValue / 1000).toFixed(1) + 'K'
      }
      return numValue.toString()
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
    },
    showTooltip(type) {
      const flagDescriptions = {
        'low_er': 'Низкий ER — менее 1%',
        'fake_engagement': 'Высокий ER (выше 6%) в сочетании с охватами менее 1000 = 100% накрутка или чаты активности',
        'high_frequency': 'Частотность публикации — более 10 в неделю',
        'hidden_likes': 'Скрыты лайки',
        'low_reach_ratio': 'Соотношение охватов к подписчикам менее 15%',
        'spam_blog': 'Соотношение охватов к подписчикам более 100% в сочетании с какой-то еще аномалией = 100% спам блог'
      }

      if (type === 'flags') {
        const redFlags = this.currentNetworkData?.redFlags || []
        if (redFlags.length === 0) {
          this.tooltipTitle = 'Красные флаги'
          this.tooltipDescription = 'Красные флаги не обнаружены.'
          this.tooltipUseHtml = false
        } else {
          this.tooltipTitle = 'Красные флаги'
          let html = '<div class="space-y-3">'
          redFlags.forEach(flag => {
            const description = flagDescriptions[flag] || flag
            html += `
              <div class="flex items-start gap-2">
                <div class="flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" style="color: #ef4444;">
                    <path d="M5.5647 9.11082C7.07395 8.10807 8.40795 8.34907 9.2707 8.75007C11.3889 9.73507 12.7537 9.75007 13.2527 9.50107C13.3914 9.43182 13.4999 9.31832 13.4999 9.16257V5.38132C13.4999 5.17782 13.3279 5.01632 13.1259 5.02882C10.7149 5.17457 10.2162 4.42232 9.2707 4.00007C7.7342 3.31382 6.3152 3.92257 5.5757 4.37207L5.5647 9.11082Z" fill="currentColor" opacity="0.3"/>
                    <path d="M5.5757 4.37196C6.31495 3.92246 7.7342 3.31396 9.2707 3.99996C10.2162 4.42246 10.7149 5.17446 13.1257 5.02846C13.1738 5.02564 13.2219 5.03265 13.2671 5.04909C13.3124 5.06552 13.3538 5.09102 13.3888 5.12402C13.4239 5.15703 13.4518 5.19684 13.4709 5.24102C13.49 5.2852 13.4999 5.33282 13.4999 5.38096V9.16246C13.4999 9.31821 13.3914 9.43171 13.2524 9.50096C12.7537 9.74996 11.3889 9.73471 9.2707 8.74996C8.4082 8.34896 7.07395 8.10796 5.5647 9.11071" fill="currentColor"/>
                    <path d="M5.771 4.37196C6.4925 3.92246 7.8765 3.31396 9.375 3.99996C10.2972 4.42246 10.7835 5.17446 13.135 5.02846C13.3325 5.01621 13.5 5.17771 13.5 5.38096V9.16246C13.5 9.31821 13.3942 9.43171 13.2587 9.50096C12.772 9.74996 11.441 9.73496 9.375 8.74996C8.53375 8.34896 7.2325 8.10796 5.7605 9.11071" stroke="currentColor" stroke-width="0.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.83179 3.21875V14.9587" stroke="currentColor" stroke-width="0.5" stroke-miterlimit="10" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="flex-1">${description}</div>
              </div>
            `
          })
          html += '</div>'
          this.tooltipDescription = html
          this.tooltipUseHtml = true
        }
        this.tooltipVisible = true
        return
      }

      // Обработка тултипов для оценок сервиса
      if (type === 'activity') {
        const score = parseFloat(this.currentNetworkData?.activityScore) || 0
        let description = ''
        
        if (score >= 9) {
          description = '>1 пост/день (очень активен)'
        } else if (score >= 7) {
          description = '0.5-1 пост/день (активен)'
        } else if (score >= 5) {
          description = '0.2-0.5 пост/день (умеренно активен)'
        } else if (score >= 3) {
          description = '0.1-0.2 пост/день (низкая активность)'
        } else {
          description = '<0.1 пост/день (неактивен)'
        }
        
        this.tooltipTitle = 'Активность блогера'
        this.tooltipDescription = `Оценка активности блогера основана на частоте публикаций:<br/><br/><strong>9-10:</strong> >1 пост/день (очень активен)<br/><strong>7-8:</strong> 0.5-1 пост/день (активен)<br/><strong>5-6:</strong> 0.2-0.5 пост/день (умеренно активен)<br/><strong>3-4:</strong> 0.1-0.2 пост/день (низкая активность)<br/><strong>0-2:</strong> <0.1 пост/день (неактивен)<br/><br/>Текущая оценка: <strong>${score}/10</strong> — ${description}`
        this.tooltipUseHtml = true
        this.tooltipVisible = true
        return
      }

      if (type === 'thematic') {
        const score = parseFloat(this.currentNetworkData?.thematicScore) || 0
        let description = ''
        
        if (score >= 9) {
          description = 'Широкая тематика (lifestyle, мода, красота) - подходит для большинства товаров'
        } else if (score >= 7) {
          description = 'Умеренная универсальность (спорт, путешествия, кулинария)'
        } else if (score >= 5) {
          description = 'Узкая ниша (IT, финансы, конкретное хобби)'
        } else if (score >= 3) {
          description = 'Очень узкая ниша (узкий технический контент)'
        } else {
          description = 'Неподходящая для коммерции тематика'
        }
        
        this.tooltipTitle = 'Универсальность для товарных интеграций'
        this.tooltipDescription = `Оценка тематики показывает, насколько универсальна тематика блогера для товарных интеграций:<br/><br/><strong>9-10:</strong> Широкая тематика (lifestyle, мода, красота) - подходит для большинства товаров<br/><strong>7-8:</strong> Умеренная универсальность (спорт, путешествия, кулинария)<br/><strong>5-6:</strong> Узкая ниша (IT, финансы, конкретное хобби)<br/><strong>3-4:</strong> Очень узкая ниша (узкий технический контент)<br/><strong>0-2:</strong> Неподходящая для коммерции тематика<br/><br/>Текущая оценка: <strong>${score}/10</strong> — ${description}`
        this.tooltipUseHtml = true
        this.tooltipVisible = true
        return
      }

      if (type === 'engagement') {
        const score = parseFloat(this.currentNetworkData?.engagementScore) || 0
        const er = this.currentNetworkData?.engagementRate || '0%'
        let description = ''
        
        if (score >= 9) {
          description = 'ER > 5% (очень высокая вовлеченность)'
        } else if (score >= 7) {
          description = 'ER 3-5% (высокая вовлеченность)'
        } else if (score >= 5) {
          description = 'ER 1.5-3% (средняя вовлеченность)'
        } else if (score >= 3) {
          description = 'ER 0.5-1.5% (низкая вовлеченность)'
        } else {
          description = 'ER < 0.5% (очень низкая вовлеченность)'
        }
        
        this.tooltipTitle = 'Вовлеченность аудитории'
        this.tooltipDescription = `Оценка вовлеченности аудитории основана на Engagement Rate (ER):<br/><br/><strong>9-10:</strong> ER > 5% (очень высокая вовлеченность)<br/><strong>7-8:</strong> ER 3-5% (высокая вовлеченность)<br/><strong>5-6:</strong> ER 1.5-3% (средняя вовлеченность)<br/><strong>3-4:</strong> ER 0.5-1.5% (низкая вовлеченность)<br/><strong>0-2:</strong> ER < 0.5% (очень низкая вовлеченность)<br/><br/>Текущая оценка: <strong>${score}/10</strong> — ${description}<br/>Текущий ER: <strong>${er}</strong>`
        this.tooltipUseHtml = true
        this.tooltipVisible = true
        return
      }

      // Обработка тултипа для охватов
      if (type === 'reach') {
        const averagePlaysTotal = this.currentNetworkData?.averagePlaysTotal
        const averageViewsTotal = this.currentNetworkData?.averageViewsTotal
        
        let description = 'Охваты — это количество уникальных пользователей, которые увидели ваш контент. Показывает реальную аудиторию, которая взаимодействует с вашими публикациями.'
        
        if (averagePlaysTotal || averageViewsTotal) {
          description += '<br/><br/><strong>Средние просмотры:</strong><br/>'
          if (averagePlaysTotal) {
            description += `• У рилс: <strong>${this.formatNumber(averagePlaysTotal)}</strong><br/>`
          }
          if (averageViewsTotal) {
            description += `• У постов: <strong>${this.formatNumber(averageViewsTotal)}</strong>`
          }
        }
        
        this.tooltipTitle = 'Охваты'
        this.tooltipDescription = description
        this.tooltipUseHtml = true
        this.tooltipVisible = true
        return
      }

      const tooltips = {
        er: {
          title: 'Engagement Rate (ER)',
          description: 'Engagement Rate (ER) — это показатель вовлеченности аудитории, который показывает, какой процент подписчиков активно взаимодействует с контентом (лайки, комментарии, репосты). Высокий ER указывает на активную и заинтересованную аудиторию.'
        },
        score: {
          title: 'Оценка сервиса',
          description: 'Общая оценка сервиса рассчитывается на основе нескольких факторов: активности блогера, тематики контента и уровня вовлеченности аудитории. Оценка помогает брендам быстро оценить потенциал сотрудничества с блогером.'
        }
      }

      const tooltip = tooltips[type]
      if (tooltip) {
        this.tooltipTitle = tooltip.title
        this.tooltipDescription = tooltip.description
        this.tooltipUseHtml = false
        this.tooltipVisible = true
      }
    },
    closeTooltip() {
      this.tooltipVisible = false
      this.tooltipUseHtml = false
    },
    refreshData() {
      this.refreshPopupVisible = true
    },
    closeRefreshPopup() {
      this.refreshPopupVisible = false
    },
    payForRefresh() {
      // Обработка оплаты
      console.log('Оплата 50 рублей за обновление данных')
      // Здесь можно добавить логику оплаты
      this.closeRefreshPopup()
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

<style scoped>
details summary {
  list-style: none;
}

details summary::-webkit-details-marker {
  display: none;
}

details summary .arrow {
  transition: transform 0.2s ease;
}

details[open] summary .arrow {
  transform: rotate(180deg);
}

details .content {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
