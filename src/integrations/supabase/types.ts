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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      metricas_aprendizado: {
        Row: {
          id: string
          melhor_grupo: number | null
          melhor_horario: string | null
          melhor_metodo: string | null
          taxa_acerto: number
          total_acertos: number
          total_previsoes: number
          ultima_atualizacao: string
        }
        Insert: {
          id?: string
          melhor_grupo?: number | null
          melhor_horario?: string | null
          melhor_metodo?: string | null
          taxa_acerto?: number
          total_acertos?: number
          total_previsoes?: number
          ultima_atualizacao?: string
        }
        Update: {
          id?: string
          melhor_grupo?: number | null
          melhor_horario?: string | null
          melhor_metodo?: string | null
          taxa_acerto?: number
          total_acertos?: number
          total_previsoes?: number
          ultima_atualizacao?: string
        }
        Relationships: []
      }
      padroes_aprendidos: {
        Row: {
          contexto: Json | null
          created_at: string
          frequencia: number
          id: string
          peso: number
          taxa_acerto: number | null
          tipo: string
          ultima_ocorrencia: string | null
          updated_at: string
          valor: string
        }
        Insert: {
          contexto?: Json | null
          created_at?: string
          frequencia?: number
          id?: string
          peso?: number
          taxa_acerto?: number | null
          tipo: string
          ultima_ocorrencia?: string | null
          updated_at?: string
          valor: string
        }
        Update: {
          contexto?: Json | null
          created_at?: string
          frequencia?: number
          id?: string
          peso?: number
          taxa_acerto?: number | null
          tipo?: string
          ultima_ocorrencia?: string | null
          updated_at?: string
          valor?: string
        }
        Relationships: []
      }
      previsoes_quanticas: {
        Row: {
          acertou: boolean | null
          confianca: number
          created_at: string
          data_previsao: string
          explicacao_ia: string | null
          grupos: number[]
          horario: string
          id: string
          metodos_usados: string[]
          numero_acertado: string | null
          numeros: string[]
        }
        Insert: {
          acertou?: boolean | null
          confianca: number
          created_at?: string
          data_previsao: string
          explicacao_ia?: string | null
          grupos: number[]
          horario: string
          id?: string
          metodos_usados: string[]
          numero_acertado?: string | null
          numeros: string[]
        }
        Update: {
          acertou?: boolean | null
          confianca?: number
          created_at?: string
          data_previsao?: string
          explicacao_ia?: string | null
          grupos?: number[]
          horario?: string
          id?: string
          metodos_usados?: string[]
          numero_acertado?: string | null
          numeros?: string[]
        }
        Relationships: []
      }
      resultados_historicos: {
        Row: {
          animal: string
          created_at: string
          data: string
          dezena: string
          grupo: number
          horario: string
          id: string
          milhar: string
          premio: number
        }
        Insert: {
          animal: string
          created_at?: string
          data: string
          dezena: string
          grupo: number
          horario: string
          id?: string
          milhar: string
          premio: number
        }
        Update: {
          animal?: string
          created_at?: string
          data?: string
          dezena?: string
          grupo?: number
          horario?: string
          id?: string
          milhar?: string
          premio?: number
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
