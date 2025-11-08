<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click.self="close"
      >
        <div
          class="bg-[#1C4366] rounded-lg p-4 max-w-md mx-4 border border-white/10 shadow-xl"
          @click.stop
        >
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
            <button
              @click="close"
              class="text-white/70 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="text-white/90 text-sm leading-relaxed">
            <slot>
              <div v-if="useHtml" v-html="description"></div>
              <div v-else>{{ description }}</div>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: 'InfoTooltip',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Информация'
    },
    description: {
      type: String,
      default: ''
    },
    useHtml: {
      type: Boolean,
      default: false
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

