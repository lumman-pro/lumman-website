// ✅ СОЗДАНО: Константы для времени кэширования и других magic numbers

// React Query cache times (в миллисекундах)
export const CACHE_TIMES = {
  // Stale times
  CHATS: 30 * 1000, // 30 секунд - исправлено название
  CHAT_DETAILS: 60 * 1000, // 1 минута - исправлено название
  INSIGHTS: 60 * 1000, // 1 минута - для списка статей
  INSIGHT_BY_SLUG: 5 * 60 * 1000, // 5 минут - для отдельной статьи
  INSIGHTS_STALE: 5 * 60 * 1000, // 5 минут - общее значение
  USER_DATA_STALE: 5 * 60 * 1000, // 5 минут

  // Toast delays
  TOAST_REMOVE_DELAY: 5 * 1000, // 5 секунд

  // OTP expiry
  OTP_EXPIRY: 5 * 60 * 1000, // 5 минут
} as const;

// API timeouts
export const API_TIMEOUTS = {
  DEFAULT: 10 * 1000, // 10 секунд
  UPLOAD: 30 * 1000, // 30 секунд
  AUTH: 15 * 1000, // 15 секунд
} as const;

// UI constants
export const UI_CONSTANTS = {
  LUKE_BUTTON_WIDTH: 120,
  LUKE_BUTTON_HEIGHT: 42,
  SIDEBAR_WIDTH: 256, // 64 * 4 (w-64 в Tailwind)
} as const;
