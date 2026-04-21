export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      lightspeed_tokens: {
        Row: {
          access_token: string
          created_at: string
          domain_prefix: string
          expires_at: string
          id: string
          last_sync_at: string | null
          refresh_token: string
          scope: string | null
          updated_at: string
        }
        Insert: {
          access_token: string
          created_at?: string
          domain_prefix: string
          expires_at: string
          id?: string
          last_sync_at?: string | null
          refresh_token: string
          scope?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          domain_prefix?: string
          expires_at?: string
          id?: string
          last_sync_at?: string | null
          refresh_token?: string
          scope?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          birthday: string | null
          created_at: string | null
          email: string | null
          expiration_date: string | null
          first_name: string
          id: string
          id_back_url: string | null
          id_front_url: string | null
          id_number: string | null
          joined_date: string | null
          last_name: string
          marketing_consent: boolean | null
          phone: string | null
          referral_source: string | null
          status: string | null
          terms_accepted: boolean | null
        }
        Insert: {
          birthday?: string | null
          created_at?: string | null
          email?: string | null
          expiration_date?: string | null
          first_name: string
          id?: string
          id_back_url?: string | null
          id_front_url?: string | null
          id_number?: string | null
          joined_date?: string | null
          last_name: string
          marketing_consent?: boolean | null
          phone?: string | null
          referral_source?: string | null
          status?: string | null
          terms_accepted?: boolean | null
        }
        Update: {
          birthday?: string | null
          created_at?: string | null
          email?: string | null
          expiration_date?: string | null
          first_name?: string
          id?: string
          id_back_url?: string | null
          id_front_url?: string | null
          id_number?: string | null
          joined_date?: string | null
          last_name?: string
          marketing_consent?: boolean | null
          phone?: string | null
          referral_source?: string | null
          status?: string | null
          terms_accepted?: boolean | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          customer_name: string
          email: string | null
          id: string
          items: Json
          payment_ref: string | null
          payment_type: string | null
          phone: string | null
          postal_code: string | null
          referred_by: string | null
          status: string
          total: number
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          customer_name: string
          email?: string | null
          id?: string
          items?: Json
          payment_ref?: string | null
          payment_type?: string | null
          phone?: string | null
          postal_code?: string | null
          referred_by?: string | null
          status?: string
          total?: number
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          customer_name?: string
          email?: string | null
          id?: string
          items?: Json
          payment_ref?: string | null
          payment_type?: string | null
          phone?: string | null
          postal_code?: string | null
          referred_by?: string | null
          status?: string
          total?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          legacy_id: number | null
          lightspeed_id: string | null
          name: string
          price: number
          sale_price: number | null
          sku: string | null
          slug: string
          subcategory: string | null
          updated_at: string
          visible: boolean | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          legacy_id?: number | null
          lightspeed_id?: string | null
          name: string
          price?: number
          sale_price?: number | null
          sku?: string | null
          slug: string
          subcategory?: string | null
          updated_at?: string
          visible?: boolean | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          legacy_id?: number | null
          lightspeed_id?: string | null
          name?: string
          price?: number
          sale_price?: number | null
          sku?: string | null
          slug?: string
          subcategory?: string | null
          updated_at?: string
          visible?: boolean | null
        }
        Relationships: []
      }
      strains: {
        Row: {
          category: string
          cbd_max: number | null
          cbd_min: number | null
          created_at: string | null
          description: string | null
          effects: string[] | null
          featured: boolean | null
          feelings: string[] | null
          flavours: string[] | null
          grow_difficulty: string | null
          grow_info: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          is_preroll: boolean | null
          name: string
          parents: string | null
          slug: string
          terpenes: string[] | null
          thc_max: number | null
          thc_min: number | null
          visible: boolean | null
        }
        Insert: {
          category?: string
          cbd_max?: number | null
          cbd_min?: number | null
          created_at?: string | null
          description?: string | null
          effects?: string[] | null
          featured?: boolean | null
          feelings?: string[] | null
          flavours?: string[] | null
          grow_difficulty?: string | null
          grow_info?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          is_preroll?: boolean | null
          name: string
          parents?: string | null
          slug: string
          terpenes?: string[] | null
          thc_max?: number | null
          thc_min?: number | null
          visible?: boolean | null
        }
        Update: {
          category?: string
          cbd_max?: number | null
          cbd_min?: number | null
          created_at?: string | null
          description?: string | null
          effects?: string[] | null
          featured?: boolean | null
          feelings?: string[] | null
          flavours?: string[] | null
          grow_difficulty?: string | null
          grow_info?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          is_preroll?: boolean | null
          name?: string
          parents?: string | null
          slug?: string
          terpenes?: string[] | null
          thc_max?: number | null
          thc_min?: number | null
          visible?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
