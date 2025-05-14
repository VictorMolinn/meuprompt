import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Prompt, Niche, Area, PromptType } from '../types';
import { useAuthStore } from './authStore';

interface PromptState {
  prompts: Prompt[];
  popularPrompts: Prompt[];
  favorites: Prompt[];
  niches: Niche[];
  areas: Area[];
  promptTypes: PromptType[];
  isLoading: boolean;
  selectedNiche: string | null;
  selectedArea: string | null;
  selectedType: string | null;
  
  fetchPrompts: () => Promise<void>;
  fetchPopularPrompts: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
  fetchNiches: () => Promise<void>;
  fetchAreas: () => Promise<void>;
  fetchPromptTypes: () => Promise<void>;
  toggleFavorite: (promptId: string, userId: string) => Promise<void>;
  ratePrompt: (promptId: string, userId: string, rating: number) => Promise<void>;
  setSelectedNiche: (nicheId: string | null) => void;
  setSelectedArea: (areaId: string | null) => void;
  setSelectedType: (typeId: string | null) => void;
  getFilteredPrompts: () => Prompt[];
  refreshData: () => Promise<void>;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  prompts: [],
  popularPrompts: [],
  favorites: [],
  niches: [],
  areas: [],
  promptTypes: [],
  isLoading: false,
  selectedNiche: null,
  selectedArea: null,
  selectedType: null,

  refreshData: async () => {
    const { fetchPrompts, fetchFavorites } = get();
    await Promise.all([
      fetchPrompts(),
      fetchFavorites()
    ]);
  },

  fetchPrompts: async () => {
    set({ isLoading: true });
    try {
      const { profile } = useAuthStore.getState();
      const query = supabase
        .from('prompts')
        .select(`
          *,
          niches:niche_id(*),
          areas:area_id(*),
          prompt_types:type_id(*)
        `);
      
      if (profile?.niche_id) {
        query.eq('niche_id', profile.niche_id);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      set({ prompts: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching prompts:', error);
      set({ prompts: [], isLoading: false });
    }
  },

  fetchPopularPrompts: async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select(`
          *,
          niches:niche_id(*),
          areas:area_id(*),
          prompt_types:type_id(*)
        `)
        .limit(4);

      if (error) throw error;
      set({ popularPrompts: data || [] });
    } catch (error) {
      console.error('Error fetching popular prompts:', error);
      set({ popularPrompts: [] });
    }
  },

  fetchFavorites: async () => {
    set({ isLoading: true });
    
    try {
      const { user } = useAuthStore.getState();
      
      if (!user) {
        set({ favorites: [], isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          prompts:prompt_id (
            *,
            niches:niche_id(*),
            areas:area_id(*),
            prompt_types:type_id(*)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const favorites = data
        .map(item => ({
          ...item.prompts,
          favorite: true
        }))
        .filter(Boolean);
      
      set({ favorites, isLoading: false });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      set({ favorites: [], isLoading: false });
    }
  },

  toggleFavorite: async (promptId, userId) => {
    try {
      const { data: existingFav, error: checkError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('prompt_id', promptId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('prompt_id', promptId);

        if (error) throw error;
        
        set(state => ({
          favorites: state.favorites.filter(fav => fav.id !== promptId),
          prompts: state.prompts.map(p => 
            p.id === promptId ? { ...p, favorite: false } : p
          )
        }));
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: userId, prompt_id: promptId }]);

        if (error) throw error;
        
        const promptToAdd = get().prompts.find(p => p.id === promptId);
        if (promptToAdd) {
          set(state => ({
            favorites: [...state.favorites, { ...promptToAdd, favorite: true }],
            prompts: state.prompts.map(p => 
              p.id === promptId ? { ...p, favorite: true } : p
            )
          }));
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  // ... rest of the store implementation remains the same
}));