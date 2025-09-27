// Типы данных для приложения

/**
 * @typedef {Object} BloggerData
 * @property {string} name - Имя блогера
 * @property {string} niche - Ниша блогера
 * @property {string} avatar - Путь к аватару
 * @property {string} buttonText - Текст кнопки
 */

/**
 * @typedef {Object} SocialNetwork
 * @property {string} name - Название соцсети
 * @property {string} iconPath - Путь к иконке
 * @property {string} count - Количество подписчиков
 */

/**
 * @typedef {Object} Stats
 * @property {string} rating - Рейтинг
 * @property {string} status - Статус
 * @property {string|number} completedDeals - Количество завершенных сделок
 */

/**
 * @typedef {Object} WorkExample
 * @property {string} video - Путь к видео
 * @property {string} alt - Альтернативный текст
 */

/**
 * @typedef {Object} WorkExamples
 * @property {string} title - Заголовок секции
 * @property {string} viewAllText - Текст ссылки "смотреть все"
 * @property {WorkExample[]} examples - Массив примеров работ
 */

/**
 * @typedef {Object} Review
 * @property {string} name - Имя автора отзыва
 * @property {string} date - Дата отзыва
 * @property {string} text - Текст отзыва
 */

/**
 * @typedef {Object} Reviews
 * @property {string} title - Заголовок секции
 * @property {string} viewAllText - Текст ссылки "смотреть все"
 * @property {Review[]} reviews - Массив отзывов
 */

export const TYPES = {
  BLOGGER_DATA: 'BloggerData',
  SOCIAL_NETWORK: 'SocialNetwork',
  STATS: 'Stats',
  WORK_EXAMPLE: 'WorkExample',
  WORK_EXAMPLES: 'WorkExamples',
  REVIEW: 'Review',
  REVIEWS: 'Reviews'
}
