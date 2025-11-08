<template>
  <!-- Состояние первоначальной загрузки -->
  <PageLoader v-if="isInitialLoading" />
  
  <!-- Состояние ошибки -->
  <ErrorState 
    v-else-if="error && bloggerNotFound"
    title="Блогер не найден"
    message="Время жизни ссылки истекло или такого блогера не существует. Обратитесь в поддержку, если проблема повторяется"
  />
  
  <ErrorState 
    v-else-if="error"
    title="Произошла ошибка"
    message="Если произошла ошибка, напишите, пожалуйста, в поддержку"
  />
  
  <!-- Основной контент -->
  <div v-else class="min-h-screen bg-[#0E2133] p-5">
    <div class="max-w-[1920px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-5">
      <!-- Левая часть - Профиль + AI аналитика + Примеры работ -->
      <div class="space-y-5">
        <!-- Верхняя панель -->
        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 lg:grid-rows-1">
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
            :status="stats.status"
            :completed-deals="stats.completedDeals"
            :service-time="stats.serviceTime"
            :social-networks="socialNetworks"
            @open-social-popup="openSocialPopup"
          />
        </div>

        <!-- AI аналитика -->
        <AiAnalytics
          :social-networks="socialNetworks"
          :ai-data="aiData"
          :has-subscription="hasSubscription"
          @network-selected="setActiveNetwork"
        />

        <!-- Нижняя панель - Примеры работ -->
        <WorkExamples
          :title="workExamples.title"
          :examples="workExamples.examples"
          :view-all-text="workExamples.viewAllText"
          :is-reels-loading="isReelsLoading"
          :is-first-attempt="isFirstReelsAttempt"
        />
      </div>

              <!-- Правая панель - Отзывы -->
              <div class="xl:h-[calc(100vh-40px)] xl:sticky xl:top-5">
                <Reviews
                  :title="reviews.title"
                  :reviews="reviews.reviews"
                  :view-all-text="reviews.viewAllText"
                />
              </div>
      </div>
    </div>

    <!-- Попап социальной сети -->
    <SocialNetworkPopup
      :is-visible="showSocialPopup"
      :social-data="selectedSocialData"
      @close="closeSocialPopup"
    />
  </template>

<script setup>
import { useBloggerData } from '~/composables/useBloggerData'
import { onMounted, ref } from 'vue'
import SocialNetworkPopup from '~/components/SocialNetworkPopup.vue'
import AiAnalytics from '~/components/AiAnalytics.vue'

const {
  bloggerData,
  socialNetworks,
  stats,
  workExamples,
  reviews,
  aiData,
  totalFollowers,
  isLoading,
  isReelsLoading,
  reelsLoadingProgress,
  isInitialLoading,
  isFirstReelsAttempt,
  error,
  bloggerNotFound,
  loadBloggerData,
  startReelsLoading
} = useBloggerData()

// Активная социальная сеть
const activeNetwork = ref('Instagram')

// Состояние подписки (для тестирования установлено в true)
const hasSubscription = ref(true)

// Функция для установки активной сети
const setActiveNetwork = (network) => {
  activeNetwork.value = network
}

// Состояние попапа социальной сети
const showSocialPopup = ref(false)
const selectedSocialData = ref({})

const openSocialPopup = (socialData) => {
  selectedSocialData.value = socialData
  showSocialPopup.value = true
}

const closeSocialPopup = () => {
  showSocialPopup.value = false
  selectedSocialData.value = {}
}

// Получаем ID блогера из URL
const route = useRoute()
const bloggerId = route.query.id

onMounted(() => {
  startReelsLoading()
  loadBloggerData(bloggerId)
})
</script>
