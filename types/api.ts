/**
 * Типы для API responses и общих интерфейсов
 * Обеспечивает строгую типизацию всех API ответов
 */

// ===== БАЗОВЫЕ ТИПЫ =====

/**
 * Базовый ответ API с общей структурой для всех endpoint'ов
 */
export interface BaseApiResponse<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
  message?: string;
}

/**
 * Ответ API с пагинацией
 */
export interface PaginatedApiResponse<T = any> extends BaseApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Суpabase ошибка
 */
export interface SupabaseError {
  code: string;
  message: string;
  details?: string;
  hint?: string;
}

// ===== AUTH API RESPONSES =====

/**
 * Ответ при аутентификации пользователя
 */
export interface AuthResponse {
  user: {
    id: string;
    email?: string;
    phone?: string;
    user_metadata?: Record<string, any>;
  } | null;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  } | null;
  error: SupabaseError | null;
}

/**
 * Ответ при отправке OTP
 */
export interface OtpResponse {
  success: boolean;
  error: string | null;
  messageId?: string;
}

// ===== CHAT API RESPONSES =====

/**
 * Структура чата в ответах API
 */
export interface ChatApiResponse {
  id: string;
  user_id: string;
  chat_name: string;
  chat_summary: string | null;
  chat_duration: number | null;
  chat_transcription: string | null;
  created_at: string;
  updated_at?: string;
  status: "new" | "active" | "completed" | "archived";
}

/**
 * Ответ при получении списка чатов
 */
export interface ChatsListResponse
  extends PaginatedApiResponse<ChatApiResponse> {}

/**
 * Ответ при создании чата
 */
export interface CreateChatResponse extends BaseApiResponse<ChatApiResponse> {}

/**
 * Ответ при обновлении чата
 */
export interface UpdateChatResponse extends BaseApiResponse<ChatApiResponse> {}

// ===== USER PROFILE API RESPONSES =====

/**
 * Структура профиля пользователя в ответах API
 */
export interface UserProfileApiResponse {
  user_id: string;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  company_name: string | null;
  company_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Ответ при получении профиля пользователя
 */
export interface UserProfileResponse
  extends BaseApiResponse<UserProfileApiResponse> {}

/**
 * Ответ при обновлении профиля пользователя
 */
export interface UpdateUserProfileResponse
  extends BaseApiResponse<UserProfileApiResponse> {}

// ===== INSIGHTS API RESPONSES =====

/**
 * Структура автора в ответах API
 */
export interface AuthorApiResponse {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

/**
 * Структура категории в ответах API
 */
export interface CategoryApiResponse {
  id: string;
  name: string;
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
}

/**
 * Структура статьи в ответах API
 */
export interface InsightPostApiResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  content_html: string | null;
  excerpt: string | null;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  seo_keywords: string[] | null;
  schema_org: Record<string, any> | null;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  is_published: boolean;
  author: AuthorApiResponse;
  categories: CategoryApiResponse[];
}

/**
 * Ответ при получении списка статей
 */
export interface InsightsListResponse
  extends PaginatedApiResponse<InsightPostApiResponse> {
  categories?: CategoryApiResponse[];
  selectedCategory?: CategoryApiResponse | null;
}

/**
 * Ответ при получении отдельной статьи
 */
export interface InsightDetailResponse
  extends BaseApiResponse<InsightPostApiResponse> {}

/**
 * Ответ при получении категорий
 */
export interface CategoriesResponse
  extends BaseApiResponse<CategoryApiResponse[]> {}

// ===== ELEVENLABS API RESPONSES =====

/**
 * Ответ от ElevenLabs API для получения signed URL
 */
export interface ElevenLabsSignedUrlResponse {
  url: string;
  error?: string;
}

/**
 * Конфигурация разговора для ElevenLabs
 */
export interface ConversationConfig {
  signedUrl?: string;
  agentId?: string;
}

// ===== SEO API RESPONSES =====

/**
 * SEO метаданные для страницы
 */
export interface SeoMetadata {
  meta_title: string;
  meta_description: string;
  og_image_url?: string;
  canonical_url?: string;
  robots_directive?: string;
  schema_data?: Record<string, any>;
}

/**
 * Ответ при получении SEO данных
 */
export interface SeoDataResponse extends BaseApiResponse<SeoMetadata> {}

// ===== ОБЩИЕ UTILITY ТИПЫ =====

/**
 * Типы для различных статусов операций
 */
export type OperationStatus = "idle" | "loading" | "success" | "error";

/**
 * Общий тип для опций пагинации
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Опции для фильтрации
 */
export interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Комбинированные опции запроса
 */
export interface QueryOptions extends PaginationOptions, FilterOptions {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
