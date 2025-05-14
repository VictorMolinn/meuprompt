import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { withAuthRetry } from '../lib/supaWrap';
import type { Prompt, Niche, Area, PromptType } from '../types';

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
      
      // If user has a niche selected, filter prompts by it
      if (profile?.niche_id) {
        query.eq('niche_id', profile.niche_id);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      set({ prompts: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching prompts:', error);
      set({ isLoading: false });
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
    }
  },

  fetchFavorites: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          prompt_id,
          prompts(
            *,
            niches:niche_id(*),
            areas:area_id(*),
            prompt_types:type_id(*)
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Transform to match Prompt interface with favorite flag
      const favorites = data.map(item => ({
        ...(item.prompts as Prompt),
        favorite: true
      }));
      
      set({ favorites });
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  },

  fetchNiches: async () => {
    try {
      const { data, error } = await supabase
        .from('niches')
        .select('*');

      if (error) throw error;
      set({ niches: data || [] });
    } catch (error) {
      console.error('Error fetching niches:', error);
    }
  },

  fetchAreas: async () => {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*');

      if (error) throw error;
      set({ areas: data || [] });
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  },

  fetchPromptTypes: async () => {
    try {
      const { data, error } = await supabase
        .from('prompt_types')
        .select('*');

      if (error) throw error;
      set({ promptTypes: data || [] });
    } catch (error) {
      console.error('Error fetching prompt types:', error);
    }
  },

  toggleFavorite: async (promptId, userId) => {
    try {
      // Check if already a favorite using maybeSingle() instead of single()
      const { data: existingFav, error: checkError } = await withAuthRetry(() =>
        supabase
          .from('favorites')
          .select('*')
          .eq('user_id', userId)
          .eq('prompt_id', promptId)
          .maybeSingle()
      );

      if (checkError) {
        console.error('Error checking favorite:', checkError);
        return;
      }

      try {
        if (existingFav) {
          // Remove favorite
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('prompt_id', promptId);

          if (error) throw error;
          
          // Update local state
          set(state => ({
            favorites: state.favorites.filter(fav => fav.id !== promptId),
            prompts: state.prompts.map(p => 
              p.id === promptId ? { ...p, favorite: false } : p
            )
          }));
        } else {
          // Add favorite
          const { error } = await supabase
            .from('favorites')
            .insert([{ user_id: userId, prompt_id: promptId }]);

          if (error) throw error;
          
          // Update local state
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
      }
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
    }
  },

  ratePrompt: async (promptId, userId, rating) => {
    try {
      // Check if user already rated this prompt using maybeSingle()
      const { data: existingRating, error: checkError } = await withAuthRetry(() =>
        supabase
          .from('ratings')
          .select('*')
          .eq('user_id', userId)
          .eq('prompt_id', promptId)
          .maybeSingle()
      );

      if (checkError) {
        console.error('Error checking rating:', checkError);
        return;
      }

      if (existingRating) {
        // Update existing rating
        const { error } = await supabase
          .from('ratings')
          .update({ rating })
          .eq('id', existingRating.id);

        if (error) throw error;
      } else {
        // Add new rating
        const { error } = await supabase
          .from('ratings')
          .insert([{ user_id: userId, prompt_id: promptId, rating }]);

        if (error) throw error;
      }

      // Update local state
      set(state => ({
        prompts: state.prompts.map(p => 
          p.id === promptId ? { ...p, rating } : p
        ),
        favorites: state.favorites.map(p => 
          p.id === promptId ? { ...p, rating } : p
        )
      }));
    } catch (error) {
      console.error('Error rating prompt:', error);
    }
  },

  setSelectedNiche: (nicheId) => {
    set({ selectedNiche: nicheId });
  },

  setSelectedArea: (areaId) => {
    set({ selectedArea: areaId });
  },

  setSelectedType: (typeId) => {
    set({ selectedType: typeId });
  },

  getFilteredPrompts: () => {
    const { prompts, selectedNiche, selectedArea, selectedType } = get();
    
    return prompts.filter(prompt => {
      const matchesArea = !selectedArea || prompt.area_id === selectedArea;
      const matchesType = !selectedType || prompt.type_id === selectedType;
      
      return matchesArea && matchesType;
    });
  }
}));

// Circular import, so import it here
import { useAuthStore } from './authStore';