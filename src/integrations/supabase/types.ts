export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          additional_services_price: number | null
          booking_date: string
          client_email: string | null
          client_id: string
          client_name: string | null
          client_phone: string | null
          created_at: string | null
          end_time: string | null
          event_type: string | null
          guest_count: number | null
          host_id: string
          id: string
          notes: string | null
          payment_status: string | null
          service_fee: number | null
          space_id: string
          space_price: number | null
          space_title: string | null
          start_time: string | null
          status: string | null
          total_price: number | null
          updated_at: string | null
        }
        Insert: {
          additional_services_price?: number | null
          booking_date: string
          client_email?: string | null
          client_id: string
          client_name?: string | null
          client_phone?: string | null
          created_at?: string | null
          end_time?: string | null
          event_type?: string | null
          guest_count?: number | null
          host_id: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          service_fee?: number | null
          space_id: string
          space_price?: number | null
          space_title?: string | null
          start_time?: string | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Update: {
          additional_services_price?: number | null
          booking_date?: string
          client_email?: string | null
          client_id?: string
          client_name?: string | null
          client_phone?: string | null
          created_at?: string | null
          end_time?: string | null
          event_type?: string | null
          guest_count?: number | null
          host_id?: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          service_fee?: number | null
          space_id?: string
          space_price?: number | null
          space_title?: string | null
          start_time?: string | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      spaces: {
        Row: {
          amenities: string[] | null
          availability: string[] | null
          capacity: number
          created_at: string | null
          description: string
          host_id: string
          hourly_price: number | null
          id: string
          images: string[] | null
          location: Json
          price: number | null
          pricing_type: string
          space_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          availability?: string[] | null
          capacity: number
          created_at?: string | null
          description: string
          host_id: string
          hourly_price?: number | null
          id?: string
          images?: string[] | null
          location: Json
          price?: number | null
          pricing_type?: string
          space_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          availability?: string[] | null
          capacity?: number
          created_at?: string | null
          description?: string
          host_id?: string
          hourly_price?: number | null
          id?: string
          images?: string[] | null
          location?: Json
          price?: number | null
          pricing_type?: string
          space_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stripe_config: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          mode: string
          prod_key: string | null
          test_key: string
          updated_at: string
          updated_by: string | null
          webhook_secret: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          mode?: string
          prod_key?: string | null
          test_key: string
          updated_at?: string
          updated_by?: string | null
          webhook_secret?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          mode?: string
          prod_key?: string | null
          test_key?: string
          updated_at?: string
          updated_by?: string | null
          webhook_secret?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "client" | "host" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["client", "host", "admin"],
    },
  },
} as const
