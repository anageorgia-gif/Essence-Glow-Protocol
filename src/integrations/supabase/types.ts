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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ecobag_reservations: {
        Row: {
          created_at: string
          id: string
          is_free: boolean
          items_count: number
          total_amount: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_free?: boolean
          items_count?: number
          total_amount?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          is_free?: boolean
          items_count?: number
          total_amount?: number | null
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          client_ip: string | null
          created_at: string
          ecobag_free: boolean
          ecobag_included: boolean
          ecobag_price: number
          formula_ids: string[]
          formulas: Json
          id: string
          observations: string | null
          patient_cpf: string
          patient_email: string | null
          patient_name: string
          patient_phone: string
          pdf_path: string | null
          subtotal: number
          total: number
          whatsapp_error: string | null
          whatsapp_sent: boolean
        }
        Insert: {
          client_ip?: string | null
          created_at?: string
          ecobag_free?: boolean
          ecobag_included?: boolean
          ecobag_price?: number
          formula_ids?: string[]
          formulas?: Json
          id?: string
          observations?: string | null
          patient_cpf: string
          patient_email?: string | null
          patient_name: string
          patient_phone: string
          pdf_path?: string | null
          subtotal?: number
          total?: number
          whatsapp_error?: string | null
          whatsapp_sent?: boolean
        }
        Update: {
          client_ip?: string | null
          created_at?: string
          ecobag_free?: boolean
          ecobag_included?: boolean
          ecobag_price?: number
          formula_ids?: string[]
          formulas?: Json
          id?: string
          observations?: string | null
          patient_cpf?: string
          patient_email?: string | null
          patient_name?: string
          patient_phone?: string
          pdf_path?: string | null
          subtotal?: number
          total?: number
          whatsapp_error?: string | null
          whatsapp_sent?: boolean
        }
        Relationships: []
      }
      protocols: {
        Row: {
          created_at: string
          formulas: Json
          id: string
          observations: string | null
          patient_cpf: string
          patient_email: string | null
          patient_name: string
          patient_phone: string
          payment_method: string | null
          pdf_path: string | null
          total_amount: number | null
        }
        Insert: {
          created_at?: string
          formulas?: Json
          id?: string
          observations?: string | null
          patient_cpf: string
          patient_email?: string | null
          patient_name: string
          patient_phone: string
          payment_method?: string | null
          pdf_path?: string | null
          total_amount?: number | null
        }
        Update: {
          created_at?: string
          formulas?: Json
          id?: string
          observations?: string | null
          patient_cpf?: string
          patient_email?: string | null
          patient_name?: string
          patient_phone?: string
          payment_method?: string | null
          pdf_path?: string | null
          total_amount?: number | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          id: number
          ip: string
          route: string
        }
        Insert: {
          created_at?: string
          id?: number
          ip: string
          route: string
        }
        Update: {
          created_at?: string
          id?: number
          ip?: string
          route?: string
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
