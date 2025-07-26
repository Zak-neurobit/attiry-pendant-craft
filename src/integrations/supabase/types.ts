export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean | null
          line1: string
          line2: string | null
          name: string
          state: string
          updated_at: string
          user_id: string
          zip: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          line1: string
          line2?: string | null
          name: string
          state: string
          updated_at?: string
          user_id: string
          zip: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          line1?: string
          line2?: string | null
          name?: string
          state?: string
          updated_at?: string
          user_id?: string
          zip?: string
        }
        Relationships: []
      }
      admin_initialization: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          initialization_token: string
          used: boolean
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          initialization_token: string
          used?: boolean
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          initialization_token?: string
          used?: boolean
        }
        Relationships: []
      }
      alerts_config: {
        Row: {
          channel: string | null
          comparator: string
          created_at: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          metric: string
          threshold: number
        }
        Insert: {
          channel?: string | null
          comparator: string
          created_at?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          metric: string
          threshold: number
        }
        Update: {
          channel?: string | null
          comparator?: string
          created_at?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          metric?: string
          threshold?: number
        }
        Relationships: []
      }
      alerts_log: {
        Row: {
          alert_id: string
          id: string
          metric_value: number | null
          sent: boolean | null
          triggered_at: string | null
        }
        Insert: {
          alert_id: string
          id?: string
          metric_value?: number | null
          sent?: boolean | null
          triggered_at?: string | null
        }
        Update: {
          alert_id?: string
          id?: string
          metric_value?: number | null
          sent?: boolean | null
          triggered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_log_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts_config"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          key_hash: string
          key_preview: string
          last_used: string | null
          name: string
          permissions: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          key_preview: string
          last_used?: string | null
          name: string
          permissions?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          key_preview?: string
          last_used?: string | null
          name?: string
          permissions?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      api_usage_logs: {
        Row: {
          api_key_id: string | null
          created_at: string
          endpoint: string
          id: string
          ip_address: string | null
          method: string
          response_status: number | null
          response_time_ms: number | null
          user_agent: string | null
        }
        Insert: {
          api_key_id?: string | null
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: string | null
          method: string
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
        }
        Update: {
          api_key_id?: string | null
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: string | null
          method?: string
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      design_requests: {
        Row: {
          created_at: string | null
          delivery_date: string | null
          description: string
          email: string
          id: string
          image_url: string | null
          name: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_date?: string | null
          description: string
          email: string
          id?: string
          image_url?: string | null
          name: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_date?: string | null
          description?: string
          email?: string
          id?: string
          image_url?: string | null
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          amount: number | null
          created_at: string | null
          event: string
          extras: Json | null
          id: number
          image_id: string | null
          page: string | null
          product_id: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          event: string
          extras?: Json | null
          id?: number
          image_id?: string | null
          page?: string | null
          product_id?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          event?: string
          extras?: Json | null
          id?: number
          image_id?: string | null
          page?: string | null
          product_id?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_heat_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          id: string
          points: number | null
          tier: string | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          points?: number | null
          tier?: string | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          points?: number | null
          tier?: string | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          chain_type: string | null
          color_variant: Database["public"]["Enums"]["color_variant"]
          created_at: string
          custom_text: string | null
          font_choice: string | null
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          chain_type?: string | null
          color_variant?: Database["public"]["Enums"]["color_variant"]
          created_at?: string
          custom_text?: string | null
          font_choice?: string | null
          id?: string
          order_id: string
          product_id: string
          quantity?: number
          unit_price: number
        }
        Update: {
          chain_type?: string | null
          color_variant?: Database["public"]["Enums"]["color_variant"]
          created_at?: string
          custom_text?: string | null
          font_choice?: string | null
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_heat_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          ad_spend: number | null
          created_at: string
          customer_email: string
          customer_name: string
          discount_amount: number | null
          gateway_fee: number | null
          id: string
          shipping_address: Json
          shipping_cost: number | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ad_spend?: number | null
          created_at?: string
          customer_email: string
          customer_name: string
          discount_amount?: number | null
          gateway_fee?: number | null
          id?: string
          shipping_address: Json
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ad_spend?: number | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          discount_amount?: number | null
          gateway_fee?: number | null
          id?: string
          shipping_address?: Json
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          chain_types: string[] | null
          cogs: number | null
          color_variants: Database["public"]["Enums"]["color_variant"][] | null
          compare_price: number | null
          created_at: string
          description: string | null
          featured_order: number | null
          fonts: string[] | null
          id: string
          image_urls: string[] | null
          is_active: boolean
          is_featured: boolean | null
          is_new: boolean | null
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          price: number
          rating: number | null
          review_count: number | null
          sku: string | null
          slug: string | null
          stock: number
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          chain_types?: string[] | null
          cogs?: number | null
          color_variants?: Database["public"]["Enums"]["color_variant"][] | null
          compare_price?: number | null
          created_at?: string
          description?: string | null
          featured_order?: number | null
          fonts?: string[] | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean
          is_featured?: boolean | null
          is_new?: boolean | null
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          price: number
          rating?: number | null
          review_count?: number | null
          sku?: string | null
          slug?: string | null
          stock?: number
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          chain_types?: string[] | null
          cogs?: number | null
          color_variants?: Database["public"]["Enums"]["color_variant"][] | null
          compare_price?: number | null
          created_at?: string
          description?: string | null
          featured_order?: number | null
          fonts?: string[] | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean
          is_featured?: boolean | null
          is_new?: boolean | null
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          price?: number
          rating?: number | null
          review_count?: number | null
          sku?: string | null
          slug?: string | null
          stock?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birthday: string | null
          created_at: string
          email: string
          favourites: string[] | null
          first_name: string | null
          id: string
          is_blocked: boolean | null
          last_name: string | null
          notes: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          birthday?: string | null
          created_at?: string
          email: string
          favourites?: string[] | null
          first_name?: string | null
          id?: string
          is_blocked?: boolean | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          birthday?: string | null
          created_at?: string
          email?: string
          favourites?: string[] | null
          first_name?: string | null
          id?: string
          is_blocked?: boolean | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string
          reward_issued: boolean | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id: string
          reward_issued?: boolean | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string
          reward_issued?: boolean | null
          status?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful: number | null
          id: string
          images: string[] | null
          not_helpful: number | null
          order_id: string | null
          product_id: string
          rating: number
          status: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful?: number | null
          id?: string
          images?: string[] | null
          not_helpful?: number | null
          order_id?: string | null
          product_id: string
          rating: number
          status?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful?: number | null
          id?: string
          images?: string[] | null
          not_helpful?: number | null
          order_id?: string | null
          product_id?: string
          rating?: number
          status?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_heat_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_behavior: {
        Row: {
          currency: string | null
          id: string
          locale: string | null
          preferences: Json | null
          recent_searches: string[] | null
          updated_at: string | null
          user_id: string
          viewed_products: string[] | null
        }
        Insert: {
          currency?: string | null
          id?: string
          locale?: string | null
          preferences?: Json | null
          recent_searches?: string[] | null
          updated_at?: string | null
          user_id: string
          viewed_products?: string[] | null
        }
        Update: {
          currency?: string | null
          id?: string
          locale?: string | null
          preferences?: Json | null
          recent_searches?: string[] | null
          updated_at?: string | null
          user_id?: string
          viewed_products?: string[] | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_customer_overview: {
        Row: {
          email: string | null
          first_name: string | null
          id: string | null
          is_blocked: boolean | null
          joined_at: string | null
          last_name: string | null
          last_order_at: string | null
          loyalty_points: number | null
          loyalty_tier: string | null
          phone: string | null
          total_orders: number | null
          total_spent: number | null
          user_id: string | null
        }
        Relationships: []
      }
      conversion_funnel_view: {
        Row: {
          event: string | null
          total_events: number | null
          unique_sessions: number | null
        }
        Relationships: []
      }
      product_heat_view: {
        Row: {
          add_to_carts: number | null
          id: string | null
          purchases: number | null
          revenue: number | null
          title: string | null
          views: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_initial_admin: {
        Args: {
          p_email: string
          p_password: string
          p_initialization_token: string
        }
        Returns: Json
      }
      get_current_user_profile: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin_email: {
        Args: { email_address: string }
        Returns: boolean
      }
      refresh_analytics_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      test_profile_creation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      test_profile_trigger: {
        Args: Record<PropertyKey, never>
        Returns: {
          trigger_exists: boolean
          function_exists: boolean
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      color_variant:
        | "gold"
        | "rose_gold"
        | "silver"
        | "matte_gold"
        | "matte_silver"
        | "vintage_copper"
        | "black"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      color_variant: [
        "gold",
        "rose_gold",
        "silver",
        "matte_gold",
        "matte_silver",
        "vintage_copper",
        "black",
      ],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const
