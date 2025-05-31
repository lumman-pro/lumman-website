import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Универсальная утилита для проверки аутентификации пользователя
 * Устраняет дублирование auth логики в хуках и компонентах
 *
 * @param supabase - Клиент Supabase
 * @returns Объект с данными пользователя или ошибкой
 */
export async function checkUserAuthentication(
  supabase: SupabaseClient<Database> | null
): Promise<{
  user: any | null;
  session: any | null;
  error: string | null;
}> {
  if (!supabase) {
    return {
      user: null,
      session: null,
      error: "Supabase client not available",
    };
  }

  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      return {
        user: null,
        session: null,
        error: `Authentication error: ${sessionError.message}`,
      };
    }

    if (!sessionData.session) {
      return {
        user: null,
        session: null,
        error: "You must be logged in",
      };
    }

    return {
      user: sessionData.session.user,
      session: sessionData.session,
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      session: null,
      error: err instanceof Error ? err.message : "Authentication failed",
    };
  }
}

/**
 * Проверяет доступность Supabase клиента и его инициализацию
 *
 * @param supabase - Клиент Supabase
 * @param isInitialized - Флаг инициализации
 * @returns true если клиент готов к использованию
 */
export function isSupabaseReady(
  supabase: SupabaseClient<Database> | null,
  isInitialized: boolean
): boolean {
  return isInitialized && !!supabase;
}

/**
 * Утилита для безопасного выполнения операций с проверкой auth
 *
 * @param supabase - Клиент Supabase
 * @param isInitialized - Флаг инициализации
 * @param operation - Функция для выполнения
 * @returns Результат операции или ошибка
 */
export async function withAuthCheck<T>(
  supabase: SupabaseClient<Database> | null,
  isInitialized: boolean,
  operation: (user: any) => Promise<T>
): Promise<T> {
  if (!isSupabaseReady(supabase, isInitialized)) {
    throw new Error("Supabase client not available");
  }

  const authResult = await checkUserAuthentication(supabase);

  if (authResult.error || !authResult.user) {
    throw new Error(authResult.error || "Authentication required");
  }

  return operation(authResult.user);
}
