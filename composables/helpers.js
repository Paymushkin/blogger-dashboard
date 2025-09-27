// Вспомогательные функции

/**
 * Форматирует число подписчиков
 * @param {number} count - Количество подписчиков
 * @returns {string} - Отформатированная строка
 */
export function formatFollowers(count) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`
  }
  return count.toString()
}

/**
 * Форматирует дату
 * @param {string|Date} date - Дата
 * @returns {string} - Отформатированная дата
 */
export function formatDate(date) {
  const d = new Date(date)
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Генерирует уникальный ID
 * @returns {string} - Уникальный ID
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Проверяет, является ли строка URL
 * @param {string} str - Строка для проверки
 * @returns {boolean} - true если это URL
 */
export function isValidUrl(str) {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

/**
 * Дебаунс функция
 * @param {Function} func - Функция для дебаунса
 * @param {number} wait - Время ожидания в мс
 * @returns {Function} - Дебаунсированная функция
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
