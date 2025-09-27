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
          @click.stop="handleToggleVideo(index)"
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
  console.log('Клик по видео:', index)
  
  // Получаем все видео элементы на странице
  const videoElements = document.querySelectorAll('video')
  console.log('Найдено видео элементов:', videoElements.length)
  
  const video = videoElements[index]
  
  if (!video) {
    console.error('Видео элемент не найден для индекса:', index)
    return
  }
  
  console.log('Видео элемент:', video)
  console.log('Текущее состояние:', video.paused ? 'на паузе' : 'воспроизводится')
  
  // Если кликнули на уже играющее видео - ставим на паузу
  if (currentPlayingIndex.value === index && !video.paused) {
    console.log('Останавливаем видео')
    video.pause()
    currentPlayingIndex.value = null
    return
  }
  
  // Останавливаем все остальные видео
  videoElements.forEach((v, i) => {
    if (i !== index && !v.paused) {
      console.log('Останавливаем видео', i)
      v.pause()
    }
  })
  
  // Запускаем выбранное видео
  console.log('Запускаем видео', index)
  video.play().then(() => {
    console.log('Видео успешно запущено')
    currentPlayingIndex.value = index
  }).catch(error => {
    console.error('Ошибка воспроизведения видео:', error)
  })
}
</script>
