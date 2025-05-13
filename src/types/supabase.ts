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
      profiles: {
        Row: {
          id: string
          full_name: string
          company_name: string
          company_description: string
          brand_voice: string
          niche_id: string | null
          created_at: string
          updated_at: string
          avatar_url: string | null
          completed_onboarding: boolean
        }
        Insert: {
          id: string
          full_name: string
          company_name?: string
          company_description?: string
          brand_voice?: string
          niche_id?: string | null
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          completed_onboarding?: boolean
        }
        Update: {
          id?: string
          full_name?: string
          company_name?: string
          company_description?: string
          brand_voice?: string
          niche_id?: string | null
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          completed_onboarding?: boolean
        }
      }
      niches: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          created_at?: string
        }
      }
      areas: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      prompt_types: {
        Row: {
          id: string
          name: string
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          created_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          image_url: string
          niche_id: string | null
          area_id: string | null
          type_id: string | null
          has_custom_fields: boolean
          custom_fields: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          image_url: string
          niche_id?: string | null
          area_id?: string | null
          type_id?: string | null
          has_custom_fields?: boolean
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          image_url?: string
          niche_id?: string | null
          area_id?: string | null
          type_id?: string | null
          has_custom_fields?: boolean
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          created_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          rating: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          rating?: number
          created_at?: string
        }
      }
    }
  }
}