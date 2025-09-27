# Blogger Dashboard

Современный дашборд для блогера на Vue 3 с Tailwind CSS. Адаптивный дизайн с темной темой, включающий профиль блогера, социальные сети, примеры работ и отзывы.

## 🚀 Демо

Проект развернут на GitHub Pages: [https://paymushkin.github.io/blogger-dashboard/](https://paymushkin.github.io/blogger-dashboard/)

## ✨ Особенности

- **Vue 3** с Composition API
- **Tailwind CSS** для стилизации
- **Адаптивный дизайн** для всех устройств
- **Темная тема** с градиентными панелями
- **Видеоплеер** с возможностью воспроизведения примеров работ
- **Система рейтингов** для отзывов
- **Компонентная архитектура** для легкой поддержки

## 🛠 Технологии

- Vue 3.3.4
- Vite 4.4.5
- Tailwind CSS 4.1.13
- PostCSS
- Node.js

## 📦 Установка

```bash
# Клонировать репозиторий
git clone https://github.com/Paymushkin/blogger-dashboard.git

# Перейти в директорию
cd blogger-dashboard

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

## 🏗 Сборка для продакшена

```bash
# Собрать проект
npm run build

# Предварительный просмотр сборки
npm run preview

# Деплой на GitHub Pages
npm run deploy
```

## 📁 Структура проекта

```
src/
├── components/          # Vue компоненты
│   ├── icons/          # SVG иконки
│   ├── BloggerInfo.vue # Информация о блогере
│   ├── SocialNetworks.vue # Социальные сети
│   ├── StatsBlocks.vue # Блоки статистики
│   ├── WorkExamples.vue # Примеры работ
│   └── Reviews.vue     # Отзывы
├── composables/        # Vue композаблы
│   ├── useBloggerData.js # Данные блогера
│   └── useVideoPlayer.js # Логика видеоплеера
├── assets/            # Статические ресурсы
├── utils/             # Утилиты
└── types/             # Типы TypeScript
```

## 🎨 Компоненты

### BloggerInfo
Отображает аватар, имя, нишу блогера с адаптивными размерами.

### SocialNetworks
Показывает социальные сети с иконками и количеством подписчиков.

### StatsBlocks
Блоки статистики: рейтинг, статус, завершенные сделки с SVG иконками.

### WorkExamples
Галерея видео работ с горизонтальным скроллом на мобильных.

### Reviews
Список отзывов с маскированием имен и системой рейтингов.

## 📱 Адаптивность

- **Мобильные** (< 640px): Компактная верстка
- **Планшеты** (640px - 1024px): Сетка 3 колонки
- **Десктоп** (≥ 1024px): Полная верстка

## 🔧 Конфигурация

### Vite
Настроен для деплоя на GitHub Pages с базовым путем `/blogger-dashboard/`.

### Tailwind CSS
Использует PostCSS с автопрефиксером для кроссбраузерности.

### GitHub Pages
Деплой через ветку `gh-pages` с помощью пакета `gh-pages`.

## 📄 Лицензия

MIT License

## 👨‍💻 Автор

[Paymushkin](https://github.com/Paymushkin)