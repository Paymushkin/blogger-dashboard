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
          <span class="text-white/70 flex-shrink-0">Подписчиков:</span>
          <span class="text-white font-semibold text-right">{{ socialData.count }}</span>
        </div>
        
        <div class="flex justify-between items-center gap-4">
          <span class="text-white/70 flex-shrink-0">Тематика:</span>
          <span class="text-white font-semibold text-right">{{ socialData.theme || 'Не указана' }}</span>
        </div>
        
        <div class="flex justify-between items-center gap-4">
          <span class="text-white/70 flex-shrink-0">Средние охваты:</span>
          <span class="text-white font-semibold text-right">{{ socialData.reach || 'Не указано' }}</span>
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
        reach: ''
      })
    }
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
