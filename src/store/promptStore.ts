import { create } from 'zustand';
import { supabase } from '../lib/supabase';
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
    console.log('Refreshing all data...');
    const { fetchPrompts, fetchFavorites } = get();
    try {
      await Promise.all([
        fetchPrompts(),
        fetchFavorites()
      ]);
      console.log('Data refresh completed');
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw error; // Re-throw to allow handling by the caller
    }
  },

  fetchPrompts: async () => {
    set({ isLoading: true });
    try {
      console.log('Fetching prompts...');
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
      console.log('Prompts fetched successfully:', data?.length);
      set({ prompts: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching prompts:', error);
      set({ prompts: [], isLoading: false });
      throw error;
    }
  },

  fetchPopularPrompts: async () => {
    try {
      console.log('Fetching popular prompts...');
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
      console.log('Popular prompts fetched successfully:', data?.length);
      set({ popularPrompts: data || [] });
    } catch (error) {
      console.error('Error fetching popular prompts:', error);
      set({ popularPrompts: [] });
      throw error;
    }
  },

  fetchFavorites: async () => {
    set({ isLoading: true });
    
    try {
      const { user, isAuthenticated } = useAuthStore.getState();
      
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, skipping favorites fetch');
        set({ favorites: [], isLoading: false });
        return;
      }

      console.log('Fetching favorites for user:', user.id);
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
        .eq('user_id', user.id);

      if (error) throw error;
      
      const favorites = data
        .filter(item => item.prompts)
        .map(item => ({
          ...(item.prompts as Prompt),
          favorite: true
        }));
      
      console.log('Favorites fetched successfully:', favorites.length);
      set({ favorites, isLoading: false });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      set({ favorites: [], isLoading: false });
      throw error;
    }
  },

  fetchNiches: async () => {
    try {
      console.log('Fetching niches...');
      const { data, error } = await supabase
        .from('niches')
        .select('*');

      if (error) throw error;
      console.log('Niches fetched successfully:', data?.length);
      set({ niches: data || [] });
    } catch (error) {
      console.error('Error fetching niches:', error);
      set({ niches: [] });
      throw error;
    }
  },

  fetchAreas: async () => {
    try {
      console.log('Fetching areas...');
      const { data, error } = await supabase
        .from('areas')
        .select('*');

      if (error) throw error;
      console.log('Areas fetched successfully:', data?.length);
      set({ areas: data || [] });
    } catch (error) {
      console.error('Error fetching areas:', error);
      set({ areas: [] });
      throw error;
    }
  },

  fetchPromptTypes: async () => {
    try {
      console.log('Fetching prompt types...');
      const { data, error } = await supabase
        .from('prompt_types')
        .select('*');

      if (error) throw error;
      console.log('Prompt types fetched successfully:', data?.length);
      set({ promptTypes: data || [] });
    } catch (error) {
      console.error('Error fetching prompt types:', error);
      set({ promptTypes: [] });
      throw error;
    }
  },

  toggleFavorite: async (promptId, userId) => {
    try {
      console.log('Toggling favorite for prompt:', promptId);
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
        console.log('Favorite removed successfully');
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
        console.log('Favorite added successfully');
      }

      await get().fetchFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  ratePrompt: async (promptId, userId, rating) => {
    try {
      console.log('Rating prompt:', promptId, rating);
      const { data: existingRating, error: checkError } = await supabase
        .from('ratings')
        .select('*')
        .eq('user_id', userId)
        .eq('prompt_id', promptId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingRating) {
        const { error } = await supabase
          .from('ratings')
          .update({ rating })
          .eq('id', existingRating.id);

        if (error) throw error;
        console.log('Rating updated successfully');
      } else {
        const { error } = await supabase
          .from('ratings')
          .insert([{ user_id: userId, prompt_id: promptId, rating }]);

        if (error) throw error;
        console.log('Rating added successfully');
      }

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
      throw error;
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