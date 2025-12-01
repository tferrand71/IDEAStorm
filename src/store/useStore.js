import { create } from "zustand";
import supabase from "../lib/supabaseClient";

// HELPER SÉCURITÉ : Convertit n'importe quoi en Nombre valide.
// Si c'est null/undefined/NaN, renvoie la valeur par défaut.
const toNumber = (val, defaultVal) => {
    if (val === undefined || val === null) return defaultVal;
    const num = Number(val);
    return isNaN(num) ? defaultVal : num;
};

const useStore = create((set, get) => ({
    // --- SYSTÈME ---
    user: null,
    gameState: null,
    showMedia: true,
    hasSeenEnding: false,

    // --- STATS ---
    score: 0,
    perClick: 1,
    perSecond: 0,
    activeMedia: [],

    // --- COÛTS & SEUILS ---

    // NIVEAU 1 : BASIQUE
    clickUpgradeCost: 50, autoUpgradeCost: 100,
    catUpgradeCost: 250, cat2UpgradeCost: 1000, cat3UpgradeCost: 10000,
    volcanCost: 5000, gooseCost: 50000, // Prix de l'Oie

    // NIVEAU 2 : SPÉCIAUX
    superClickCost: 500000, superClickThreshold: 500000,
    megaClickCost: 5000000, megaClickThreshold: 2000000,
    gigaClickCost: 20000000, gigaClickThreshold: 10000000,
    ultimateClickCost: 2500000, ultimateClickThreshold: 1000000,

    // NIVEAU 3 : MASSIFS (Clics)
    click500kCost: 50000000, click500kThreshold: 25000000,
    click1mCost: 100000000, click1mThreshold: 50000000,
    click10mCost: 1000000000, click10mThreshold: 500000000,
    click100mCost: 10000000000, click100mThreshold: 5000000000,
    click1bCost: 100000000000, click1bThreshold: 50000000000,
    click10bCost: 1000000000000, click10bThreshold: 500000000000,
    click100bCost: 10000000000000, click100bThreshold: 5000000000000,

    // NIVEAU 3 : MASSIFS (Auto)
    auto500kCost: 50000000, auto500kThreshold: 25000000,
    auto1mCost: 100000000, auto1mThreshold: 50000000,
    auto10mCost: 1000000000, auto10mThreshold: 500000000,
    auto100mCost: 10000000000, auto100mThreshold: 5000000000,
    auto1bCost: 100000000000, auto1bThreshold: 50000000000,
    auto10bCost: 1000000000000, auto10bThreshold: 500000000000,
    auto100bCost: 10000000000000, auto100bThreshold: 5000000000000,

    // MULTIPLICATEURS
    multX2Cost: 100000000, multX2Threshold: 50000000,
    autoMultX2Cost: 100000000, autoMultX2Threshold: 50000000,

    // NIVEAU 4 : GOD MODE (a -> zz)
    godClickACost: 1e12, godClickAThreshold: 5e11,
    godClickAACost: 1e15, godClickAAThreshold: 5e14,
    godClickGGCost: 1e33, godClickGGThreshold: 5e32,
    godClickMMCost: 1e48, godClickMMThreshold: 5e47,
    godClickSSCost: 1e63, godClickSSThreshold: 5e62,
    godClickZZCost: 1e90, godClickZZThreshold: 5e89,

    godAutoACost: 1e12, godAutoAThreshold: 5e11,
    godAutoAACost: 1e15, godAutoAAThreshold: 5e14,
    godAutoGGCost: 1e33, godAutoGGThreshold: 5e32,
    godAutoMMCost: 1e48, godAutoMMThreshold: 5e47,
    godAutoSSCost: 1e63, godAutoSSThreshold: 5e62,
    godAutoZZCost: 1e90, godAutoZZThreshold: 5e89,

    // ÉTATS COMPAGNONS
    catBought: false, cat2Bought: false, cat3Bought: false,
    volcanBought: false, gooseBought: false,

    // --- FONCTIONS ---
    toggleMedia: () => set((state) => ({ showMedia: !state.showMedia })),
    closeEasterEgg: () => set({ hasSeenEnding: true }),
    setGameState: (newState) => { set(newState); },
    setActiveMedia: (media) => set({ activeMedia: media }),

    setUser: async (user) => {
        set({ user });
        if (user) {
            const { data, error } = await supabase.from("game_state").select("*").eq("user_id", user.id).single();

            if (data) {
                set({
                    gameState: data,
                    score: toNumber(data.score, 0),
                    perClick: toNumber(data.per_click, 1),
                    perSecond: toNumber(data.per_second, 0),
                    activeMedia: data.active_media,

                    // Chargement Coûts de Base + Oie
                    clickUpgradeCost: toNumber(data.click_upgrade_cost, 50), autoUpgradeCost: toNumber(data.auto_upgrade_cost, 100),
                    catUpgradeCost: toNumber(data.cat_upgrade_cost, 250), cat2UpgradeCost: toNumber(data.cat2_upgrade_cost, 1000),
                    cat3UpgradeCost: toNumber(data.cat3_upgrade_cost, 10000), volcanCost: toNumber(data.volcan_cost, 5000),
                    gooseCost: toNumber(data.goose_cost, 50000), // L'Oie

                    // États Booléens
                    catBought: data.cat_bought, cat2Bought: data.cat2_bought,
                    cat3Bought: data.cat3_bought, volcanBought: data.volcan_bought,
                    gooseBought: data.goose_bought, // L'Oie

                    // Spéciaux
                    superClickCost: toNumber(data.super_click_cost, 500000), superClickThreshold: toNumber(data.super_click_threshold, 500000),
                    megaClickCost: toNumber(data.mega_click_cost, 5000000), megaClickThreshold: toNumber(data.mega_click_threshold, 2000000),
                    gigaClickCost: toNumber(data.giga_click_cost, 20000000), gigaClickThreshold: toNumber(data.giga_click_threshold, 10000000),
                    ultimateClickCost: toNumber(data.ultimate_click_cost, 2500000), ultimateClickThreshold: toNumber(data.ultimate_click_threshold, 1000000),

                    // Massifs Clics
                    click500kCost: toNumber(data.click_500k_cost, 50000000), click500kThreshold: toNumber(data.click_500k_threshold, 25000000),
                    click1mCost: toNumber(data.click_1m_cost, 100000000), click1mThreshold: toNumber(data.click_1m_threshold, 50000000),
                    click10mCost: toNumber(data.click_10m_cost, 1000000000), click10mThreshold: toNumber(data.click_10m_threshold, 500000000),
                    click100mCost: toNumber(data.click_100m_cost, 10000000000), click100mThreshold: toNumber(data.click_100m_threshold, 5000000000),
                    click1bCost: toNumber(data.click_1b_cost, 100000000000), click1bThreshold: toNumber(data.click_1b_threshold, 50000000000),
                    click10bCost: toNumber(data.click_10b_cost, 1000000000000), click10bThreshold: toNumber(data.click_10b_threshold, 500000000000),
                    click100bCost: toNumber(data.click_100b_cost, 10000000000000), click100bThreshold: toNumber(data.click_100b_threshold, 5000000000000),

                    // Massifs Auto
                    auto500kCost: toNumber(data.auto_500k_cost, 50000000), auto500kThreshold: toNumber(data.auto_500k_threshold, 25000000),
                    auto1mCost: toNumber(data.auto_1m_cost, 100000000), auto1mThreshold: toNumber(data.auto_1m_threshold, 50000000),
                    auto10mCost: toNumber(data.auto_10m_cost, 1000000000), auto10mThreshold: toNumber(data.auto_10m_threshold, 500000000),
                    auto100mCost: toNumber(data.auto_100m_cost, 10000000000), auto100mThreshold: toNumber(data.auto_100m_threshold, 5000000000),
                    auto1bCost: toNumber(data.auto_1b_cost, 100000000000), auto1bThreshold: toNumber(data.auto_1b_threshold, 50000000000),
                    auto10bCost: toNumber(data.auto_10b_cost, 1000000000000), auto10bThreshold: toNumber(data.auto_10b_threshold, 500000000000),
                    auto100bCost: toNumber(data.auto_100b_cost, 10000000000000), auto100bThreshold: toNumber(data.auto_100b_threshold, 5000000000000),

                    // Multiplicateurs
                    multX2Cost: toNumber(data.mult_x2_cost, 100000000), multX2Threshold: toNumber(data.mult_x2_threshold, 50000000),
                    autoMultX2Cost: toNumber(data.auto_mult_x2_cost, 100000000), autoMultX2Threshold: toNumber(data.auto_mult_x2_threshold, 50000000),

                    // God Mode
                    godClickACost: toNumber(data.god_click_a_cost, 1e12), godClickAThreshold: toNumber(data.god_click_a_threshold, 5e11),
                    godClickAACost: toNumber(data.god_click_aa_cost, 1e15), godClickAAThreshold: toNumber(data.god_click_aa_threshold, 5e14),
                    godClickGGCost: toNumber(data.god_click_gg_cost, 1e33), godClickGGThreshold: toNumber(data.god_click_gg_threshold, 5e32),
                    godClickMMCost: toNumber(data.god_click_mm_cost, 1e48), godClickMMThreshold: toNumber(data.god_click_mm_threshold, 5e47),
                    godClickSSCost: toNumber(data.god_click_ss_cost, 1e63), godClickSSThreshold: toNumber(data.god_click_ss_threshold, 5e62),
                    godClickZZCost: toNumber(data.god_click_zz_cost, 1e90), godClickZZThreshold: toNumber(data.god_click_zz_threshold, 5e89),

                    godAutoACost: toNumber(data.god_auto_a_cost, 1e12), godAutoAThreshold: toNumber(data.god_auto_a_threshold, 5e11),
                    godAutoAACost: toNumber(data.god_auto_aa_cost, 1e15), godAutoAAThreshold: toNumber(data.god_auto_aa_threshold, 5e14),
                    godAutoGGCost: toNumber(data.god_auto_gg_cost, 1e33), godAutoGGThreshold: toNumber(data.god_auto_gg_threshold, 5e32),
                    godAutoMMCost: toNumber(data.god_auto_mm_cost, 1e48), godAutoMMThreshold: toNumber(data.god_auto_mm_threshold, 5e47),
                    godAutoSSCost: toNumber(data.god_auto_ss_cost, 1e63), godAutoSSThreshold: toNumber(data.god_auto_ss_threshold, 5e62),
                    godAutoZZCost: toNumber(data.god_auto_zz_cost, 1e90), godAutoZZThreshold: toNumber(data.god_auto_zz_threshold, 5e89),
                });
            } else if (error && error.code === "PGRST116") {
                const { data: newGame } = await supabase.from("game_state").insert({ user_id: user.id }).single();
                if (newGame) set({ gameState: newGame, score: 0, perClick: 1, perSecond: 0, activeMedia: [] });
            }
        } else {
            set({ user: null, gameState: null, score: 0 });
        }
    },

    // SAUVEGARDE SÉCURISÉE (Anti-Crash BDD)
    saveToDB: async (payload) => {
        const state = get();
        if (!state.gameState) return;
        const stringPayload = {};

        for (const key in payload) {
            const val = payload[key];
            if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
                stringPayload[key] = val;
            } else if (typeof val === 'boolean') {
                stringPayload[key] = val;
            }
        }
        if (Object.keys(stringPayload).length > 0) {
            await supabase.from("game_state").update(stringPayload).eq("id", state.gameState.id);
        }
    },

    // --- ACTIONS DE JEU (Avec protection NaN) ---

    addScore: async (value) => {
        const { user, gameState, score } = get();
        if (!user || !gameState) return;
        const val = toNumber(value, 0);
        const newScore = Math.floor(score + val);
        if (!isNaN(newScore)) {
            set({ score: newScore });
            get().saveToDB({ score: newScore });
        }
    },

    addPerSecond: async () => {
        const { user, gameState, perSecond, score } = get();
        const ps = toNumber(perSecond, 0);
        if (!user || !gameState || ps <= 0) return;
        const newScore = Math.floor(score + ps);
        if (!isNaN(newScore)) {
            set({ score: newScore });
            get().saveToDB({ score: newScore });
        }
    },

    // Helpers d'achat génériques
    buyUpgrade: async (costKey, thresholdKey, dbCostKey, dbThresholdKey, clickBonus) => {
        const state = get();
        const cost = toNumber(state[costKey], Infinity);
        const currentScore = toNumber(state.score, 0);

        if (currentScore >= cost) {
            const newScore = Math.floor(currentScore - cost);
            const newPerClick = Math.floor(toNumber(state.perClick, 1) + toNumber(clickBonus, 0));
            const newCost = Math.floor(cost * 1.5);
            const newThreshold = Math.floor(toNumber(state[thresholdKey], 0) * 1.5);

            if (!isNaN(newScore)) {
                set({ score: newScore, perClick: newPerClick, [costKey]: newCost, [thresholdKey]: newThreshold });
                get().saveToDB({ score: newScore, per_click: newPerClick, [dbCostKey]: newCost, [dbThresholdKey]: newThreshold });
            }
        }
    },

    buyAutoUpgradeHelper: async (costKey, thresholdKey, dbCostKey, dbThresholdKey, autoBonus) => {
        const state = get();
        const cost = toNumber(state[costKey], Infinity);
        const currentScore = toNumber(state.score, 0);

        if (currentScore >= cost) {
            const newScore = Math.floor(currentScore - cost);
            const newPerSecond = Math.floor(toNumber(state.perSecond, 0) + toNumber(autoBonus, 0));
            const newCost = Math.floor(cost * 1.5);
            const newThreshold = Math.floor(toNumber(state[thresholdKey], 0) * 1.5);

            if (!isNaN(newScore)) {
                set({ score: newScore, perSecond: newPerSecond, [costKey]: newCost, [thresholdKey]: newThreshold });
                get().saveToDB({ score: newScore, per_second: newPerSecond, [dbCostKey]: newCost, [dbThresholdKey]: newThreshold });
            }
        }
    },

    sellUpgrade: async (costKey, thresholdKey, dbCostKey, dbThresholdKey, statKey, dbStatKey, statDeduction, minCost) => {
        const state = get();
        const currentCost = toNumber(state[costKey], 0);
        if (currentCost <= minCost) return;

        const previousCost = Math.ceil(currentCost / 1.5);
        const refund = Math.floor(previousCost / 2);
        const newScore = Math.floor(state.score + refund);
        const newStat = Math.max(0, Math.floor(state[statKey] - toNumber(statDeduction, 0)));
        const newThreshold = Math.ceil(state[thresholdKey] / 1.5);

        if (!isNaN(newScore)) {
            set({ score: newScore, [statKey]: newStat, [costKey]: previousCost, [thresholdKey]: newThreshold });
            get().saveToDB({ score: newScore, [dbStatKey]: newStat, [dbCostKey]: previousCost, [dbThresholdKey]: newThreshold });
        }
    },

    // MAPPINGS CLICS
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

    // GOD MODE CLICS
    buyGodA: () => get().buyUpgrade('godClickACost', 'godClickAThreshold', 'god_click_a_cost', 'god_click_a_threshold', 1e12),
    buyGodAA: () => get().buyUpgrade('godClickAACost', 'godClickAAThreshold', 'god_click_aa_cost', 'god_click_aa_threshold', 1e15),
    buyGodGG: () => get().buyUpgrade('godClickGGCost', 'godClickGGThreshold', 'god_click_gg_cost', 'god_click_gg_threshold', 1e33),
    buyGodMM: () => get().buyUpgrade('godClickMMCost', 'godClickMMThreshold', 'god_click_mm_cost', 'god_click_mm_threshold', 1e48),
    buyGodSS: () => get().buyUpgrade('godClickSSCost', 'godClickSSThreshold', 'god_click_ss_cost', 'god_click_ss_threshold', 1e63),
    buyGodZZ: () => get().buyUpgrade('godClickZZCost', 'godClickZZThreshold', 'god_click_zz_cost', 'god_click_zz_threshold', 1e90),

    // MAPPINGS AUTO
    buyAutoUpgrade: () => get().buyAutoUpgradeHelper('autoUpgradeCost', 'autoUpgradeCost', 'auto_upgrade_cost', 'auto_upgrade_cost', 2),
    buyAuto500k: () => get().buyAutoUpgradeHelper('auto500kCost', 'auto500kThreshold', 'auto_500k_cost', 'auto_500k_threshold', 500000),
    buyAuto1m: () => get().buyAutoUpgradeHelper('auto1mCost', 'auto1mThreshold', 'auto_1m_cost', 'auto_1m_threshold', 1000000),
    buyAuto10m: () => get().buyAutoUpgradeHelper('auto10mCost', 'auto10mThreshold', 'auto_10m_cost', 'auto_10m_threshold', 10000000),
    buyAuto100m: () => get().buyAutoUpgradeHelper('auto100mCost', 'auto100mThreshold', 'auto_100m_cost', 'auto_100m_threshold', 100000000),
    buyAuto1b: () => get().buyAutoUpgradeHelper('auto1bCost', 'auto1bThreshold', 'auto_1b_cost', 'auto_1b_threshold', 1000000000),
    buyAuto10b: () => get().buyAutoUpgradeHelper('auto10bCost', 'auto10bThreshold', 'auto_10b_cost', 'auto_10b_threshold', 10000000000),
    buyAuto100b: () => get().buyAutoUpgradeHelper('auto100bCost', 'auto100bThreshold', 'auto_100b_cost', 'auto_100b_threshold', 100000000000),

    // GOD MODE AUTO
    buyAutoGodA: () => get().buyAutoUpgradeHelper('godAutoACost', 'godAutoAThreshold', 'god_auto_a_cost', 'god_auto_a_threshold', 1e12),
    buyAutoGodAA: () => get().buyAutoUpgradeHelper('godAutoAACost', 'godAutoAAThreshold', 'god_auto_aa_cost', 'god_auto_aa_threshold', 1e15),
    buyAutoGodGG: () => get().buyAutoUpgradeHelper('godAutoGGCost', 'godAutoGGThreshold', 'god_auto_gg_cost', 'god_auto_gg_threshold', 1e33),
    buyAutoGodMM: () => get().buyAutoUpgradeHelper('godAutoMMCost', 'godAutoMMThreshold', 'god_auto_mm_cost', 'god_auto_mm_threshold', 1e48),
    buyAutoGodSS: () => get().buyAutoUpgradeHelper('godAutoSSCost', 'godAutoSSThreshold', 'god_auto_ss_cost', 'god_auto_ss_threshold', 1e63),
    buyAutoGodZZ: () => get().buyAutoUpgradeHelper('godAutoZZCost', 'godAutoZZThreshold', 'god_auto_zz_cost', 'god_auto_zz_threshold', 1e90),

    // MULTIPLICATEURS (Achat seul)
    buyMultX2: async () => {
        const s = get(); if(s.score>=s.multX2Cost){
            const newScore = Math.floor(s.score-s.multX2Cost); const newPerClick = Math.floor(s.perClick*2);
            const newCost = Math.floor(s.multX2Cost*3); const newThresh = Math.floor(s.multX2Threshold*2);
            set({score:newScore, perClick:newPerClick, multX2Cost:newCost, multX2Threshold:newThresh});
            get().saveToDB({score:newScore, per_click:newPerClick, mult_x2_cost:newCost, mult_x2_threshold:newThresh});
        }
    },
    buyAutoMultX2: async () => {
        const s = get(); if(s.score>=s.autoMultX2Cost){
            const newScore = Math.floor(s.score-s.autoMultX2Cost); const newPerSecond = Math.floor(s.perSecond*2);
            const newCost = Math.floor(s.autoMultX2Cost*3); const newThresh = Math.floor(s.autoMultX2Threshold*2);
            set({score:newScore, perSecond:newPerSecond, autoMultX2Cost:newCost, autoMultX2Threshold:newThresh});
            get().saveToDB({score:newScore, per_second:newPerSecond, auto_mult_x2_cost:newCost, auto_mult_x2_threshold:newThresh});
        }
    },
    buyUltimateClick: async () => {
        const s = get(); if(s.score>=s.ultimateClickCost){
            const newScore = Math.floor(s.score-s.ultimateClickCost); const newPerClick = Math.floor(s.perClick*3);
            const newCost = Math.floor(s.ultimateClickCost*4); const newThresh = Math.floor(s.ultimateClickThreshold*2);
            set({score:newScore, perClick:newPerClick, ultimateClickCost:newCost, ultimateClickThreshold:newThresh});
            get().saveToDB({score:newScore, per_click:newPerClick, ultimate_click_cost:newCost, ultimate_click_threshold:newThresh});
        }
    },

    // VENTES
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
    sell100b: () => get().sellUpgrade('click100bCost', 'click100bThreshold', 'click100b_cost', 'click100b_threshold', 'perClick', 'per_click', 100000000000, 10000000000000),
    sellGodA: () => get().sellUpgrade('godClickACost', 'godClickAThreshold', 'god_click_a_cost', 'god_click_a_threshold', 'perClick', 'per_click', 1e12, 1e12),
    sellGodAA: () => get().sellUpgrade('godClickAACost', 'godClickAAThreshold', 'god_click_aa_cost', 'god_click_aa_threshold', 'perClick', 'per_click', 1e15, 1e15),
    sellGodGG: () => get().sellUpgrade('godClickGGCost', 'godClickGGThreshold', 'god_click_gg_cost', 'god_click_gg_threshold', 'perClick', 'per_click', 1e33, 1e33),

    sellAutoUpgrade: () => get().sellUpgrade('autoUpgradeCost', 'autoUpgradeCost', 'auto_upgrade_cost', 'auto_upgrade_cost', 'perSecond', 'per_second', 2, 100),
    sellAuto500k: () => get().sellUpgrade('auto500kCost', 'auto500kThreshold', 'auto_500k_cost', 'auto_500k_threshold', 'perSecond', 'per_second', 500000, 50000000),
    sellAuto1m: () => get().sellUpgrade('auto1mCost', 'auto1mThreshold', 'auto_1m_cost', 'auto_1m_threshold', 'perSecond', 'per_second', 1000000, 100000000),
    sellAuto10m: () => get().sellUpgrade('auto10mCost', 'auto10mThreshold', 'auto_10m_cost', 'auto_10m_threshold', 'perSecond', 'per_second', 10000000, 1000000000),
    sellAuto100m: () => get().sellUpgrade('auto100mCost', 'auto100mThreshold', 'auto_100m_cost', 'auto_100m_threshold', 'perSecond', 'per_second', 100000000, 10000000000),
    sellAuto1b: () => get().sellUpgrade('auto1bCost', 'auto1bThreshold', 'auto_1b_cost', 'auto_1b_threshold', 'perSecond', 'per_second', 1000000000, 100000000000),
    sellAuto10b: () => get().sellUpgrade('auto10bCost', 'auto10bThreshold', 'auto_10b_cost', 'auto_10b_threshold', 'perSecond', 'per_second', 10000000000, 1000000000000),
    sellAuto100b: () => get().sellUpgrade('auto100bCost', 'auto100bThreshold', 'auto_100b_cost', 'auto_100b_threshold', 'perSecond', 'per_second', 100000000000, 10000000000000),

    sellAutoGodA: () => get().sellUpgrade('godAutoACost', 'godAutoAThreshold', 'god_auto_a_cost', 'god_auto_a_threshold', 'perSecond', 'per_second', 1e12, 1e12),
    sellAutoGodAA: () => get().sellUpgrade('godAutoAACost', 'godAutoAAThreshold', 'god_auto_aa_cost', 'god_auto_aa_threshold', 'perSecond', 'per_second', 1e15, 1e15),

    sellUltimateClick: async () => {
        const s = get(); if(s.ultimateClickCost <= 2500000) return;
        const prevCost = Math.ceil(s.ultimateClickCost / 4); const refund = Math.floor(prevCost / 2);
        const newScore = Math.floor(s.score + refund); const newPerClick = Math.floor(s.perClick / 3);
        const newThresh = Math.ceil(s.ultimateClickThreshold / 2);
        set({score:newScore, perClick:newPerClick, ultimateClickCost:prevCost, ultimateClickThreshold:newThresh});
        get().saveToDB({score:newScore, per_click:newPerClick, ultimate_click_cost:prevCost, ultimate_click_threshold:newThresh});
    },

    // OBJETS SPÉCIAUX
    buyCatUpgrade: async () => { const s = get(); if(s.score>=s.catUpgradeCost && !s.catBought){ const ns = Math.floor(s.score-s.catUpgradeCost); const nps = Math.floor(s.perSecond+10); set({score:ns, perSecond:nps, catBought:true}); get().saveToDB({score:ns, per_second:nps, cat_bought:true});}},
    buyCat2Upgrade: async () => { const s = get(); if(s.score>=s.cat2UpgradeCost && !s.cat2Bought){ const ns = Math.floor(s.score-s.cat2UpgradeCost); const nps = Math.floor(s.perSecond+50); set({score:ns, perSecond:nps, cat2Bought:true}); get().saveToDB({score:ns, per_second:nps, cat2_bought:true});}},
    buyCat3Upgrade: async () => { const s = get(); if(s.score>=s.cat3UpgradeCost && !s.cat3Bought){ const ns = Math.floor(s.score-s.cat3UpgradeCost); const nps = Math.floor(s.perSecond+10000); set({score:ns, perSecond:nps, cat3Bought:true}); get().saveToDB({score:ns, per_second:nps, cat3_bought:true});}},
    buyVolcan: async () => { const s = get(); if(s.score>=s.volcanCost && !s.volcanBought){ const ns = Math.floor(s.score-s.volcanCost); const nps = Math.floor(s.perSecond+30); set({score:ns, perSecond:nps, volcanBought:true}); get().saveToDB({score:ns, per_second:nps, volcan_bought:true});}},
    buyGoose: async () => { const s = get(); if(s.score>=s.gooseCost && !s.gooseBought){ const ns = Math.floor(s.score-s.gooseCost); const nps = Math.floor(s.perSecond+500); set({score:ns, perSecond:nps, gooseBought:true}); get().saveToDB({score:ns, per_second:nps, goose_bought:true});}},

    resetGame: async () => {
        const { gameState } = get();
        if (!gameState) return;
        const initialState = {
            score: 0, per_click: 1, per_second: 0,
            click_upgrade_cost: 50, auto_upgrade_cost: 100, cat_upgrade_cost: 250, cat2_upgrade_cost: 1000, cat3_upgrade_cost: 10000, volcan_cost: 5000, goose_cost: 50000,
            super_click_cost: 500000, click_500k_cost: 50000000, auto_500k_cost: 50000000, god_click_zz_cost: 1e90,
            cat_bought: false, cat2_bought: false, cat3_bought: false, volcan_bought: false, goose_bought: false, active_media: []
        };
        await supabase.from("game_state").update(initialState).eq("id", gameState.id);
        window.location.reload();
    },
}));

export default useStore;