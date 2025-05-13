export interface UserProfile {
  id: string;
  full_name: string;
  company_name: string;
  company_description: string;
  brand_voice: string;
  niche_id: string | null;
  avatar_url: string | null;
  completed_onboarding: boolean;
  subscription_status: 'free' | 'premium';
}

export interface Niche {
  id: string;
  name: string;
  color: string;
  display_name: string;
  description: string;
  image_url: string;
}

export interface Area {
  id: string;
  name: string;
  color: string;
}

export interface PromptType {
  id: string;
  name: string;
  icon: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  niche_id: string | null;
  area_id: string | null;
  type_id: string | null;
  has_custom_fields: boolean;
  custom_fields: CustomField[] | null;
  is_premium: boolean;
  favorite?: boolean;
  rating?: number;
  averageRating?: number;
  areas?: {
    id: string;
    name: string;
    color: string;
  };
  prompt_types?: {
    id: string;
    name: string;
    icon: string;
  };
}

export interface CustomField {
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
}

export interface OnboardingFormData {
  full_name: string;
  company_name: string;
  company_description: string;
  brand_voice: string;
  niche_id: string | null;
}