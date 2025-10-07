
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)

interface _GlobalComponents {
      'AiInsights': typeof import("../../components/AiInsights.vue")['default']
    'BloggerInfo': typeof import("../../components/BloggerInfo.vue")['default']
    'ErrorBoundary': typeof import("../../components/ErrorBoundary.vue")['default']
    'ErrorState': typeof import("../../components/ErrorState.vue")['default']
    'LoadingSpinner': typeof import("../../components/LoadingSpinner.vue")['default']
    'PageLoader': typeof import("../../components/PageLoader.vue")['default']
    'Reviews': typeof import("../../components/Reviews.vue")['default']
    'SocialAnalytics': typeof import("../../components/SocialAnalytics.vue")['default']
    'SocialIcon': typeof import("../../components/SocialIcon.vue")['default']
    'SocialNetworkPopup': typeof import("../../components/SocialNetworkPopup.vue")['default']
    'SocialNetworks': typeof import("../../components/SocialNetworks.vue")['default']
    'StatsBlocks': typeof import("../../components/StatsBlocks.vue")['default']
    'WorkExamples': typeof import("../../components/WorkExamples.vue")['default']
    'IconsCalendarIcon': typeof import("../../components/icons/CalendarIcon.vue")['default']
    'IconsCheckIcon': typeof import("../../components/icons/CheckIcon.vue")['default']
    'IconsDealsIcon': typeof import("../../components/icons/DealsIcon.vue")['default']
    'IconsPlayIcon': typeof import("../../components/icons/PlayIcon.vue")['default']
    'IconsStarIcon': typeof import("../../components/icons/StarIcon.vue")['default']
    'IconsStarRatingIcon': typeof import("../../components/icons/StarRatingIcon.vue")['default']
    'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyAiInsights': LazyComponent<typeof import("../../components/AiInsights.vue")['default']>
    'LazyBloggerInfo': LazyComponent<typeof import("../../components/BloggerInfo.vue")['default']>
    'LazyErrorBoundary': LazyComponent<typeof import("../../components/ErrorBoundary.vue")['default']>
    'LazyErrorState': LazyComponent<typeof import("../../components/ErrorState.vue")['default']>
    'LazyLoadingSpinner': LazyComponent<typeof import("../../components/LoadingSpinner.vue")['default']>
    'LazyPageLoader': LazyComponent<typeof import("../../components/PageLoader.vue")['default']>
    'LazyReviews': LazyComponent<typeof import("../../components/Reviews.vue")['default']>
    'LazySocialAnalytics': LazyComponent<typeof import("../../components/SocialAnalytics.vue")['default']>
    'LazySocialIcon': LazyComponent<typeof import("../../components/SocialIcon.vue")['default']>
    'LazySocialNetworkPopup': LazyComponent<typeof import("../../components/SocialNetworkPopup.vue")['default']>
    'LazySocialNetworks': LazyComponent<typeof import("../../components/SocialNetworks.vue")['default']>
    'LazyStatsBlocks': LazyComponent<typeof import("../../components/StatsBlocks.vue")['default']>
    'LazyWorkExamples': LazyComponent<typeof import("../../components/WorkExamples.vue")['default']>
    'LazyIconsCalendarIcon': LazyComponent<typeof import("../../components/icons/CalendarIcon.vue")['default']>
    'LazyIconsCheckIcon': LazyComponent<typeof import("../../components/icons/CheckIcon.vue")['default']>
    'LazyIconsDealsIcon': LazyComponent<typeof import("../../components/icons/DealsIcon.vue")['default']>
    'LazyIconsPlayIcon': LazyComponent<typeof import("../../components/icons/PlayIcon.vue")['default']>
    'LazyIconsStarIcon': LazyComponent<typeof import("../../components/icons/StarIcon.vue")['default']>
    'LazyIconsStarRatingIcon': LazyComponent<typeof import("../../components/icons/StarRatingIcon.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
