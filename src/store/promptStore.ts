import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { withAuthRetry } from '../lib/withAuthRetry';
import { useAuthStore } from './authStore';
import type { Prompt, Niche, Area, PromptType } from '../types';

/**
 * Zustand store responsável por manter prompts, favoritos e metadados.
 * Todas as queries passam por `withAuthRetry`, que tenta `refreshSession()`
 * e repete a chamada quando captura erro 401. Se o refresh falhar, o usuário
 * é deslogado de forma centralizada.
 */

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

  refreshData: () => Promise<void>;

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
  loadingPrompts: false,
  loadingFavorites: false,

  selectedNiche: null,
  selectedArea: null,
  selectedType: null,

  /**
   * Atualiza prompts e favoritos em paralelo.
   * Caso qualquer chamada falhe, o erro é propagado
   * para que o componente pai possa exibir feedback.
   */
  refreshData: async () => {
    const { fetchPrompts, fetchFavorites } = get();
    await Promise.all([fetchPrompts(), fetchFavorites()]);
  },

  /** PROMPTS PRINCIPAIS **/
  fetchPrompts: async () => {
    set({ loadingPrompts: true });
    try {
      const { profile } = useAuthStore.getState();
      const query = supabase
        .from('prompts')
        .select(`*, niches:niche_id(*), areas:area_id(*), prompt_types:type_id(*)`);

      if (profile?.niche_id) {
        query.eq('niche_id', profile.niche_id);
      }

      const { data, error } = await withAuthRetry(() => query);
      if (error) throw error;
      set({ prompts: data ?? [] });
    } finally {
      set({ loadingPrompts: false });
    }
  },

  fetchPopularPrompts: async () => {
    const { data, error } = await withAuthRetry(() =>
      supabase
        .from('prompts')
        .select(`*, niches:niche_id(*), areas:area_id(*), prompt_types:type_id(*)`)
        .limit(4)
    );
    if (error) throw error;
    set({ popularPrompts: data ?? [] });
  },

  /** FAVORITOS **/
  fetchFavorites: async () => {
    const { user, isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated || !user) {
      set({ favorites: [] });
      return;
    }

    set({ loadingFavorites: true });
    try {
      const { data, error } = await withAuthRetry(() =>
        supabase
          .from('favorites')
          .select(`prompt_id, prompts(*, niches:niche_id(*), areas:area_id(*), prompt_types:type_id(*))`)
          .eq('user_id', user.id)
      );

      if (error) throw error;

      const favorites = (data ?? [])
        .filter((item) => item.prompts)
        .map((item) => ({ ...(item.prompts as Prompt), favorite: true }));

      set({ favorites });
    } finally {
      set({ loadingFavorites: false });
    }
  },

  /** METADADOS (NICHOS / ÁREAS / TIPOS) **/
  fetchNiches: async () => {
    const { data, error } = await withAuthRetry(() => supabase.from('niches').select('*'));
    if (error) throw error;
    set({ niches: data ?? [] });
  },

  fetchAreas: async () => {
    const { data, error } = await withAuthRetry(() => supabase.from('areas').select('*'));
    if (error) throw error;
    set({ areas: data ?? [] });
  },

  fetchPromptTypes: async () => {
    const { data, error } = await withAuthRetry(() => supabase.from('prompt_types').select('*'));
    if (error) throw error;
    set({ promptTypes: data ?? [] });
  },

  /** FAVORITAR / DESFAVORITAR **/
  toggleFavorite: async (promptId, userId) => {
    // verifica se já existe
    const { data: existingFav, error: checkErr } = await withAuthRetry(() =>
      supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('prompt_id', promptId)
        .maybeSingle()
    );
    if (checkErr) throw checkErr;

    if (existingFav) {
      await withAuthRetry(() =>
        supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('prompt_id', promptId)
      );
    } else {
      await withAuthRetry(() =>
        supabase.from('favorites').insert([{ user_id: userId, prompt_id: promptId }])
      );
    }

    // refetch favoritos e atualiza prompts
    await get().fetchFavorites();
    set((state) => ({
      prompts: state.prompts.map((p) =>
        p.id === promptId ? { ...p, favorite: !existingFav } : p
      ),
    }));
  },

  /** AVALIAÇÃO **/
  ratePrompt: async (promptId, userId, rating) => {
    const { data: existing, error: check } = await withAuthRetry(() =>
      supabase
        .from('ratings')
        .select('*')
        .eq('user_id', userId)
        .eq('prompt_id', promptId)
        .maybeSingle()
    );
    if (check) throw check;

    if (existing) {
      await withAuthRetry(() =>
        supabase.from('ratings').update({ rating }).eq('id', existing.id)
      );
    } else {
      await withAuthRetry(() =>
        supabase.from('ratings').insert([{ user_id: userId, prompt_id: promptId, rating }])
      );
    }

    set((state) => ({
      prompts: state.prompts.map((p) => (p.id === promptId ? { ...p, rating } : p)),
      favorites: state.favorites.map((p) => (p.id === promptId ? { ...p, rating } : p)),
    }));
  },

  /** SELETORES **/
  setSelectedNiche: (nicheId) => set({ selectedNiche: nicheId }),
  setSelectedArea: (areaId) => set({ selectedArea: areaId }),
  setSelectedType: (typeId) => set({ selectedType: typeId }),

  /** Retorna prompts filtrados pelos valores selecionados */
  getFilteredPrompts: () => {
    const { prompts, selectedNiche, selectedArea, selectedType } = get();
    return prompts.filter((p) => {
      const matchesNiche = !selectedNiche || p.niche_id === selectedNiche;
      const matchesArea = !selectedArea || p.area_id === selectedArea;
      const matchesType = !selectedType || p.type_id === selectedType;
      return matchesNiche && matchesArea && matchesType;
    });
  },
}));
