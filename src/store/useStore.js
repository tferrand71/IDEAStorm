import { create } from "zustand";
import supabase from "../lib/supabaseClient";

const useStore = create((set, get) => ({
    // -----------------------------
    //          SYSTEME
    // -----------------------------
    user: null,
    gameState: null,
    showMedia: true,

    // -----------------------------
    //          STATS JEU
    // -----------------------------
    score: 0,
    perClick: 1,
    perSecond: 0,
    activeMedia: [],

    // -----------------------------
    //          BOUTIQUE (Coûts)
    // -----------------------------
    clickUpgradeCost: 50,
    autoUpgradeCost: 100,
    catUpgradeCost: 250,
    cat2UpgradeCost: 1000,
    cat3UpgradeCost: 10000,
    volcanCost: 5000,

    // Clics Spéciaux
    superClickCost: 500000,
    superClickThreshold: 500000,

    // --- NOUVEAU : MEGA & GIGA ---
    megaClickCost: 5000000,       // 5 Millions
    megaClickThreshold: 2000000,  // Visible à 2M

    gigaClickCost: 20000000,      // 20 Millions
    gigaClickThreshold: 10000000, // Visible à 10M

    ultimateClickCost: 2500000,
    ultimateClickThreshold: 1000000,

    // -----------------------------
    //          BOUTIQUE (États)
    // -----------------------------
    catBought: false,
    cat2Bought: false,
    cat3Bought: false,
    volcanBought: false,

    // -----------------------------
    //          FONCTIONS
    // -----------------------------
    toggleMedia: () => set((state) => ({ showMedia: !state.showMedia })),
    setGameState: (newState) => { set(newState); },
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
                    activeMedia: newGame.active_media,
                });
            } else if (data) {
                set({
                    gameState: data,
                    score: data.score,
                    perClick: data.per_click,
                    perSecond: data.per_second,
                    activeMedia: data.active_media,
                    // Mapping DB
                    clickUpgradeCost: data.click_upgrade_cost || 50,
                    autoUpgradeCost: data.auto_upgrade_cost || 100,
                    catUpgradeCost: data.cat_upgrade_cost || 250,
                    cat2UpgradeCost: data.cat2_upgrade_cost || 1000,
                    cat3UpgradeCost: data.cat3_upgrade_cost || 10000,
                    volcanCost: data.volcan_cost || 5000,
                    catBought: data.cat_bought,
                    cat2Bought: data.cat2_bought,
                    cat3Bought: data.cat3_bought,
                    volcanBought: data.volcan_bought,

                    superClickCost: data.super_click_cost || 500000,
                    superClickThreshold: data.super_click_threshold || 500000,

                    // Mapping Mega & Giga
                    megaClickCost: data.mega_click_cost || 5000000,
                    megaClickThreshold: data.mega_click_threshold || 2000000,
                    gigaClickCost: data.giga_click_cost || 20000000,
                    gigaClickThreshold: data.giga_click_threshold || 10000000,

                    ultimateClickCost: data.ultimate_click_cost || 2500000,
                    ultimateClickThreshold: data.ultimate_click_threshold || 1000000,
                });
            }
        } else {
            set({ user: null, gameState: null, score: 0 });
        }
    },

    addScore: async (value) => {
        const { user, gameState, score } = get();
        if (!user || !gameState) return;
        const newScore = score + value;
        set({ score: newScore });
        await supabase.from("game_state").update({ score: newScore }).eq("id", gameState.id);
    },

    addPerSecond: async () => {
        const { user, gameState, perSecond, score } = get();
        if (!user || !gameState || perSecond === 0) return;
        const newScore = score + perSecond;
        set({ score: newScore });
        await supabase.from("game_state").update({ score: newScore }).eq("id", gameState.id);
    },

    // --- ACHATS ---

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

    buySuperClick: async () => {
        const { score, perClick, superClickCost, superClickThreshold, gameState } = get();
        if (score >= superClickCost) {
            const newScore = score - superClickCost;
            const newPerClick = perClick + 10000;
            const newCost = Math.floor(superClickCost * 1.5);
            const newThreshold = Math.floor(superClickThreshold * 1.5);
            set({ score: newScore, perClick: newPerClick, superClickCost: newCost, superClickThreshold: newThreshold });
            await supabase.from("game_state").update({ score: newScore, per_click: newPerClick, super_click_cost: newCost, super_click_threshold: newThreshold }).eq("id", gameState.id);
        }
    },

    // --- NOUVEAU : MEGA CLIC (+100k) ---
    buyMegaClick: async () => {
        const { score, perClick, megaClickCost, megaClickThreshold, gameState } = get();
        if (score >= megaClickCost) {
            const newScore = score - megaClickCost;
            const newPerClick = perClick + 100000; // +100k
            const newCost = Math.floor(megaClickCost * 1.5);
            const newThreshold = Math.floor(megaClickThreshold * 1.5);

            set({ score: newScore, perClick: newPerClick, megaClickCost: newCost, megaClickThreshold: newThreshold });
            await supabase.from("game_state").update({
                score: newScore,
                per_click: newPerClick,
                mega_click_cost: newCost,
                mega_click_threshold: newThreshold
            }).eq("id", gameState.id);
        }
    },

    // --- NOUVEAU : GIGA CLIC (+200k) ---
    buyGigaClick: async () => {
        const { score, perClick, gigaClickCost, gigaClickThreshold, gameState } = get();
        if (score >= gigaClickCost) {
            const newScore = score - gigaClickCost;
            const newPerClick = perClick + 200000; // +200k
            const newCost = Math.floor(gigaClickCost * 1.5);
            const newThreshold = Math.floor(gigaClickThreshold * 1.5);

            set({ score: newScore, perClick: newPerClick, gigaClickCost: newCost, gigaClickThreshold: newThreshold });
            await supabase.from("game_state").update({
                score: newScore,
                per_click: newPerClick,
                giga_click_cost: newCost,
                giga_click_threshold: newThreshold
            }).eq("id", gameState.id);
        }
    },

    buyUltimateClick: async () => {
        const { score, perClick, ultimateClickCost, ultimateClickThreshold, gameState } = get();
        if (score >= ultimateClickCost) {
            const newScore = score - ultimateClickCost;
            const newPerClick = perClick * 3;
            const newCost = Math.floor(ultimateClickCost * 4);
            const newThreshold = Math.floor(ultimateClickThreshold * 2);
            set({ score: newScore, perClick: newPerClick, ultimateClickCost: newCost, ultimateClickThreshold: newThreshold });
            await supabase.from("game_state").update({ score: newScore, per_click: newPerClick, ultimate_click_cost: newCost, ultimate_click_threshold: newThreshold }).eq("id", gameState.id);
        }
    },

    // Objets Spéciaux
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
            const newPerSecond = perSecond + 30;
            set({ score: newScore, perSecond: newPerSecond, volcanBought: true });
            await supabase.from("game_state").update({ score: newScore, per_second: newPerSecond, volcan_bought: true }).eq("id", gameState.id);
        }
    },

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
            super_click_cost: 500000,
            super_click_threshold: 500000,
            // Reset Mega & Giga
            mega_click_cost: 5000000,
            mega_click_threshold: 2000000,
            giga_click_cost: 20000000,
            giga_click_threshold: 10000000,

            ultimate_click_cost: 2500000,
            ultimate_click_threshold: 1000000,
            cat_bought: false,
            cat2_bought: false,
            cat3_bought: false,
            volcan_bought: false,
            active_media: [],
        };

        set({ ...initialState, activeMedia: [] });
        // Re-set manuellement les coûts en camelCase pour le store local
        set({
            megaClickCost: 5000000,
            megaClickThreshold: 2000000,
            gigaClickCost: 20000000,
            gigaClickThreshold: 10000000
        });

        await supabase.from("game_state").update(initialState).eq("id", gameState.id);
    },
}));

export default useStore;