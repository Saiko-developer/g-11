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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      class_exam_ai_drafts: {
        Row: {
          attempt_id: string
          error: string | null
          result: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          attempt_id: string
          error?: string | null
          result?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempt_id?: string
          error?: string | null
          result?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_exam_ai_drafts_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: true
            referencedRelation: "class_exam_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      class_exam_attempts: {
        Row: {
          assignment_id: string
          graded_at: string | null
          id: string
          image_paths: string[]
          result: Json | null
          score: number | null
          started_at: string
          student_id: string
          submitted_at: string | null
          teacher_feedback: string
          total_marks: number | null
        }
        Insert: {
          assignment_id: string
          graded_at?: string | null
          id?: string
          image_paths?: string[]
          result?: Json | null
          score?: number | null
          started_at?: string
          student_id?: string
          submitted_at?: string | null
          teacher_feedback?: string
          total_marks?: number | null
        }
        Update: {
          assignment_id?: string
          graded_at?: string | null
          id?: string
          image_paths?: string[]
          result?: Json | null
          score?: number | null
          started_at?: string
          student_id?: string
          submitted_at?: string | null
          teacher_feedback?: string
          total_marks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "class_exam_attempts_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "classroom_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_assignments: {
        Row: {
          classroom_id: string
          created_at: string
          created_by: string
          due_at: string | null
          duration_minutes: number
          id: string
          instructions: string
          kind: string
          paper_data: Json | null
          title: string
          unit: number
        }
        Insert: {
          classroom_id: string
          created_at?: string
          created_by?: string
          due_at?: string | null
          duration_minutes?: number
          id?: string
          instructions?: string
          kind?: string
          paper_data?: Json | null
          title: string
          unit: number
        }
        Update: {
          classroom_id?: string
          created_at?: string
          created_by?: string
          due_at?: string | null
          duration_minutes?: number
          id?: string
          instructions?: string
          kind?: string
          paper_data?: Json | null
          title?: string
          unit?: number
        }
        Relationships: [
          {
            foreignKeyName: "classroom_assignments_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_members: {
        Row: {
          classroom_id: string
          display_name: string
          joined_at: string
          student_id: string
        }
        Insert: {
          classroom_id: string
          display_name?: string
          joined_at?: string
          student_id: string
        }
        Update: {
          classroom_id?: string
          display_name?: string
          joined_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_members_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classrooms: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          subject: string
          teacher_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          subject?: string
          teacher_id?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          subject?: string
          teacher_id?: string
        }
        Relationships: []
      }
      exam_generations: {
        Row: {
          created_at: string
          id: string
          paper: Json
          unit: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          paper: Json
          unit: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          paper?: Json
          unit?: number
          user_id?: string
        }
        Relationships: []
      }
      exam_submissions: {
        Row: {
          created_at: string
          id: string
          image_paths: string[]
          page_count: number
          paper_title: string | null
          result: Json | null
          score: number | null
          total_marks: number | null
          unit: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_paths?: string[]
          page_count?: number
          paper_title?: string | null
          result?: Json | null
          score?: number | null
          total_marks?: number | null
          unit: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_paths?: string[]
          page_count?: number
          paper_title?: string | null
          result?: Json | null
          score?: number | null
          total_marks?: number | null
          unit?: number
          user_id?: string
        }
        Relationships: []
      }
      payment_settings: {
        Row: {
          account_name: string | null
          contact: string | null
          id: number
          kpay: string | null
          packages: Json
          updated_at: string
          wavepay: string | null
        }
        Insert: {
          account_name?: string | null
          contact?: string | null
          id?: number
          kpay?: string | null
          packages?: Json
          updated_at?: string
          wavepay?: string | null
        }
        Update: {
          account_name?: string | null
          contact?: string | null
          id?: number
          kpay?: string | null
          packages?: Json
          updated_at?: string
          wavepay?: string | null
        }
        Relationships: []
      }
      practice_attempts: {
        Row: {
          answer: string
          correct: boolean
          id: string
          question_key: string
          skill: string
          unit: number
          updated_at: string
          user_id: string
        }
        Insert: {
          answer?: string
          correct?: boolean
          id?: string
          question_key: string
          skill: string
          unit: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          answer?: string
          correct?: boolean
          id?: string
          question_key?: string
          skill?: string
          unit?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_seen_at: string
          status: string
          suspended_until: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          last_seen_at?: string
          status?: string
          suspended_until?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_seen_at?: string
          status?: string
          suspended_until?: string | null
        }
        Relationships: []
      }
      teacher_requests: {
        Row: {
          created_at: string
          id: string
          note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          school: string
          status: string
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school: string
          status?: string
          subject: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school?: string
          status?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      topup_requests: {
        Row: {
          created_at: string
          credits: number
          id: string
          method: string
          price: number
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          txn_ref: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits: number
          id?: string
          method?: string
          price: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          txn_ref: string
          user_id?: string
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          method?: string
          price?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          txn_ref?: string
          user_id?: string
        }
        Relationships: []
      }
      tutor_chats: {
        Row: {
          created_at: string
          id: string
          messages: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tutor_usage: {
        Row: {
          day: string
          used: number
          user_id: string
        }
        Insert: {
          day: string
          used?: number
          user_id: string
        }
        Update: {
          day?: string
          used?: number
          user_id?: string
        }
        Relationships: []
      }
      tutor_wallets: {
        Row: {
          bonus_left: number
          scholarship: string
          scholarship_note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bonus_left?: number
          scholarship?: string
          scholarship_note?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bonus_left?: number
          scholarship?: string
          scholarship_note?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_review_teacher: {
        Args: { _approve: boolean; _id: string }
        Returns: undefined
      }
      admin_review_topup: {
        Args: { _approve: boolean; _id: string }
        Returns: undefined
      }
      admin_tutor_update: {
        Args: { _add_bonus: number; _scholarship: string; _user: string }
        Returns: undefined
      }
      class_exam_grade: {
        Args: {
          _attempt: string
          _feedback: string
          _result: Json
          _score: number
          _total: number
        }
        Returns: undefined
      }
      class_exam_open: { Args: { _aid: string }; Returns: Json }
      class_exam_roster: {
        Args: { _aid: string }
        Returns: {
          attempt_id: string
          display_name: string
          graded_at: string
          image_paths: string[]
          result: Json
          score: number
          started_at: string
          student_id: string
          submitted_at: string
          teacher_feedback: string
          total_marks: number
        }[]
      }
      class_exam_submit: {
        Args: { _aid: string; _paths: string[] }
        Returns: undefined
      }
      classroom_roster: {
        Args: { _cid: string }
        Returns: {
          avatar_url: string
          email: string
          full_name: string
          joined_at: string
          student_id: string
        }[]
      }
      classroom_roster_named: {
        Args: { _cid: string }
        Returns: {
          display_name: string
          email: string
          full_name: string
          joined_at: string
          student_id: string
        }[]
      }
      consume_tutor_message: { Args: never; Returns: Json }
      create_classroom: {
        Args: { _name: string; _subject: string }
        Returns: {
          code: string
          created_at: string
          id: string
          name: string
          subject: string
          teacher_id: string
        }
        SetofOptions: {
          from: "*"
          to: "classrooms"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      exam_quota: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_class_member: { Args: { _cid: string }; Returns: boolean }
      is_class_teacher: { Args: { _cid: string }; Returns: boolean }
      is_main_admin: { Args: { _user_id: string }; Returns: boolean }
      join_classroom: { Args: { _code: string }; Returns: string }
      join_classroom_named: {
        Args: { _code: string; _name: string }
        Returns: string
      }
      mm_today: { Args: never; Returns: string }
      my_access: { Args: never; Returns: Json }
      my_classes: {
        Args: never
        Returns: {
          code: string
          id: string
          joined_at: string
          name: string
          subject: string
          teacher_name: string
        }[]
      }
      my_name: { Args: never; Returns: string }
      record_exam_generation: {
        Args: { _paper: Json; _unit: number }
        Returns: Json
      }
      request_scholarship: { Args: { _note: string }; Returns: undefined }
      request_teacher_role: {
        Args: { _note: string; _school: string; _subject: string }
        Returns: undefined
      }
      set_member_name: {
        Args: { _cid: string; _name: string; _sid: string }
        Returns: undefined
      }
      set_my_name: { Args: { _name: string }; Returns: undefined }
      strip_answers: { Args: { j: Json }; Returns: Json }
      tutor_quota: { Args: never; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "student" | "teacher"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "student", "teacher"],
    },
  },
} as const
