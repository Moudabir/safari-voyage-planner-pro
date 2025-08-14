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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      attendees: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          trip_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          trip_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendees_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_payers: {
        Row: {
          amount: number
          attendee_id: string | null
          created_at: string
          expense_id: string
          id: string
          payer_name: string
        }
        Insert: {
          amount: number
          attendee_id?: string | null
          created_at?: string
          expense_id: string
          id?: string
          payer_name: string
        }
        Update: {
          amount?: number
          attendee_id?: string | null
          created_at?: string
          expense_id?: string
          id?: string
          payer_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_payers_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "attendees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_payers_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          description: string
          id: string
          paid_by: string
          trip_id: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          description: string
          id?: string
          paid_by: string
          trip_id: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          description?: string
          id?: string
          paid_by?: string
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_items: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          pictures: string[] | null
          time: string | null
          title: string
          trip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          pictures?: string[] | null
          time?: string | null
          title: string
          trip_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          pictures?: string[] | null
          time?: string | null
          title?: string
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_shares: {
        Row: {
          can_view_attendees: boolean
          can_view_expenses: boolean
          can_view_schedule: boolean
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          passcode_hash: string | null
          revoked_at: string | null
          token: string
          trip_id: string
        }
        Insert: {
          can_view_attendees?: boolean
          can_view_expenses?: boolean
          can_view_schedule?: boolean
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          passcode_hash?: string | null
          revoked_at?: string | null
          token: string
          trip_id: string
        }
        Update: {
          can_view_attendees?: boolean
          can_view_expenses?: boolean
          can_view_schedule?: boolean
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          passcode_hash?: string | null
          revoked_at?: string | null
          token?: string
          trip_id?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
          whatsapp_link: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id: string
          whatsapp_link?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
          whatsapp_link?: string | null
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
      expense_category:
        | "food"
        | "transport"
        | "accommodation"
        | "entertainment"
        | "shopping"
        | "other"
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
      expense_category: [
        "food",
        "transport",
        "accommodation",
        "entertainment",
        "shopping",
        "other",
      ],
    },
  },
} as const
