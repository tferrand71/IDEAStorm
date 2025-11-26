import React from "react";
import useStore from "../store/useStore";

export default function Shop() {
    // -----------------------------
    //     RÉCUPÉRATION DU STORE
    // -----------------------------
    const {
        score,
        perClick,
        perSecond,
        activeMedia,
        clickUpgradeCost,
        autoUpgradeCost,
        catUpgradeCost,
        cat2UpgradeCost,
        cat3UpgradeCost,
        volcanCost,
        catBought,
        cat2Bought,
        cat3Bought,
        volcanBought,
        addScore,
        addPerClick,
        addPerSecond,
        setActiveMedia,
        buyClickUpgrade,
        buyAutoUpgrade,
        buyCatUpgrade,
        buyCat2Upgrade,
        buyCat3Upgrade,
        buyVolcan,
        resetGame,
    } = useStore();

    return (
        <div style={{ marginTop: "20px" }}>
            <h2>🏪 Boutique</h2>

            {/* STATISTIQUES */}
            <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>
                <h3>📊 Statistiques</h3>
                <p><b>Score :</b> {score}</p>
                <p><b>Par clic :</b> {perClick}</p>
                <p><b>Par seconde :</b> {perSecond}</p>
            </div>

            {/* AMÉLIORATIONS */}
            <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>
                <h3>⚙️ Améliorations</h3>
                <button onClick={buyClickUpgrade} disabled={score < clickUpgradeCost}>
                    🔼 +1 par clic — {clickUpgradeCost} pts
                </button>
                <br /><br />
                <button onClick={buyAutoUpgrade} disabled={score < autoUpgradeCost}>
                    🔄 +2 / sec — {autoUpgradeCost} pts
                </button>
            </div>

            {/* OBJETS SPÉCIAUX */}
            <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>
                <h3>🐱 Objets spéciaux</h3>
                {!catBought && (
                    <button onClick={buyCatUpgrade} disabled={score < catUpgradeCost}>
                        🐱 Chat 1 (+10/sec) — {catUpgradeCost}
                    </button>
                )}
                <br /><br />
                {!cat2Bought && (
                    <button onClick={buyCat2Upgrade} disabled={score < cat2UpgradeCost}>
                        😼 Chat 2 (+50/sec) — {cat2UpgradeCost}
                    </button>
                )}
                <br /><br />
                {!cat3Bought && (
                    <button onClick={buyCat3Upgrade} disabled={score < cat3UpgradeCost}>
                        👑 Chat 3 (+10k/sec) — {cat3UpgradeCost}
                    </button>
                )}
                <br /><br />
                {!volcanBought && (
                    <button onClick={buyVolcan} disabled={score < volcanCost}>
                        🌋 Volcan (+150/5sec) — {volcanCost}
                    </button>
                )}
                {volcanBought && <p>🌋 Volcan acheté ✔️</p>}
            </div>

            {/* VENTE - Placeholder */}
            <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>
                <h3>💰 Vente (bientôt...)</h3>
                <p>Tu pourras vendre tes objets ici.</p>
            </div>

            {/* RESET */}
            <button
                onClick={resetGame}
                style={{ padding: "10px", background: "red", color: "white" }}
            >
                🗑️ Reset du jeu
            </button>
        </div>
    );
}
