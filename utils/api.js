// API функции для получения данных блогера

// Используем прямой API с CORS на сервере
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://dev.unpacks.ru/api'
  : '/api'

// Функция для получения статистики блогера
export async function getBloggerStats(bloggerId) {
  try {
    const response = await fetch(`${API_BASE_URL}/blogger/${bloggerId}/stats`, {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
    return null
  }
}

// Функция для получения отзывов блогера
export async function getBloggerReviews(bloggerId) {
  try {
    const response = await fetch(`${API_BASE_URL}/blogger/${bloggerId}/reviews`, {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Ошибка загрузки отзывов:', error)
    return null
  }
}

// Функция для получения рилсов блогера
export async function getBloggerReels(bloggerId) {
  try {
    const url = `${API_BASE_URL}/blogger/${bloggerId}/reels`
    console.log('Загружаем рилсы с URL:', url)
    
    const response = await fetch(url, {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Ответ сервера для рилсов:', response.status, response.statusText)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Данные рилсов получены:', data)
    return data
  } catch (error) {
    console.error('Ошибка загрузки рилсов:', error)
    return null
  }
}

// Функция для получения рилсов с повторными попытками
export async function getBloggerReelsWithRetry(bloggerId, maxAttempts = 3, intervalMs = 30000, targetCount = 9, onProgress = null) {
  let lastResult = null
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      console.log(`Попытка ${i + 1}/${maxAttempts} загрузки рилсов для блогера ${bloggerId}`)
      
      const result = await getBloggerReels(bloggerId)
      
      if (result && result.reels && result.reels.length > 0) {
        console.log(`Успешно загружено ${result.reels.length} рилсов`)
        return result
      }
      
      lastResult = result
      
      // Если это не последняя попытка, ждем перед следующей попыткой
      if (i < maxAttempts - 1) {
        const currentInterval = Array.isArray(intervalMs) ? intervalMs[i] : intervalMs
        console.log(`Ждем ${currentInterval}мс перед следующей попыткой...`)
        
        if (onProgress) {
          onProgress({ current: i + 1, total: maxAttempts })
        }
        
        await new Promise(resolve => setTimeout(resolve, currentInterval))
      }
      
    } catch (error) {
      console.error(`Ошибка в попытке ${i + 1}:`, error)
      
      // Если это не последняя попытка, ждем перед следующей попыткой
      if (i < maxAttempts - 1) {
        const currentInterval = Array.isArray(intervalMs) ? intervalMs[i] : intervalMs
        console.log(`Ждем ${currentInterval}мс перед следующей попыткой...`)
        
        if (onProgress) {
          onProgress({ current: i + 1, total: maxAttempts })
        }
        
        await new Promise(resolve => setTimeout(resolve, currentInterval))
      }
    }
  }
  
  console.log(`Все ${maxAttempts} попыток исчерпаны. Возвращаем последний результат или пустой массив`)
  
  if (onProgress) {
    onProgress({ current: maxAttempts, total: maxAttempts })
  }
  
  return lastResult || { reels: [] }
}