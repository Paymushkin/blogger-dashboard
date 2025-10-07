<template>
  <div class="panel-gradient rounded-2xl p-6 backdrop-blur-[10px] border border-white/10" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <h3 class="text-lg font-semibold text-white mb-4">{{ title }}</h3>
    
          <!-- Скелетон загрузки -->
          <div v-if="isReelsLoading" class="flex overflow-x-auto gap-4 mb-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:overflow-x-visible scrollbar-hide" style="-ms-overflow-style: none; scrollbar-width: none; -webkit-scrollbar: none;">
      <div 
        class="relative aspect-[9/16] rounded-lg overflow-hidden flex-shrink-0 w-48 md:w-auto" 
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
            
            <!-- Статистика рилса в верхней части -->
            <div v-if="skeletonItem.likesCount || skeletonItem.commentsCount || skeletonItem.viewsCount" class="absolute top-2 right-2 flex flex-col gap-2">
              <div v-if="skeletonItem.likesCount" class="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-white text-sm">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>{{ formatNumber(skeletonItem.likesCount) }}</span>
              </div>
              <div v-if="skeletonItem.commentsCount" class="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-white text-sm">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
                </svg>
                <span>{{ formatNumber(skeletonItem.commentsCount) }}</span>
              </div>
              <div v-if="skeletonItem.viewsCount" class="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-white text-sm">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <span>{{ formatNumber(skeletonItem.viewsCount) }}</span>
              </div>
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
            
            <!-- Статистика рилса для дефолтного постера -->
            <div v-if="skeletonItem.likesCount || skeletonItem.commentsCount || skeletonItem.viewsCount" class="absolute bottom-2 left-2 right-2">
              <div class="bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white text-xs">
                <div v-if="skeletonItem.likesCount" class="flex items-center gap-1 mb-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>{{ formatNumber(skeletonItem.likesCount) }}</span>
                </div>
                <div v-if="skeletonItem.commentsCount" class="flex items-center gap-1 mb-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
                  </svg>
                  <span>{{ formatNumber(skeletonItem.commentsCount) }}</span>
                </div>
                <div v-if="skeletonItem.viewsCount" class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  <span>{{ formatNumber(skeletonItem.viewsCount) }}</span>
                </div>
              </div>
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
          <div v-else-if="examples && examples.length > 0" class="flex overflow-x-auto gap-4 mb-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:overflow-x-visible scrollbar-hide" style="-ms-overflow-style: none; scrollbar-width: none; -webkit-scrollbar: none;">
      <div 
        class="flex flex-col flex-shrink-0 w-48 md:w-auto" 
        v-for="(example, index) in examples" 
        :key="index"
      >
        <!-- Видео контейнер -->
        <div class="relative aspect-[9/16] rounded-lg overflow-hidden">
          <!-- Постер видео (только для API данных, не для тестовых) -->
          <div 
            v-if="example.thumbnail && !isTestData" 
            class="absolute inset-0 bg-gray-800 flex items-center justify-center cursor-pointer"
            @click="playVideo($event)"
          >
            <img
              :src="example.thumbnail"
              :alt="example.alt"
              class="w-full h-full object-cover"
              @error="handleImageError($event, index)"
            />
            <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          <!-- Дефолтный постер если нет thumbnail и не тестовые данные -->
          <div 
            v-else-if="!isTestData"
            class="absolute inset-0 flex items-center justify-center cursor-pointer"
            @click="playVideo($event)"
          >
            <img
              :src="defaultPoster"
              :alt="example.alt"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/25 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          <video 
            :src="example.video" 
            :alt="example.alt" 
            class="w-full h-full object-cover" 
            controls
            loop
            muted
            :poster="isTestData ? example.thumbnail : (example.thumbnail || defaultPoster)"
          >
            Ваш браузер не поддерживает видео.
          </video>
          
          <!-- Статистика в верхней части видео -->
          <div v-if="example.likesCount || example.commentsCount || example.viewsCount" class="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm rounded-t-lg px-3 py-2 flex gap-3 justify-center">
            <div v-if="example.likesCount" class="flex items-center gap-1 text-white text-xs">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span class="text-xs">{{ formatNumber(example.likesCount) }}</span>
            </div>
            <div v-if="example.commentsCount" class="flex items-center gap-1 text-white text-xs">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
              </svg>
              <span class="text-xs">{{ formatNumber(example.commentsCount) }}</span>
            </div>
            <div v-if="example.viewsCount" class="flex items-center gap-1 text-white text-xs">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <span class="text-xs">{{ formatNumber(example.viewsCount) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Описание под видео -->
        <div v-if="example.caption" class="mt-2 p-2 rounded-lg cursor-pointer" @click="toggleDescription(index)">
          <p class="text-white text-xs" :class="expandedDescriptions.includes(index) ? '' : 'line-clamp-2'">
            {{ example.caption }}
          </p>
        </div>
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
  },
  isFirstAttempt: {
    type: Boolean,
    default: true
  }
})

const brokenThumbnails = ref([])
const loadingTimeouts = ref({})
const skeletonReels = ref([])
const defaultPoster = '/blogger-dashboard/images/poster.png'
const expandedDescriptions = ref([])

// Определяем, являются ли данные тестовыми (по наличию локальных видео файлов)
const isTestData = computed(() => {
  return props.examples && props.examples.length > 0 && 
         props.examples.some(example => example.video && example.video.includes('/video/'))
})

onMounted(() => {
  initializeSkeleton()
})

const initializeSkeleton = () => {
  // Показываем только 3 лоадера изначально
  skeletonReels.value = Array.from({ length: 3 }, (_, index) => ({
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
    // Если это первая попытка, показываем только реальное количество + лоадеры до 9
    if (props.isFirstAttempt) {
      const totalSlots = Math.max(newExamples.length, 9)
      skeletonReels.value = Array.from({ length: totalSlots }, (_, index) => {
        if (index < newExamples.length) {
          // Реальный рилс
          const example = newExamples[index]
          return {
            loaded: true,
            video: example.video,
            alt: example.alt,
            thumbnail: example.thumbnail,
            duration: example.duration,
            platform: example.platform,
            likesCount: example.likesCount,
            commentsCount: example.commentsCount,
            viewsCount: example.viewsCount,
            caption: example.caption,
            playCount: example.playCount
          }
        } else {
          // Лоадер для оставшихся слотов
          return {
            loaded: false,
            video: null,
            alt: `Рилс ${index + 1}`,
            thumbnail: null,
            duration: null,
            platform: null
          }
        }
      })
    } else {
      // Если не первая попытка, обновляем как обычно
      newExamples.forEach((example, index) => {
        if (index < 9) {
          skeletonReels.value[index] = {
            loaded: true,
            video: example.video,
            alt: example.alt,
            thumbnail: example.thumbnail,
            duration: example.duration,
            platform: example.platform,
            likesCount: example.likesCount,
            commentsCount: example.commentsCount,
            viewsCount: example.viewsCount,
            caption: example.caption,
            playCount: example.playCount
          }
        }
      })
    }
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

// Функция форматирования чисел
const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// Функция переключения развернутого описания
const toggleDescription = (index) => {
  if (expandedDescriptions.value.includes(index)) {
    expandedDescriptions.value = expandedDescriptions.value.filter(i => i !== index)
  } else {
    expandedDescriptions.value.push(index)
  }
}
</script>
