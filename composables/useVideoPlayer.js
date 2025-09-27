import { ref } from 'vue'

export function useVideoPlayer() {
  const currentPlayingIndex = ref(null)
  
  const toggleVideo = (index, videoRefs) => {
    const video = videoRefs.value[`video-${index}`]?.[0]
    
    if (!video) return
    
    // Если кликнули на уже играющее видео - ставим на паузу
    if (currentPlayingIndex.value === index && !video.paused) {
      video.pause()
      currentPlayingIndex.value = null
      return
    }
    
    // Останавливаем все остальные видео
    Object.keys(videoRefs.value).forEach(refKey => {
      if (refKey.startsWith('video-')) {
        const videoRef = videoRefs.value[refKey]?.[0]
        if (videoRef && !videoRef.paused) {
          videoRef.pause()
        }
      }
    })
    
    // Запускаем выбранное видео
    video.play()
    currentPlayingIndex.value = index
  }
  
  const pauseAllVideos = (videoRefs) => {
    Object.keys(videoRefs.value).forEach(refKey => {
      if (refKey.startsWith('video-')) {
        const videoRef = videoRefs.value[refKey]?.[0]
        if (videoRef && !videoRef.paused) {
          videoRef.pause()
        }
      }
    })
    currentPlayingIndex.value = null
  }
  
  return {
    currentPlayingIndex,
    toggleVideo,
    pauseAllVideos
  }
}
