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
        // Coûts
        clickUpgradeCost,
        autoUpgradeCost,
        catUpgradeCost,
        cat2UpgradeCost,
        cat3UpgradeCost,
        volcanCost,
        // États d'achat
        catBought,
        cat2Bought,
        cat3Bought,
        volcanBought,
        // Actions d'achat
        buyClickUpgrade,
        buyAutoUpgrade,
        buyCatUpgrade,
        buyCat2Upgrade,
        buyCat3Upgrade,
        buyVolcan,
        resetGame,
    } = useStore();

    return (
        // Ajout des conteneurs pour le fond et le style "carte"
        <div className="page-full bg-shop">
            <div className="game-card" style={{ width: "500px", maxWidth: "95%" }}>
                <div style={{ marginTop: "10px" }}>
                    <h2>🏪 Boutique</h2>

                    {/* STATISTIQUES */}
                    <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20, borderRadius: "10px", background: "#f9f9f9" }}>
                        <h3>📊 Statistiques</h3>
                        <p><b>Score :</b> {score}</p>
                        <p><b>Par clic :</b> {perClick}</p>
                        <p><b>Par seconde :</b> {perSecond}</p>
                    </div>

                    {/* AMÉLIORATIONS */}
                    <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20, borderRadius: "10px" }}>
                        <h3>⚙️ Améliorations</h3>
                        <button
                            className="upgrade-btn"
                            onClick={buyClickUpgrade}
                            disabled={score < clickUpgradeCost}
                        >
                            🔼 +1 par clic — {clickUpgradeCost} pts
                        </button>
                        <br />
                        <button
                            className="upgrade-btn"
                            onClick={buyAutoUpgrade}
                            disabled={score < autoUpgradeCost}
                        >
                            🔄 +2 / sec — {autoUpgradeCost} pts
                        </button>
                    </div>

                    {/* OBJETS SPÉCIAUX */}
                    <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20, borderRadius: "10px" }}>
                        <h3>🐱 Objets spéciaux</h3>
                        {!catBought ? (
                            <button className="upgrade-btn" onClick={buyCatUpgrade} disabled={score < catUpgradeCost}>
                                🐱 Chat 1 (+10/sec) — {catUpgradeCost}
                            </button>
                        ) : <p>🐱 Chat 1 acheté ✔️</p>}

                        {!cat2Bought ? (
                            <button className="upgrade-btn" onClick={buyCat2Upgrade} disabled={score < cat2UpgradeCost}>
                                😼 Chat 2 (+50/sec) — {cat2UpgradeCost}
                            </button>
                        ) : <p>😼 Chat 2 acheté ✔️</p>}

                        {!cat3Bought ? (
                            <button className="upgrade-btn" onClick={buyCat3Upgrade} disabled={score < cat3UpgradeCost}>
                                👑 Chat 3 (+10k/sec) — {cat3UpgradeCost}
                            </button>
                        ) : <p>👑 Chat 3 acheté ✔️</p>}

                        {!volcanBought ? (
                            <button className="upgrade-btn" onClick={buyVolcan} disabled={score < volcanCost}>
                                🌋 Volcan (+150/5sec) — {volcanCost}
                            </button>
                        ) : <p>🌋 Volcan acheté ✔️</p>}
                    </div>

                    {/* VENTE - Placeholder */}
                    <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20, borderRadius: "10px", opacity: 0.6 }}>
                        <h3>💰 Vente (bientôt...)</h3>
                        <p>Tu pourras vendre tes objets ici.</p>
                    </div>

                    {/* RESET */}
                    <button
                        className="reset-btn"
                        onClick={resetGame}
                        style={{ padding: "10px", width: "100%" }}
                    >
                        🗑️ Reset du jeu
                    </button>
                </div>
            </div>
        </div>
    );
}