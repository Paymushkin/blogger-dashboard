<template>
  <div class="panel-gradient rounded-2xl p-6 backdrop-blur-[10px] border border-white/10" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <h3 class="text-lg font-semibold text-white mb-4">{{ title }}</h3>
    
    <!-- Скелетон загрузки -->
    <div v-if="isReelsLoading" class="flex overflow-x-auto gap-4 mb-4 md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-x-visible scrollbar-hide" style="-ms-overflow-style: none; scrollbar-width: none; -webkit-scrollbar: none;">
      <div 
        class="relative aspect-[9/16] rounded-lg overflow-hidden flex-shrink-0 w-32 md:w-auto" 
        v-for="(skeletonItem, index) in skeletonReels" 
        :key="`skeleton-${index}`"
      >
        <!-- Скелетон для не загруженного рилса -->
        <div v-if="!skeletonItem.loaded" class="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
          <!-- Лоадер внутри скелетона -->
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
            <div class="text-xs text-white/60">Загрузка...</div>
          </div>
        </div>
        
        <!-- Реальный рилс (когда загружен) -->
        <div v-else class="w-full h-full">
          <video 
            :src="skeletonItem.video" 
            :alt="skeletonItem.alt" 
            class="w-full h-full object-cover" 
            controls
            loop
            muted
            :poster="skeletonItem.thumbnail"
          >
            Ваш браузер не поддерживает видео.
          </video>
          
          <!-- Показываем thumbnail как изображение поверх видео -->
          <div 
            v-if="skeletonItem.thumbnail && !brokenThumbnails.includes(index)" 
            class="absolute inset-0 bg-gray-800 flex items-center justify-center"
            @click="playVideo($event)"
          >
            <img 
              :src="skeletonItem.thumbnail" 
              :alt="skeletonItem.alt" 
              class="w-full h-full object-cover"
              @error="handleImageError($event, index)"
              @load="handleImageLoad($event, index)"
              @loadstart="setImageTimeout(index)"
              loading="lazy"
              decoding="async"
            />
            <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          <!-- Дефолтный постер для битых изображений или отсутствующих thumbnail -->
          <div 
            v-if="!skeletonItem.thumbnail || brokenThumbnails.includes(index)" 
            class="absolute inset-0 flex items-center justify-center cursor-pointer"
            @click="playVideo($event)"
          >
            <img
              :src="defaultPoster"
              :alt="skeletonItem.alt"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/25 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Сообщение, если примеров нет -->
    <div v-else-if="!isReelsLoading && (!examples || examples.length === 0)" class="text-center py-12">
      <div class="text-white/60 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15 8v8H5V8h10m1-2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1z"/>
        </svg>
        <h4 class="text-lg font-medium text-white mb-2">Примеры работ отсутствуют</h4>
        <p class="text-sm text-white/70">У данного блогера пока нет загруженных примеров работ</p>
      </div>
    </div>
    
    <!-- Сетка рилсов (показываем только если есть примеры и не идет загрузка) -->
    <div v-else-if="examples && examples.length > 0" class="flex overflow-x-auto gap-4 mb-4 md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-x-visible scrollbar-hide" style="-ms-overflow-style: none; scrollbar-width: none; -webkit-scrollbar: none;">
      <div 
        class="relative aspect-[9/16] rounded-lg overflow-hidden flex-shrink-0 w-32 md:w-auto" 
        v-for="(example, index) in examples" 
        :key="index"
      >
        <video 
          :src="example.video" 
          :alt="example.alt" 
          class="w-full h-full object-cover" 
          controls
          loop
          muted
        >
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

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
  },
  isReelsLoading: {
    type: Boolean,
    default: false
  }
})

const brokenThumbnails = ref([])
const loadingTimeouts = ref({})
const skeletonReels = ref([])
const defaultPoster = '/blogger-dashboard/images/poster.png'

onMounted(() => {
  initializeSkeleton()
})

const initializeSkeleton = () => {
  skeletonReels.value = Array.from({ length: 9 }, (_, index) => ({
    loaded: false,
    video: null,
    alt: `Рилс ${index + 1}`,
    thumbnail: null,
    duration: null,
    platform: null
  }))
}

watch(() => props.examples, (newExamples) => {
  if (newExamples && newExamples.length > 0) {
    newExamples.forEach((example, index) => {
      if (index < 9) {
        skeletonReels.value[index] = {
          loaded: true,
          video: example.video,
          alt: example.alt,
          thumbnail: example.thumbnail,
          duration: example.duration,
          platform: example.platform
        }
      }
    })
  }
}, { immediate: true })

const handleImageError = (event, index) => {
  console.log(`Ошибка загрузки изображения для рилса ${index + 1}`)
  brokenThumbnails.value.push(index)
}

const handleImageLoad = (event, index) => {
  console.log(`Изображение загружено для рилса ${index + 1}`)
  if (loadingTimeouts.value[index]) {
    clearTimeout(loadingTimeouts.value[index])
    delete loadingTimeouts.value[index]
  }
}

const setImageTimeout = (index) => {
  loadingTimeouts.value[index] = setTimeout(() => {
    console.log(`Таймаут загрузки изображения для рилса ${index + 1}`)
    brokenThumbnails.value.push(index)
  }, 5000)
}

const playVideo = (event) => {
  const video = event.target.closest('.relative').querySelector('video')
  if (video) {
    video.play()
  }
}
</script>
