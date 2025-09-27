<template>
  <div class="panel-gradient rounded-2xl p-6 backdrop-blur-[10px] border border-white/10" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <h3 class="text-lg font-semibold text-white mb-4">{{ title }}</h3>
    <div class="flex overflow-x-auto gap-4 mb-4 md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-x-visible scrollbar-hide" style="-ms-overflow-style: none; scrollbar-width: none; -webkit-scrollbar: none;">
      <div 
        class="relative aspect-[9/16] rounded-lg overflow-hidden group cursor-pointer flex-shrink-0 w-32 md:w-auto" 
        v-for="(example, index) in examples" 
        :key="index"
        @click="handleToggleVideo(index)"
      >
        <video 
          :ref="`video-${index}`"
          :src="example.video" 
          :alt="example.alt" 
          class="w-full h-full object-cover" 
          loop
          @click.stop
        >
          Ваш браузер не поддерживает видео.
        </video>
        <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayIcon />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PlayIcon from './icons/PlayIcon.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Примеры работ'
  },
  examples: {
    type: Array,
    required: true
  },
  viewAllText: {
    type: String,
    default: 'смотреть все'
  }
})

const currentPlayingIndex = ref(null)

const handleToggleVideo = (index) => {
  // Получаем все видео элементы на странице
  const videoElements = document.querySelectorAll('video')
  const video = videoElements[index]
  
  if (!video) return
  
  // Если кликнули на уже играющее видео - ставим на паузу
  if (currentPlayingIndex.value === index && !video.paused) {
    video.pause()
    currentPlayingIndex.value = null
    return
  }
  
  // Останавливаем все остальные видео
  videoElements.forEach((v, i) => {
    if (i !== index && !v.paused) {
      v.pause()
    }
  })
  
  // Запускаем выбранное видео
  video.play().catch(error => {
    console.error('Ошибка воспроизведения видео:', error)
  })
  currentPlayingIndex.value = index
}
</script>
