import { create } from "zustand";
import supabase from "../lib/supabaseClient";

const useStore = create((set, get) => ({
    // -----------------------------
    //          USER
    // -----------------------------
    user: null,
    gameState: null,

    // -----------------------------
    //          STATS LOCALES
    // -----------------------------
    score: 0,
    perClick: 1,
    perSecond: 0,
    activeMedia: [],

    // -----------------------------
    //          FONCTIONS USER
    // -----------------------------
    setUser: async (user) => {
        set({ user });
        if (user) {
            // Récupérer le game_state de l'utilisateur
            const { data, error } = await supabase
                .from("game_state")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (error && error.code === "PGRST116") {
                // Pas de game_state existant, créer un nouveau
                const { data: newGame, error: insertError } = await supabase
                    .from("game_state")
                    .insert({ user_id: user.id })
                    .single();
                if (insertError) console.error("Erreur insert game_state:", insertError);
                else set({
                    gameState: newGame,
                    score: newGame.score,
                    perClick: newGame.per_click,
                    perSecond: newGame.per_second,
                    activeMedia: newGame.active_media,
                });
            } else if (data) {
                set({
                    gameState: data,
                    score: data.score,
                    perClick: data.per_click,
                    perSecond: data.per_second,
                    activeMedia: data.active_media,
                });
            }
        } else {
            set({ gameState: null, score: 0, perClick: 1, perSecond: 0, activeMedia: [] });
        }
    },

    // -----------------------------
    //          STATS UPDATE
    // -----------------------------
    addScore: async (value) => {
        const { user, gameState } = get();
        if (!user || !gameState) return;

        const newScore = get().score + value;
        set({ score: newScore });

        // Mise à jour côté Supabase
        const { error } = await supabase
            .from("game_state")
            .update({ score: newScore, updated_at: new Date() })
            .eq("id", gameState.id);
        if (error) console.error("Erreur update score:", error);
    },

    addPerClick: async (value) => {
        const { user, gameState } = get();
        if (!user || !gameState) return;

        const newPerClick = get().perClick + value;
        set({ perClick: newPerClick });

        const { error } = await supabase
            .from("game_state")
            .update({ per_click: newPerClick, updated_at: new Date() })
            .eq("id", gameState.id);
        if (error) console.error("Erreur update per_click:", error);
    },

    addPerSecond: async (value = 0) => {
        const { user, gameState, perSecond, score } = get();
        if (!user || !gameState) return;

        const newScore = score + perSecond + value;
        set({ score: newScore });

        const { error } = await supabase
            .from("game_state")
            .update({ score: newScore, updated_at: new Date() })
            .eq("id", gameState.id);
        if (error) console.error("Erreur update score perSecond:", error);
    },

    // -----------------------------
    //          RESET GAME
    // -----------------------------
    resetGame: async () => {
        const { user, gameState } = get();
        if (!user || !gameState) return;

        const initialState = {
            score: 0,
            per_click: 1,
            per_second: 0,
            click_upgrade_cost: 50,
            auto_upgrade_cost: 100,
            cat_upgrade_cost: 250,
            cat2_upgrade_cost: 1000,
            cat3_upgrade_cost: 10000,
            volcan_cost: 5000,
            cat_bought: false,
            cat2_bought: false,
            cat3_bought: false,
            volcan_bought: false,
            active_media: [],
        };

        set({
            score: 0,
            perClick: 1,
            perSecond: 0,
            activeMedia: [],
        });

        const { error } = await supabase
            .from("game_state")
            .update(initialState)
            .eq("id", gameState.id);
        if (error) console.error("Erreur reset game_state:", error);
    },
}));

export default useStore;
