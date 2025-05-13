export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      areas: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      niches: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          brand_voice: string
          company_description: string
          company_name: string
          completed_onboarding: boolean
          created_at: string
          full_name: string
          id: string
          niche_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          brand_voice?: string
          company_description?: string
          company_name?: string
          completed_onboarding?: boolean
          created_at?: string
          full_name: string
          id: string
          niche_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          brand_voice?: string
          company_description?: string
          company_name?: string
          completed_onboarding?: boolean
          created_at?: string
          full_name?: string
          id?: string
          niche_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          }
        ]
      }
      prompt_types: {
        Row: {
          created_at: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          area_id: string | null
          content: string
          created_at: string
          custom_fields: Json | null
          description: string
          has_custom_fields: boolean
          id: string
          image_url: string
          niche_id: string | null
          title: string
          type_id: string | null
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          content: string
          created_at?: string
          custom_fields?: Json | null
          description: string
          has_custom_fields?: boolean
          id?: string
          image_url: string
          niche_id?: string | null
          title: string
          type_id?: string | null
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          content?: string
          created_at?: string
          custom_fields?: Json | null
          description?: string
          has_custom_fields?: boolean
          id?: string
          image_url?: string
          niche_id?: string | null
          title?: string
          type_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompts_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "prompt_types"
            referencedColumns: ["id"]
          }
        ]
      }
      ratings: {
        Row: {
          created_at: string
          id: string
          prompt_id: string
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_id: string
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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