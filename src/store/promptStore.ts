import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { withAuthRetry } from '../lib/withAuthRetry';
import { useAuthStore } from '../store/authStore';
import type { Prompt, Niche, Area, PromptType } from '../types';

interface PromptState {
  prompts: Prompt[];
  popularPrompts: Prompt[];
  favorites: Prompt[];
  niches: Niche[];
  areas: Area[];
  promptTypes: PromptType[];
  loadingPrompts: boolean;
  loadingFavorites: boolean;
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
  loadingPrompts: false,
  loadingFavorites: false,
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
    set({ loadingPrompts: true });
    try {
      const { data, error } = await withAuthRetry(() => 
        supabase
          .from('prompts')
          .select(`
            *,
            niches:niche_id(*),
            areas:area_id(*),
            prompt_types:type_id(*)
          `)
      );

      if (error) throw error;
      set({ prompts: data || [] });
    } finally {
      set({ loadingPrompts: false });
    }
  },

  fetchPopularPrompts: async () => {
    try {
      const { data, error } = await withAuthRetry(() =>
        supabase
          .from('prompts')
          .select(`
            *,
            niches:niche_id(*),
            areas:area_id(*),
            prompt_types:type_id(*)
          `)
          .limit(4)
      );

      if (error) throw error;
      set({ popularPrompts: data || [] });
    } catch (error) {
      console.error('Error fetching popular prompts:', error);
      set({ popularPrompts: [] });
    }
  },

  fetchFavorites: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ favorites: [] });
      return;
    }

    set({ loadingFavorites: true });
    try {
      const { data, error } = await withAuthRetry(() =>
        supabase
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
          .eq('user_id', user.id)
      );

      if (error) throw error;

      const favorites = data
        ?.filter(item => item.prompts)
        .map(item => ({
          ...(item.prompts as Prompt),
          favorite: true
        })) || [];

      set({ favorites });
    } finally {
      set({ loadingFavorites: false });
    }
  },

  fetchNiches: async () => {
    try {
      const { data, error } = await withAuthRetry(() =>
        supabase.from('niches').select('*')
      );
      if (error) throw error;
      set({ niches: data || [] });
    } catch (error) {
      console.error('Error fetching niches:', error);
      set({ niches: [] });
    }
  },

  fetchAreas: async () => {
    try {
      const { data, error } = await withAuthRetry(() =>
        supabase.from('areas').select('*')
      );
      if (error) throw error;
      set({ areas: data || [] });
    } catch (error) {
      console.error('Error fetching areas:', error);
      set({ areas: [] });
    }
  },

  fetchPromptTypes: async () => {
    try {
      const { data, error } = await withAuthRetry(() =>
        supabase.from('prompt_types').select('*')
      );
      if (error) throw error;
      set({ promptTypes: data || [] });
    } catch (error) {
      console.error('Error fetching prompt types:', error);
      set({ promptTypes: [] });
    }
  },

  toggleFavorite: async (promptId, userId) => {
    try {
      // Check if already favorited
      const { data: existing, error: checkError } = await withAuthRetry(() =>
        supabase
          .from('favorites')
          .select('*')
          .eq('user_id', userId)
          .eq('prompt_id', promptId)
          .maybeSingle()
      );

      if (checkError) throw checkError;

      if (existing) {
        // Remove favorite
        const { error: deleteError } = await withAuthRetry(() =>
          supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('prompt_id', promptId)
        );

        if (deleteError) throw deleteError;
      } else {
        // Add favorite
        const { error: insertError } = await withAuthRetry(() =>
          supabase
            .from('favorites')
            .insert([{ user_id: userId, prompt_id: promptId }])
        );

        if (insertError) throw insertError;
      }

      // Update local state
      set(state => ({
        prompts: state.prompts.map(p =>
          p.id === promptId ? { ...p, favorite: !existing } : p
        )
      }));

      // Refresh favorites
      await get().fetchFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  ratePrompt: async (promptId, userId, rating) => {
    try {
      const { data: existing, error: checkError } = await withAuthRetry(() =>
        supabase
          .from('ratings')
          .select('*')
          .eq('user_id', userId)
          .eq('prompt_id', promptId)
          .maybeSingle()
      );

      if (checkError) throw checkError;

      if (existing) {
        const { error: updateError } = await withAuthRetry(() =>
          supabase
            .from('ratings')
            .update({ rating })
            .eq('id', existing.id)
        );

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await withAuthRetry(() =>
          supabase
            .from('ratings')
            .insert([{ user_id: userId, prompt_id: promptId, rating }])
        );

        if (insertError) throw insertError;
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
      throw error;
    }
  },

  setSelectedNiche: (nicheId) => set({ selectedNiche: nicheId }),
  setSelectedArea: (areaId) => set({ selectedArea: areaId }),
  setSelectedType: (typeId) => set({ selectedType: typeId }),

  getFilteredPrompts: () => {
    const { prompts, selectedNiche, selectedArea, selectedType } = get();
    return prompts.filter(prompt => {
      const matchesNiche = !selectedNiche || prompt.niche_id === selectedNiche;
      const matchesArea = !selectedArea || prompt.area_id === selectedArea;
      const matchesType = !selectedType || prompt.type_id === selectedType;
      return matchesNiche && matchesArea && matchesType;
    });
  }
}));