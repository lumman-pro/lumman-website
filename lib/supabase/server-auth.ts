import { createServerSupabaseClient } from "./server-client";
import { redirect } from "next/navigation";

export async function getServerSession() {
  try {
    const supabase = createServerSupabaseClient();

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting server session:", error);
      return null;
    }

    // Если сессия отсутствует, попробуем получить пользователя и обновить сессию
    if (!session) {
      console.log("Server session is empty, trying to get user explicitly");

      // Получаем пользователя
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user in server auth:", userError);
        return null;
      }

      if (userData?.user) {
        console.log("Successfully retrieved user data in server auth");

        // Если пользователь получен, но сессия отсутствует, попробуем обновить сессию
        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError) {
          console.error(
            "Error refreshing session in server auth:",
            refreshError,
          );
          return null;
        }

        if (refreshData?.session) {
          console.log("Successfully refreshed session in server auth");
          return refreshData.session;
        }
      }
    }

    return session;
  } catch (err) {
    console.error("Unexpected error in getServerSession:", err);
    return null;
  }
}

export async function requireAuth() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function getServerUser() {
  const session = await getServerSession();
  return session?.user || null;
}
