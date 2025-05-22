export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      // Insights tables
      insights_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          content_html: string | null
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
          content_html?: string | null
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
          content_html?: string | null
          excerpt?: string | null
          featured_image?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string | null
          author_id?: string | null
          is_published?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "insights_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "insights_authors"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "insights_posts_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "insights_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insights_posts_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "insights_posts"
            referencedColumns: ["id"]
          },
        ]
      }

      // Chats tables
      chats: {
        Row: {
          id: string
          user_id: string
          created_at: string
          chat_duration: number | null
          chat_name: string | null
          chat_summary: string | null
          chat_transcription: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          chat_duration?: number | null
          chat_name?: string | null
          chat_summary?: string | null
          chat_transcription?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          chat_duration?: number | null
          chat_name?: string | null
          chat_summary?: string | null
          chat_transcription?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }

      // Calls tables
      calls: {
        Row: {
          id: string
          user_id: string
          created_at: string
          call_duration: number | null
          call_name: string | null
          call_summary: string | null
          call_transcription: string | null
          status: string
          elevenlabs_session_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          call_duration?: number | null
          call_name?: string | null
          call_summary?: string | null
          call_transcription?: string | null
          status?: string
          elevenlabs_session_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          call_duration?: number | null
          call_name?: string | null
          call_summary?: string | null
          call_transcription?: string | null
          status?: string
          elevenlabs_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }

      call_analytics: {
        Row: {
          id: string
          call_id: string
          created_at: string
          analytics_data: Json
          processed_at: string | null
        }
        Insert: {
          id?: string
          call_id: string
          created_at?: string
          analytics_data: Json
          processed_at?: string | null
        }
        Update: {
          id?: string
          call_id?: string
          created_at?: string
          analytics_data?: Json
          processed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_analytics_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
        ]
      }

      // User profiles
      user_profiles: {
        Row: {
          user_id: string
          user_name: string | null
          user_email: string | null
          company_name: string | null
          company_url: string | null
          user_phone: string | null
          created_at: string
          updated_at: string | null
          account_type: string | null
          subscription_status: string | null
          subscription_id: string | null
        }
        Insert: {
          user_id: string
          user_name?: string | null
          user_email?: string | null
          company_name?: string | null
          company_url?: string | null
          user_phone?: string | null
          created_at?: string
          updated_at?: string | null
          account_type?: string | null
          subscription_status?: string | null
          subscription_id?: string | null
        }
        Update: {
          user_id?: string
          user_name?: string | null
          user_email?: string | null
          company_name?: string | null
          company_url?: string | null
          user_phone?: string | null
          created_at?: string
          updated_at?: string | null
          account_type?: string | null
          subscription_status?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
