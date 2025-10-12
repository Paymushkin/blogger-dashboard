<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    @click="close"
  >
    <div
      class="panel-gradient rounded-xl p-6 max-w-md mx-4 backdrop-blur-[10px] border border-white/10 md:min-w-[400px] min-w-[90%]"
      style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);"
      @click.stop
    >
      <!-- Заголовок -->
      <div class="flex items-center gap-3 mb-4">
        <img 
          :src="socialData.iconPath" 
          :alt="socialData.name" 
          class="w-8 h-8 filter brightness-0 invert"
        />
        <h3 class="text-lg font-semibold text-white">Профиль {{ socialData.name }}</h3>
      </div>

      <!-- Информация -->
      <div class="space-y-4">
        <div class="flex justify-between items-center gap-4">
          <span class="text-white/70 flex-shrink-0">Тематика:</span>
          <span class="text-white font-semibold text-right">{{ socialData.theme || 'Не указана' }}</span>
        </div>
        
        <div>
          <div class="flex justify-between items-center gap-4">
            <span class="text-white/70 flex-shrink-0">Средние охваты:</span>
            <span class="text-white font-semibold text-right">{{ socialData.reach || 'Не указано' }}</span>
          </div>
          
          <!-- Пояснение для Instagram -->
          <div v-if="isInstagram" class="mt-2 text-xs text-white/50 italic">
            Среднее значение рассчитано на основании видео в примерах, оно не исключает "залетевшие ролики"
          </div>
          
          <!-- Пояснение для других соцсетей -->
          <div v-else class="mt-2 text-xs text-white/50 italic">
            На основании оценки блогера
          </div>
        </div>
        
        <!-- Ссылка на профиль -->
        <div v-if="socialData.profileUrl" class="pt-2 border-t border-white/10">
          <a 
            :href="socialData.profileUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 text-white/90 hover:text-white text-sm transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            Перейти к профилю
          </a>
        </div>
      </div>

      <!-- Кнопка закрытия -->
      <button
        @click="close"
        class="w-full mt-6 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Закрыть
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SocialNetworkPopup',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    socialData: {
      type: Object,
      default: () => ({
        name: '',
        iconPath: '',
        count: '',
        theme: '',
        reach: '',
        profileUrl: null
      })
    }
  },
  emits: ['close'],
  computed: {
    isInstagram() {
      // Проверяем, является ли это Instagram профилем (включая Instagram 2, Instagram 3 и т.д.)
      return this.socialData.name && this.socialData.name.toLowerCase().includes('instagram')
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
