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
    //          COÛTS & SEUILS
    // -----------------------------
    // Base
    clickUpgradeCost: 50,
    autoUpgradeCost: 100,
    catUpgradeCost: 250,
    cat2UpgradeCost: 1000,
    cat3UpgradeCost: 10000,
    volcanCost: 5000,

    // Clics Spéciaux
    superClickCost: 500000, superClickThreshold: 500000,
    megaClickCost: 5000000, megaClickThreshold: 2000000,
    gigaClickCost: 20000000, gigaClickThreshold: 10000000,
    ultimateClickCost: 2500000, ultimateClickThreshold: 1000000,

    // Clics Massifs
    click500kCost: 50000000, click500kThreshold: 25000000,
    click1mCost: 100000000, click1mThreshold: 50000000,
    click10mCost: 1000000000, click10mThreshold: 500000000,
    click100mCost: 10000000000, click100mThreshold: 5000000000,
    click1bCost: 100000000000, click1bThreshold: 50000000000,
    click10bCost: 1000000000000, click10bThreshold: 500000000000,
    click100bCost: 10000000000000, click100bThreshold: 5000000000000,
    multX2Cost: 100000000, multX2Threshold: 50000000,

    // Auto Massifs
    auto500kCost: 50000000, auto500kThreshold: 25000000,
    auto1mCost: 100000000, auto1mThreshold: 50000000,
    auto10mCost: 1000000000, auto10mThreshold: 500000000,
    auto100mCost: 10000000000, auto100mThreshold: 5000000000,
    auto1bCost: 100000000000, auto1bThreshold: 50000000000,
    auto10bCost: 1000000000000, auto10bThreshold: 500000000000,
    auto100bCost: 10000000000000, auto100bThreshold: 5000000000000,
    autoMultX2Cost: 100000000, autoMultX2Threshold: 50000000,

    // États objets uniques
    catBought: false, cat2Bought: false, cat3Bought: false, volcanBought: false,

    // -----------------------------
    //          FONCTIONS
    // -----------------------------
    toggleMedia: () => set((state) => ({ showMedia: !state.showMedia })),
    setGameState: (newState) => { set(newState); },
    setActiveMedia: (media) => set({ activeMedia: media }),

    setUser: async (user) => {
        set({ user });
        if (user) {
            const { data, error } = await supabase.from("game_state").select("*").eq("user_id", user.id).single();

            if (error && error.code === "PGRST116") {
                const { data: newGame } = await supabase.from("game_state").insert({ user_id: user.id }).single();
                if (newGame) set({ gameState: newGame, score: newGame.score, perClick: newGame.per_click, perSecond: newGame.per_second, activeMedia: newGame.active_media });
            } else if (data) {
                // Chargement complet (toutes les variables)
                set({
                    gameState: data, score: data.score, perClick: data.per_click, perSecond: data.per_second, activeMedia: data.active_media,
                    clickUpgradeCost: data.click_upgrade_cost || 50, autoUpgradeCost: data.auto_upgrade_cost || 100,
                    catUpgradeCost: data.cat_upgrade_cost || 250, cat2UpgradeCost: data.cat2_upgrade_cost || 1000, cat3UpgradeCost: data.cat3_upgrade_cost || 10000, volcanCost: data.volcan_cost || 5000,
                    catBought: data.cat_bought, cat2Bought: data.cat2_bought, cat3Bought: data.cat3_bought, volcanBought: data.volcan_bought,

                    superClickCost: data.super_click_cost || 500000, superClickThreshold: data.super_click_threshold || 500000,
                    megaClickCost: data.mega_click_cost || 5000000, megaClickThreshold: data.mega_click_threshold || 2000000,
                    gigaClickCost: data.giga_click_cost || 20000000, gigaClickThreshold: data.giga_click_threshold || 10000000,
                    ultimateClickCost: data.ultimate_click_cost || 2500000, ultimateClickThreshold: data.ultimate_click_threshold || 1000000,

                    click500kCost: data.click_500k_cost || 50000000, click500kThreshold: data.click_500k_threshold || 25000000,
                    click1mCost: data.click_1m_cost || 100000000, click1mThreshold: data.click_1m_threshold || 50000000,
                    click10mCost: data.click_10m_cost || 1000000000, click10mThreshold: data.click_10m_threshold || 500000000,
                    click100mCost: data.click_100m_cost || 10000000000, click100mThreshold: data.click_100m_threshold || 5000000000,
                    click1bCost: data.click_1b_cost || 100000000000, click1bThreshold: data.click_1b_threshold || 50000000000,
                    click10bCost: data.click_10b_cost || 1000000000000, click10bThreshold: data.click_10b_threshold || 500000000000,
                    click100bCost: data.click_100b_cost || 10000000000000, click100bThreshold: data.click_100b_threshold || 5000000000000,
                    multX2Cost: data.mult_x2_cost || 100000000, multX2Threshold: data.mult_x2_threshold || 50000000,

                    auto500kCost: data.auto_500k_cost || 50000000, auto500kThreshold: data.auto_500k_threshold || 25000000,
                    auto1mCost: data.auto_1m_cost || 100000000, auto1mThreshold: data.auto_1m_threshold || 50000000,
                    auto10mCost: data.auto_10m_cost || 1000000000, auto10mThreshold: data.auto_10m_threshold || 500000000,
                    auto100mCost: data.auto_100m_cost || 10000000000, auto100mThreshold: data.auto_100m_threshold || 5000000000,
                    auto1bCost: data.auto_1b_cost || 100000000000, auto1bThreshold: data.auto_1b_threshold || 50000000000,
                    auto10bCost: data.auto_10b_cost || 1000000000000, auto10bThreshold: data.auto_10b_threshold || 500000000000,
                    auto100bCost: data.auto_100b_cost || 10000000000000, auto100bThreshold: data.auto_100b_threshold || 5000000000000,
                    autoMultX2Cost: data.auto_mult_x2_cost || 100000000, autoMultX2Threshold: data.auto_mult_x2_threshold || 50000000,
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

    // --- HELPERS ---
    buyUpgrade: async (costKey, thresholdKey, dbCostKey, dbThresholdKey, clickBonus) => {
        const state = get();
        const cost = state[costKey];
        if (state.score >= cost) {
            const newScore = state.score - cost;
            const newPerClick = state.perClick + clickBonus;
            const newCost = Math.floor(cost * 1.5);
            const newThreshold = Math.floor(state[thresholdKey] * 1.5);
            set({ score: newScore, perClick: newPerClick, [costKey]: newCost, [thresholdKey]: newThreshold });
            await supabase.from("game_state").update({ score: newScore, per_click: newPerClick, [dbCostKey]: newCost, [dbThresholdKey]: newThreshold }).eq("id", state.gameState.id);
        }
    },
    buyAutoUpgradeHelper: async (costKey, thresholdKey, dbCostKey, dbThresholdKey, autoBonus) => {
        const state = get();
        const cost = state[costKey];
        if (state.score >= cost) {
            const newScore = state.score - cost;
            const newPerSecond = state.perSecond + autoBonus;
            const newCost = Math.floor(cost * 1.5);
            const newThreshold = Math.floor(state[thresholdKey] * 1.5);
            set({ score: newScore, perSecond: newPerSecond, [costKey]: newCost, [thresholdKey]: newThreshold });
            await supabase.from("game_state").update({ score: newScore, per_second: newPerSecond, [dbCostKey]: newCost, [dbThresholdKey]: newThreshold }).eq("id", state.gameState.id);
        }
    },
    sellUpgrade: async (costKey, thresholdKey, dbCostKey, dbThresholdKey, statKey, dbStatKey, statDeduction, minCost) => {
        const state = get();
        const currentCost = state[costKey];
        if (currentCost <= minCost) return; // Impossible de vendre le niveau 0

        const previousCost = Math.ceil(currentCost / 1.5);
        const refund = Math.floor(previousCost / 2);
        const newScore = state.score + refund;
        const newStat = Math.max(0, state[statKey] - statDeduction);
        const newThreshold = Math.ceil(state[thresholdKey] / 1.5);

        set({ score: newScore, [statKey]: newStat, [costKey]: previousCost, [thresholdKey]: newThreshold });
        await supabase.from("game_state").update({ score: newScore, [dbStatKey]: newStat, [dbCostKey]: previousCost, [dbThresholdKey]: newThreshold }).eq("id", state.gameState.id);
    },

    // --- ACTIONS ACHAT ---
    buyClickUpgrade: () => get().buyUpgrade('clickUpgradeCost', 'clickUpgradeCost', 'click_upgrade_cost', 'click_upgrade_cost', 1),
    buySuperClick: () => get().buyUpgrade('superClickCost', 'superClickThreshold', 'super_click_cost', 'super_click_threshold', 10000),
    buyMegaClick: () => get().buyUpgrade('megaClickCost', 'megaClickThreshold', 'mega_click_cost', 'mega_click_threshold', 100000),
    buyGigaClick: () => get().buyUpgrade('gigaClickCost', 'gigaClickThreshold', 'giga_click_cost', 'giga_click_threshold', 200000),
    buy500k: () => get().buyUpgrade('click500kCost', 'click500kThreshold', 'click_500k_cost', 'click_500k_threshold', 500000),
    buy1m: () => get().buyUpgrade('click1mCost', 'click1mThreshold', 'click_1m_cost', 'click_1m_threshold', 1000000),
    buy10m: () => get().buyUpgrade('click10mCost', 'click10mThreshold', 'click_10m_cost', 'click_10m_threshold', 10000000),
    buy100m: () => get().buyUpgrade('click100mCost', 'click100mThreshold', 'click_100m_cost', 'click_100m_threshold', 100000000),
    buy1b: () => get().buyUpgrade('click1bCost', 'click1bThreshold', 'click_1b_cost', 'click_1b_threshold', 1000000000),
    buy10b: () => get().buyUpgrade('click10bCost', 'click10bThreshold', 'click_10b_cost', 'click_10b_threshold', 10000000000),
    buy100b: () => get().buyUpgrade('click100bCost', 'click100bThreshold', 'click_100b_cost', 'click_100b_threshold', 100000000000),

    buyAutoUpgrade: () => get().buyAutoUpgradeHelper('autoUpgradeCost', 'autoUpgradeCost', 'auto_upgrade_cost', 'auto_upgrade_cost', 2),
    buyAuto500k: () => get().buyAutoUpgradeHelper('auto500kCost', 'auto500kThreshold', 'auto_500k_cost', 'auto_500k_threshold', 500000),
    buyAuto1m: () => get().buyAutoUpgradeHelper('auto1mCost', 'auto1mThreshold', 'auto_1m_cost', 'auto_1m_threshold', 1000000),
    buyAuto10m: () => get().buyAutoUpgradeHelper('auto10mCost', 'auto10mThreshold', 'auto_10m_cost', 'auto_10m_threshold', 10000000),
    buyAuto100m: () => get().buyAutoUpgradeHelper('auto100mCost', 'auto100mThreshold', 'auto_100m_cost', 'auto_100m_threshold', 100000000),
    buyAuto1b: () => get().buyAutoUpgradeHelper('auto1bCost', 'auto1bThreshold', 'auto_1b_cost', 'auto_1b_threshold', 1000000000),
    buyAuto10b: () => get().buyAutoUpgradeHelper('auto10bCost', 'auto10bThreshold', 'auto_10b_cost', 'auto_10b_threshold', 10000000000),
    buyAuto100b: () => get().buyAutoUpgradeHelper('auto100bCost', 'auto100bThreshold', 'auto_100b_cost', 'auto_100b_threshold', 100000000000),

    buyMultX2: async () => {
        const state = get();
        if (state.score >= state.multX2Cost) {
            const newScore = state.score - state.multX2Cost;
            const newPerClick = state.perClick * 2;
            const newCost = Math.floor(state.multX2Cost * 3);
            const newThresh = Math.floor(state.multX2Threshold * 2);
            set({ score: newScore, perClick: newPerClick, multX2Cost: newCost, multX2Threshold: newThresh });
            await supabase.from("game_state").update({ score: newScore, per_click: newPerClick, mult_x2_cost: newCost, mult_x2_threshold: newThresh }).eq("id", state.gameState.id);
        }
    },
    buyAutoMultX2: async () => {
        const state = get();
        if (state.score >= state.autoMultX2Cost) {
            const newScore = state.score - state.autoMultX2Cost;
            const newPerSecond = state.perSecond * 2;
            const newCost = Math.floor(state.autoMultX2Cost * 3);
            const newThresh = Math.floor(state.autoMultX2Threshold * 2);
            set({ score: newScore, perSecond: newPerSecond, autoMultX2Cost: newCost, autoMultX2Threshold: newThresh });
            await supabase.from("game_state").update({ score: newScore, per_second: newPerSecond, auto_mult_x2_cost: newCost, auto_mult_x2_threshold: newThresh }).eq("id", state.gameState.id);
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

    // --- ACTIONS VENTE ---
    sellClickUpgrade: () => get().sellUpgrade('clickUpgradeCost', 'clickUpgradeCost', 'click_upgrade_cost', 'click_upgrade_cost', 'perClick', 'per_click', 1, 50),
    sellSuperClick: () => get().sellUpgrade('superClickCost', 'superClickThreshold', 'super_click_cost', 'super_click_threshold', 'perClick', 'per_click', 10000, 500000),
    sellMegaClick: () => get().sellUpgrade('megaClickCost', 'megaClickThreshold', 'mega_click_cost', 'mega_click_threshold', 'perClick', 'per_click', 100000, 5000000),
    sellGigaClick: () => get().sellUpgrade('gigaClickCost', 'gigaClickThreshold', 'giga_click_cost', 'giga_click_threshold', 'perClick', 'per_click', 200000, 20000000),
    sell500k: () => get().sellUpgrade('click500kCost', 'click500kThreshold', 'click_500k_cost', 'click_500k_threshold', 'perClick', 'per_click', 500000, 50000000),
    sell1m: () => get().sellUpgrade('click1mCost', 'click1mThreshold', 'click_1m_cost', 'click_1m_threshold', 'perClick', 'per_click', 1000000, 100000000),
    sell10m: () => get().sellUpgrade('click10mCost', 'click10mThreshold', 'click_10m_cost', 'click_10m_threshold', 'perClick', 'per_click', 10000000, 1000000000),
    sell100m: () => get().sellUpgrade('click100mCost', 'click100mThreshold', 'click_100m_cost', 'click_100m_threshold', 'perClick', 'per_click', 100000000, 10000000000),
    sell1b: () => get().sellUpgrade('click1bCost', 'click1bThreshold', 'click_1b_cost', 'click_1b_threshold', 'perClick', 'per_click', 1000000000, 100000000000),
    sell10b: () => get().sellUpgrade('click10bCost', 'click10bThreshold', 'click_10b_cost', 'click_10b_threshold', 'perClick', 'per_click', 10000000000, 1000000000000),
    sell100b: () => get().sellUpgrade('click100bCost', 'click100bThreshold', 'click_100b_cost', 'click_100b_threshold', 'perClick', 'per_click', 100000000000, 10000000000000),

    sellAutoUpgrade: () => get().sellUpgrade('autoUpgradeCost', 'autoUpgradeCost', 'auto_upgrade_cost', 'auto_upgrade_cost', 'perSecond', 'per_second', 2, 100),
    sellAuto500k: () => get().sellUpgrade('auto500kCost', 'auto500kThreshold', 'auto_500k_cost', 'auto_500k_threshold', 'perSecond', 'per_second', 500000, 50000000),
    sellAuto1m: () => get().sellUpgrade('auto1mCost', 'auto1mThreshold', 'auto_1m_cost', 'auto_1m_threshold', 'perSecond', 'per_second', 1000000, 100000000),
    sellAuto10m: () => get().sellUpgrade('auto10mCost', 'auto10mThreshold', 'auto_10m_cost', 'auto_10m_threshold', 'perSecond', 'per_second', 10000000, 1000000000),
    sellAuto100m: () => get().sellUpgrade('auto100mCost', 'auto100mThreshold', 'auto_100m_cost', 'auto_100m_threshold', 'perSecond', 'per_second', 100000000, 10000000000),
    sellAuto1b: () => get().sellUpgrade('auto1bCost', 'auto1bThreshold', 'auto_1b_cost', 'auto_1b_threshold', 'perSecond', 'per_second', 1000000000, 100000000000),
    sellAuto10b: () => get().sellUpgrade('auto10bCost', 'auto10bThreshold', 'auto_10b_cost', 'auto_10b_threshold', 'perSecond', 'per_second', 10000000000, 1000000000000),
    sellAuto100b: () => get().sellUpgrade('auto100bCost', 'auto100bThreshold', 'auto_100b_cost', 'auto_100b_threshold', 'perSecond', 'per_second', 100000000000, 10000000000000),

    sellUltimateClick: async () => {
        const state = get();
        if (state.ultimateClickCost <= 2500000) return;
        const prevCost = Math.ceil(state.ultimateClickCost / 4);
        const refund = Math.floor(prevCost / 2);
        const newScore = state.score + refund;
        const newStat = Math.floor(state.perClick / 3);
        const newThreshold = Math.ceil(state.ultimateClickThreshold / 2);
        set({ score: newScore, perClick: newStat, ultimateClickCost: prevCost, ultimateClickThreshold: newThreshold });
        await supabase.from("game_state").update({ score: newScore, per_click: newStat, ultimate_click_cost: prevCost, ultimate_click_threshold: newThreshold }).eq("id", state.gameState.id);
    },

    // Objets Spéciaux
    buyCatUpgrade: async () => { const s = get(); if(s.score>=s.catUpgradeCost){ set({score:s.score-s.catUpgradeCost, perSecond:s.perSecond+10, catBought:true}); await supabase.from("game_state").update({score:s.score-s.catUpgradeCost, per_second:s.perSecond+10, cat_bought:true}).eq("id",s.gameState.id);}},
    buyCat2Upgrade: async () => { const s = get(); if(s.score>=s.cat2UpgradeCost){ set({score:s.score-s.cat2UpgradeCost, perSecond:s.perSecond+50, cat2Bought:true}); await supabase.from("game_state").update({score:s.score-s.cat2UpgradeCost, per_second:s.perSecond+50, cat2_bought:true}).eq("id",s.gameState.id);}},
    buyCat3Upgrade: async () => { const s = get(); if(s.score>=s.cat3UpgradeCost){ set({score:s.score-s.cat3UpgradeCost, perSecond:s.perSecond+10000, cat3Bought:true}); await supabase.from("game_state").update({score:s.score-s.cat3UpgradeCost, per_second:s.perSecond+10000, cat3_bought:true}).eq("id",s.gameState.id);}},
    buyVolcan: async () => { const s = get(); if(s.score>=s.volcanCost){ set({score:s.score-s.volcanCost, perSecond:s.perSecond+30, volcanBought:true}); await supabase.from("game_state").update({score:s.score-s.volcanCost, per_second:s.perSecond+30, volcan_bought:true}).eq("id",s.gameState.id);}},

    resetGame: async () => {
        const { user, gameState } = get();
        if (!user || !gameState) return;

        const initialState = {
            score: 0, per_click: 1, per_second: 0,
            click_upgrade_cost: 50, auto_upgrade_cost: 100, cat_upgrade_cost: 250, cat2_upgrade_cost: 1000, cat3_upgrade_cost: 10000, volcan_cost: 5000,
            super_click_cost: 500000, super_click_threshold: 500000,
            mega_click_cost: 5000000, mega_click_threshold: 2000000,
            giga_click_cost: 20000000, giga_click_threshold: 10000000,
            ultimate_click_cost: 2500000, ultimate_click_threshold: 1000000,

            click_500k_cost: 50000000, click_500k_threshold: 25000000,
            click_1m_cost: 100000000, click_1m_threshold: 50000000,
            click_10m_cost: 1000000000, click_10m_threshold: 500000000,
            click_100m_cost: 10000000000, click_100m_threshold: 5000000000,
            click_1b_cost: 100000000000, click_1b_threshold: 50000000000,
            click_10b_cost: 1000000000000, click_10b_threshold: 500000000000,
            click_100b_cost: 10000000000000, click_100b_threshold: 5000000000000,

            auto_500k_cost: 50000000, auto_500k_threshold: 25000000,
            auto_1m_cost: 100000000, auto_1m_threshold: 50000000,
            auto_10m_cost: 1000000000, auto_10m_threshold: 500000000,
            auto_100m_cost: 10000000000, auto_100m_threshold: 5000000000,
            auto_1b_cost: 100000000000, auto_1b_threshold: 50000000000,
            auto_10b_cost: 1000000000000, auto_10b_threshold: 500000000000,
            auto_100b_cost: 10000000000000, auto_100b_threshold: 5000000000000,

            mult_x2_cost: 100000000, mult_x2_threshold: 50000000,
            auto_mult_x2_cost: 100000000, auto_mult_x2_threshold: 50000000,

            cat_bought: false, cat2_bought: false, cat3_bought: false, volcan_bought: false,
            active_media: []
        };

        set({ ...initialState, activeMedia: [] });
        // Reset complet des états locaux camelCase
        set({
            clickUpgradeCost: 50, autoUpgradeCost: 100, catUpgradeCost: 250, cat2UpgradeCost: 1000, cat3UpgradeCost: 10000, volcanCost: 5000,
            superClickCost: 500000, superClickThreshold: 500000, megaClickCost: 5000000, megaClickThreshold: 2000000, gigaClickCost: 20000000, gigaClickThreshold: 10000000, ultimateClickCost: 2500000, ultimateClickThreshold: 1000000,
            click500kCost: 50000000, click500kThreshold: 25000000, click1mCost: 100000000, click1mThreshold: 50000000, click10mCost: 1000000000, click10mThreshold: 500000000, click100mCost: 10000000000, click100mThreshold: 5000000000, click1bCost: 100000000000, click1bThreshold: 50000000000, click10bCost: 1000000000000, click10bThreshold: 500000000000, click100bCost: 10000000000000, click100bThreshold: 5000000000000,
            auto500kCost: 50000000, auto500kThreshold: 25000000, auto1mCost: 100000000, auto1mThreshold: 50000000, auto10mCost: 1000000000, auto10mThreshold: 500000000, auto100mCost: 10000000000, auto100mThreshold: 5000000000, auto1bCost: 100000000000, auto1bThreshold: 50000000000, auto10bCost: 1000000000000, auto10bThreshold: 500000000000, auto100bCost: 10000000000000, auto100bThreshold: 5000000000000,
            multX2Cost: 100000000, multX2Threshold: 50000000, autoMultX2Cost: 100000000, autoMultX2Threshold: 50000000
        });
        await supabase.from("game_state").update(initialState).eq("id", gameState.id);
    },
}));

export default useStore;