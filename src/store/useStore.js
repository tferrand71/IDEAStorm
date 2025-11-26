import { create } from "zustand";
import supabase from "../lib/supabaseClient";

const useStore = create((set, get) => ({
    // -----------------------------
    //          USER
    // -----------------------------
    user: null,
    gameState: null,

    // -----------------------------
    //          STATS LOCALES & BOUTIQUE
    // -----------------------------
    score: 0,
    perClick: 1,
    perSecond: 0,
    activeMedia: [],

    // Coûts initiaux (Boutique)
    clickUpgradeCost: 50,
    autoUpgradeCost: 100,
    catUpgradeCost: 250,
    cat2UpgradeCost: 1000,
    cat3UpgradeCost: 10000,
    volcanCost: 5000,

    // États d'achat (Boutique)
    catBought: false,
    cat2Bought: false,
    cat3Bought: false,
    volcanBought: false,

    // -----------------------------
    //          FONCTIONS BASIQUES
    // -----------------------------
    // Fonction requise par votre Login (Celle qui manquait !)
    setGameState: (newState) => {
        set(newState);
    },

    setActiveMedia: (media) => set({ activeMedia: media }),

    setUser: async (user) => {
        set({ user });
        if (user) {
            const { data, error } = await supabase
                .from("game_state")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (error && error.code === "PGRST116") {
                // Créer une nouvelle partie si inexistante
                const { data: newGame, error: insertError } = await supabase
                    .from("game_state")
                    .insert({ user_id: user.id })
                    .single();

                if (insertError) console.error("Erreur insert:", insertError);
                else set({
                    gameState: newGame,
                    score: newGame.score,
                    perClick: newGame.per_click,
                    perSecond: newGame.per_second,
                    // Mapping pour le shop
                    clickUpgradeCost: newGame.click_upgrade_cost,
                    autoUpgradeCost: newGame.auto_upgrade_cost,
                    catUpgradeCost: newGame.cat_upgrade_cost,
                    cat2UpgradeCost: newGame.cat2_upgrade_cost,
                    cat3UpgradeCost: newGame.cat3_upgrade_cost,
                    volcanCost: newGame.volcan_cost,
                    catBought: newGame.cat_bought,
                    cat2Bought: newGame.cat2_bought,
                    cat3Bought: newGame.cat3_bought,
                    volcanBought: newGame.volcan_bought,
                    activeMedia: newGame.active_media,
                });
            } else if (data) {
                // Charger la partie existante
                set({
                    gameState: data,
                    score: data.score,
                    perClick: data.per_click,
                    perSecond: data.per_second,
                    // Mapping pour le shop
                    clickUpgradeCost: data.click_upgrade_cost,
                    autoUpgradeCost: data.auto_upgrade_cost,
                    catUpgradeCost: data.cat_upgrade_cost,
                    cat2UpgradeCost: data.cat2_upgrade_cost,
                    cat3UpgradeCost: data.cat3_upgrade_cost,
                    volcanCost: data.volcan_cost,
                    catBought: data.cat_bought,
                    cat2Bought: data.cat2_bought,
                    cat3Bought: data.cat3_bought,
                    volcanBought: data.volcan_bought,
                    activeMedia: data.active_media,
                });
            }
        } else {
            set({ user: null, gameState: null, score: 0 });
        }
    },

    // -----------------------------
    //          ACTIONS JEU
    // -----------------------------
    addScore: async (value) => {
        const { user, gameState, score } = get();
        if (!user || !gameState) return;
        const newScore = score + value;
        set({ score: newScore });
        await supabase.from("game_state").update({ score: newScore }).eq("id", gameState.id);
    },

    addPerClick: async (value) => {
        const { user, gameState, perClick } = get();
        if (!user || !gameState) return;
        const newPerClick = perClick + value;
        set({ perClick: newPerClick });
        await supabase.from("game_state").update({ per_click: newPerClick }).eq("id", gameState.id);
    },

    addPerSecond: async () => {
        const { user, gameState, perSecond, score } = get();
        if (!user || !gameState || perSecond === 0) return;
        const newScore = score + perSecond;
        set({ score: newScore });
        // Mise à jour DB (peut être optimisée pour être moins fréquente)
        await supabase.from("game_state").update({ score: newScore }).eq("id", gameState.id);
    },

    // -----------------------------
    //          ACTIONS SHOP
    // -----------------------------
    buyClickUpgrade: async () => {
        const { score, perClick, clickUpgradeCost, gameState } = get();
        if (score >= clickUpgradeCost) {
            const newScore = score - clickUpgradeCost;
            const newPerClick = perClick + 1;
            const newCost = Math.floor(clickUpgradeCost * 1.5);
            set({ score: newScore, perClick: newPerClick, clickUpgradeCost: newCost });
            await supabase.from("game_state").update({ score: newScore, per_click: newPerClick, click_upgrade_cost: newCost }).eq("id", gameState.id);
        }
    },

    buyAutoUpgrade: async () => {
        const { score, perSecond, autoUpgradeCost, gameState } = get();
        if (score >= autoUpgradeCost) {
            const newScore = score - autoUpgradeCost;
            const newPerSecond = perSecond + 2;
            const newCost = Math.floor(autoUpgradeCost * 1.5);
            set({ score: newScore, perSecond: newPerSecond, autoUpgradeCost: newCost });
            await supabase.from("game_state").update({ score: newScore, per_second: newPerSecond, auto_upgrade_cost: newCost }).eq("id", gameState.id);
        }
    },

    buyCatUpgrade: async () => {
        const { score, perSecond, catUpgradeCost, gameState } = get();
        if (score >= catUpgradeCost) {
            const newScore = score - catUpgradeCost;
            const newPerSecond = perSecond + 10;
            set({ score: newScore, perSecond: newPerSecond, catBought: true });
            await supabase.from("game_state").update({ score: newScore, per_second: newPerSecond, cat_bought: true }).eq("id", gameState.id);
        }
    },

    buyCat2Upgrade: async () => {
        const { score, perSecond, cat2UpgradeCost, gameState } = get();
        if (score >= cat2UpgradeCost) {
            const newScore = score - cat2UpgradeCost;
            const newPerSecond = perSecond + 50;
            set({ score: newScore, perSecond: newPerSecond, cat2Bought: true });
            await supabase.from("game_state").update({ score: newScore, per_second: newPerSecond, cat2_bought: true }).eq("id", gameState.id);
        }
    },

    buyCat3Upgrade: async () => {
        const { score, perSecond, cat3UpgradeCost, gameState } = get();
        if (score >= cat3UpgradeCost) {
            const newScore = score - cat3UpgradeCost;
            const newPerSecond = perSecond + 10000;
            set({ score: newScore, perSecond: newPerSecond, cat3Bought: true });
            await supabase.from("game_state").update({ score: newScore, per_second: newPerSecond, cat3_bought: true }).eq("id", gameState.id);
        }
    },

    buyVolcan: async () => {
        const { score, perSecond, volcanCost, gameState } = get();
        if (score >= volcanCost) {
            const newScore = score - volcanCost;
            const newPerSecond = perSecond + 30; // Simplification: ajout au par seconde
            set({ score: newScore, perSecond: newPerSecond, volcanBought: true });
            await supabase.from("game_state").update({ score: newScore, per_second: newPerSecond, volcan_bought: true }).eq("id", gameState.id);
        }
    },

    // -----------------------------
    //          RESET
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
            clickUpgradeCost: 50,
            autoUpgradeCost: 100,
            catUpgradeCost: 250,
            cat2UpgradeCost: 1000,
            cat3UpgradeCost: 10000,
            volcanCost: 5000,
            catBought: false,
            cat2Bought: false,
            cat3Bought: false,
            volcanBought: false,
            activeMedia: [],
        });

        await supabase.from("game_state").update(initialState).eq("id", gameState.id);
    },
}));

export default useStore;