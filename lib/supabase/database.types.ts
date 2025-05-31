export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      chats: {
        Row: {
          agent_id: string | null;
          call_successful: string | null;
          chat_duration: number | null;
          chat_name: string | null;
          chat_summary: string | null;
          chat_transcription: string | null;
          conversation_id: string | null;
          cost: number | null;
          created_at: string | null;
          elevenlabs_summary: string | null;
          id: string;
          language: string | null;
          status: string;
          termination_reason: string | null;
          user_id: string;
        };
        Insert: {
          agent_id?: string | null;
          call_successful?: string | null;
          chat_duration?: number | null;
          chat_name?: string | null;
          chat_summary?: string | null;
          chat_transcription?: string | null;
          conversation_id?: string | null;
          cost?: number | null;
          created_at?: string | null;
          elevenlabs_summary?: string | null;
          id?: string;
          language?: string | null;
          status?: string;
          termination_reason?: string | null;
          user_id: string;
        };
        Update: {
          agent_id?: string | null;
          call_successful?: string | null;
          chat_duration?: number | null;
          chat_name?: string | null;
          chat_summary?: string | null;
          chat_transcription?: string | null;
          conversation_id?: string | null;
          cost?: number | null;
          created_at?: string | null;
          elevenlabs_summary?: string | null;
          id?: string;
          language?: string | null;
          status?: string;
          termination_reason?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      chats_archive: {
        Row: {
          archived_at: string | null;
          chat_duration: number | null;
          chat_name: string | null;
          chat_summary: string | null;
          chat_transcription: string | null;
          created_at: string | null;
          id: string;
          operation: string;
          user_id: string;
        };
        Insert: {
          archived_at?: string | null;
          chat_duration?: number | null;
          chat_name?: string | null;
          chat_summary?: string | null;
          chat_transcription?: string | null;
          created_at?: string | null;
          id: string;
          operation: string;
          user_id: string;
        };
        Update: {
          archived_at?: string | null;
          chat_duration?: number | null;
          chat_name?: string | null;
          chat_summary?: string | null;
          chat_transcription?: string | null;
          created_at?: string | null;
          id?: string;
          operation?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      insights_authors: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          id: string;
          meta_description: string | null;
          meta_title: string | null;
          name: string;
          social_links: Json | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          name: string;
          social_links?: Json | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          name?: string;
          social_links?: Json | null;
        };
        Relationships: [];
      };
      insights_categories: {
        Row: {
          created_at: string;
          id: string;
          meta_description: string | null;
          meta_title: string | null;
          name: string;
          og_image_url: string | null;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          name: string;
          og_image_url?: string | null;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          name?: string;
          og_image_url?: string | null;
          slug?: string;
        };
        Relationships: [];
      };
      insights_posts: {
        Row: {
          author_id: string | null;
          canonical_url: string | null;
          content: string;
          content_html: string | null;
          created_at: string;
          excerpt: string | null;
          featured_image: string | null;
          id: string;
          is_published: boolean;
          meta_description: string | null;
          meta_title: string | null;
          og_image_url: string | null;
          published_at: string | null;
          schema_org: Json | null;
          seo_keywords: string[] | null;
          slug: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          author_id?: string | null;
          canonical_url?: string | null;
          content: string;
          content_html?: string | null;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          is_published?: boolean;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
          published_at?: string | null;
          schema_org?: Json | null;
          seo_keywords?: string[] | null;
          slug: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string | null;
          canonical_url?: string | null;
          content?: string;
          content_html?: string | null;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          is_published?: boolean;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
          published_at?: string | null;
          schema_org?: Json | null;
          seo_keywords?: string[] | null;
          slug?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "insights_posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "insights_authors";
            referencedColumns: ["id"];
          }
        ];
      };
      insights_posts_categories: {
        Row: {
          category_id: string;
          post_id: string;
        };
        Insert: {
          category_id: string;
          post_id: string;
        };
        Update: {
          category_id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "insights_posts_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "insights_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "insights_posts_categories_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "insights_posts";
            referencedColumns: ["id"];
          }
        ];
      };
      pending_chats: {
        Row: {
          agent_id: string | null;
          call_successful: string | null;
          chat_duration: number | null;
          chat_summary: string | null;
          chat_transcription: Json | null;
          conversation_id: string;
          cost: number | null;
          created_at: string | null;
          elevenlabs_summary: string | null;
          id: string;
          language: string | null;
          termination_reason: string | null;
          user_phone: string;
        };
        Insert: {
          agent_id?: string | null;
          call_successful?: string | null;
          chat_duration?: number | null;
          chat_summary?: string | null;
          chat_transcription?: Json | null;
          conversation_id: string;
          cost?: number | null;
          created_at?: string | null;
          elevenlabs_summary?: string | null;
          id?: string;
          language?: string | null;
          termination_reason?: string | null;
          user_phone: string;
        };
        Update: {
          agent_id?: string | null;
          call_successful?: string | null;
          chat_duration?: number | null;
          chat_summary?: string | null;
          chat_transcription?: Json | null;
          conversation_id?: string;
          cost?: number | null;
          created_at?: string | null;
          elevenlabs_summary?: string | null;
          id?: string;
          language?: string | null;
          termination_reason?: string | null;
          user_phone?: string;
        };
        Relationships: [];
      };
      seo_pages: {
        Row: {
          canonical_url: string | null;
          change_frequency: string | null;
          created_at: string | null;
          is_active: boolean | null;
          meta_description: string;
          meta_title: string;
          og_image_url: string | null;
          path: string;
          priority: number | null;
          robots_directive: string | null;
          schema_data: Json | null;
          updated_at: string | null;
        };
        Insert: {
          canonical_url?: string | null;
          change_frequency?: string | null;
          created_at?: string | null;
          is_active?: boolean | null;
          meta_description: string;
          meta_title: string;
          og_image_url?: string | null;
          path: string;
          priority?: number | null;
          robots_directive?: string | null;
          schema_data?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          canonical_url?: string | null;
          change_frequency?: string | null;
          created_at?: string | null;
          is_active?: boolean | null;
          meta_description?: string;
          meta_title?: string;
          og_image_url?: string | null;
          path?: string;
          priority?: number | null;
          robots_directive?: string | null;
          schema_data?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      seo_settings: {
        Row: {
          description: string | null;
          key: string;
          updated_at: string | null;
          value: Json;
        };
        Insert: {
          description?: string | null;
          key: string;
          updated_at?: string | null;
          value: Json;
        };
        Update: {
          description?: string | null;
          key?: string;
          updated_at?: string | null;
          value?: Json;
        };
        Relationships: [];
      };
      topics: {
        Row: {
          created_at: string | null;
          id: string;
          status: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          status?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          status?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          company_name: string | null;
          company_url: string | null;
          created_at: string | null;
          updated_at: string | null;
          user_email: string | null;
          user_id: string;
          user_name: string | null;
          user_phone: string | null;
        };
        Insert: {
          company_name?: string | null;
          company_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          user_email?: string | null;
          user_id: string;
          user_name?: string | null;
          user_phone?: string | null;
        };
        Update: {
          company_name?: string | null;
          company_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          user_email?: string | null;
          user_id?: string;
          user_name?: string | null;
          user_phone?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      bytea_to_text: {
        Args: { data: string };
        Returns: string;
      };
      daily_topic_processing: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      get_category_seo_metadata: {
        Args: { category_slug: string };
        Returns: {
          meta_title: string;
          meta_description: string;
          og_image_url: string;
          schema_data: Json;
        }[];
      };
      get_post_seo_metadata: {
        Args: { post_slug: string };
        Returns: {
          meta_title: string;
          meta_description: string;
          og_image_url: string;
          canonical_url: string;
          schema_data: Json;
          post_data: Json;
        }[];
      };
      get_seo_metadata: {
        Args: { page_path: string };
        Returns: {
          meta_title: string;
          meta_description: string;
          og_image_url: string;
          canonical_url: string;
          schema_data: Json;
          robots_directive: string;
        }[];
      };
      get_sitemap_data: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_get: {
        Args: { uri: string } | { uri: string; data: Json };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_head: {
        Args: { uri: string };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_header: {
        Args: { field: string; value: string };
        Returns: Database["public"]["CompositeTypes"]["http_header"];
      };
      http_list_curlopt: {
        Args: Record<PropertyKey, never>;
        Returns: {
          curlopt: string;
          value: string;
        }[];
      };
      http_patch: {
        Args: { uri: string; content: string; content_type: string };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_put: {
        Args: { uri: string; content: string; content_type: string };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      http_set_curlopt: {
        Args: { curlopt: string; value: string };
        Returns: boolean;
      };
      manual_process_topic: {
        Args: Record<PropertyKey, never>;
        Returns: {
          success: boolean;
          topic_id: string;
          topic_title: string;
          webhook_response: string;
          message: string;
        }[];
      };
      markdown_to_html: {
        Args: { markdown_text: string };
        Returns: string;
      };
      process_next_topic: {
        Args: Record<PropertyKey, never>;
        Returns: {
          processed_topic_id: string;
          topic_title: string;
          webhook_response: string;
        }[];
      };
      text_to_bytea: {
        Args: { data: string };
        Returns: string;
      };
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string };
        Returns: string;
      };
    };
    Enums: {
      call_direction: "inbound" | "outbound";
      call_status: "initiated" | "connected" | "completed" | "failed";
    };
    CompositeTypes: {
      http_header: {
        field: string | null;
        value: string | null;
      };
      http_request: {
        method: unknown | null;
        uri: string | null;
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null;
        content_type: string | null;
        content: string | null;
      };
      http_response: {
        status: number | null;
        content_type: string | null;
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null;
        content: string | null;
      };
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      call_direction: ["inbound", "outbound"],
      call_status: ["initiated", "connected", "completed", "failed"],
    },
  },
} as const;

// Convenience type exports
export type Chat = Database["public"]["Tables"]["chats"]["Row"];
export type ChatInsert = Database["public"]["Tables"]["chats"]["Insert"];
export type ChatUpdate = Database["public"]["Tables"]["chats"]["Update"];

export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type UserProfileInsert =
  Database["public"]["Tables"]["user_profiles"]["Insert"];
export type UserProfileUpdate =
  Database["public"]["Tables"]["user_profiles"]["Update"];

// Insights types
export type InsightsPost =
  Database["public"]["Tables"]["insights_posts"]["Row"];
export type InsightsPostInsert =
  Database["public"]["Tables"]["insights_posts"]["Insert"];
export type InsightsPostUpdate =
  Database["public"]["Tables"]["insights_posts"]["Update"];

export type InsightsAuthor =
  Database["public"]["Tables"]["insights_authors"]["Row"];
export type InsightsCategory =
  Database["public"]["Tables"]["insights_categories"]["Row"];

export type PendingChat = Database["public"]["Tables"]["pending_chats"]["Row"];
export type Topic = Database["public"]["Tables"]["topics"]["Row"];
export type SEOSettings = Database["public"]["Tables"]["seo_settings"]["Row"];
export type SEOPages = Database["public"]["Tables"]["seo_pages"]["Row"];
