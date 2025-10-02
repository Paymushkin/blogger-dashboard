<template>
  <div class="min-h-screen bg-[#0E2133] p-5">
    <div class="max-w-[1920px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-5">
      <!-- Левая часть - Профиль + AI аналитика + Примеры работ -->
      <div class="space-y-5">
        <!-- Верхняя панель -->
        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
          <!-- 1. Информация о блогере -->
          <BloggerInfo
            :name="bloggerData.name"
            :niche="bloggerData.niche"
            :avatar="bloggerData.avatar"
            :button-text="bloggerData.buttonText"
          />

          <!-- 2. Блоки статистики -->
          <StatsBlocks
            :rating="stats.rating"
            :completed-deals="stats.completedDeals"
            :service-time="stats.serviceTime"
          />
        </div>

        <!-- AI аналитика -->
        <AiInsights
          :data="aiData"
          :social-networks="socialNetworks"
          :active-network="activeNetwork"
          @select="setActiveNetwork"
        />

        <!-- Нижняя панель - Примеры работ -->
        <WorkExamples
          :title="workExamples.title"
          :examples="workExamples.examples"
          :view-all-text="workExamples.viewAllText"
          :is-reels-loading="isReelsLoading"
        />
      </div>

      <!-- Правая панель - Отзывы -->
      <div class="xl:h-[calc(100vh-40px)]">
        <Reviews
          :title="reviews.title"
          :reviews="reviews.reviews"
          :view-all-text="reviews.viewAllText"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBloggerData } from '~/composables/useBloggerData'
import { onMounted, ref } from 'vue'

const {
  bloggerData,
  socialNetworks,
  stats,
  workExamples,
  reviews,
  totalFollowers,
  isLoading,
  isReelsLoading,
  reelsLoadingProgress,
  loadBloggerData,
  startReelsLoading
} = useBloggerData()

// AI данные
const aiData = ref({
  finalScore: '9.6/10',
  topics: ['мода', 'лайфстайл'],
  description: 'Эстетичный визуал, аутфиты, уход, сторис с рекомендациями. Часто использует рилсы и карусели.',
  followers: '12 500',
  er: '6,8%',
  avgLikes: '220',
  avgComments: '14',
  reach: '28K',
  productScore: '10',
  productComment: 'Идеальный fit с модой',
  audienceScore: '10',
  audienceComment: 'Ядро — молодые мамы, следят за стилем',
  matchScore: '9.6',
  matchComment: 'Максимальное соответствие'
})

// Активная социальная сеть
const activeNetwork = ref('Instagram')

// Функция для установки активной сети
const setActiveNetwork = (network) => {
  activeNetwork.value = network
}

// Получаем ID блогера из URL
const route = useRoute()
const bloggerId = route.query.id

onMounted(() => {
  startReelsLoading()
  loadBloggerData(bloggerId)
})
</script>
