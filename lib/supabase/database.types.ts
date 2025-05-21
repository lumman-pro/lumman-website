export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      insights_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          featured_image: string | null
          published_at: string | null
          created_at: string
          updated_at: string | null
          author_id: string | null
          is_published: boolean
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          featured_image?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string | null
          author_id?: string | null
          is_published?: boolean
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          featured_image?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string | null
          author_id?: string | null
          is_published?: boolean
        }
      }
      insights_authors: {
        Row: {
          id: string
          name: string
          bio: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      insights_categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      insights_posts_categories: {
        Row: {
          post_id: string
          category_id: string
        }
        Insert: {
          post_id: string
          category_id: string
        }
        Update: {
          post_id?: string
          category_id?: string
        }
      }
      chats: {
        Row: {
          id: string
          user_id: string
          created_at: string
          chat_duration: number | null
          chat_name: string | null
          chat_summary: string | null
          chat_transcription: string | null
          // Removed the deleted field
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          chat_duration?: number | null
          chat_name?: string | null
          chat_summary?: string | null
          chat_transcription?: string | null
          // Removed the deleted field
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          chat_duration?: number | null
          chat_name?: string | null
          chat_summary?: string | null
          chat_transcription?: string | null
          // Removed the deleted field
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          user_name: string | null
          user_email: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          user_name?: string | null
          user_email?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string | null
          user_email?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      // Add your views here
    }
    Functions: {
      // Add your functions here
    }
    Enums: {
      // Add your enums here
    }
  }
}
