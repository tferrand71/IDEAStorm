import React from "react";
import useStore from "../store/useStore";

export default function Shop() {
    const store = useStore();

    // Helper pour afficher une ligne : [ Bouton Achat (Gauche) ]   [ Bouton Vente (Droite) ]
    // On utilise une grid CSS pour aligner parfaitement les deux colonnes.
    const renderUpgradeRow = (label, cost, buyFn, sellFn, disabledBuy, sellDisabledCondition, buttonStyle = {}) => {
        // Si l'objet n'est pas encore visible (threshold pas atteint), on retourne null
        // Cette logique est gérée dans le render principal par les conditions store.score >= threshold

        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px', alignItems: 'center' }}>
                {/* COLONNE GAUCHE : ACHAT */}
                <button
                    className="upgrade-btn"
                    onClick={buyFn}
                    disabled={disabledBuy}
                    style={{ ...buttonStyle, width: '100%', margin: 0 }}
                >
                    <span>{label}</span>
                    <span style={{ fontSize: '0.8em' }}>{cost.toLocaleString()} pts</span>
                </button>

                {/* COLONNE DROITE : VENTE */}
                {/* Si on est au niveau de base (sellDisabledCondition = true), on cache le bouton ou on le grise */}
                {!sellDisabledCondition ? (
                    <button
                        onClick={sellFn}
                        style={{
                            width: '100%',
                            margin: 0,
                            padding: '10px',
                            background: 'rgba(255, 118, 117, 0.1)',
                            border: '1px solid #ff7675',
                            color: '#d63031',
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                        title="Vendre 1 niveau (Remboursement 50%)"
                    >
                        Vendre (-1)
                    </button>
                ) : (
                    <div style={{ textAlign: 'center', color: '#ccc', fontSize: '0.8rem', fontStyle: 'italic' }}>
                        (Rien à vendre)
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="page-full bg-shop">
            {/* Carte élargie pour accueillir les deux colonnes confortablement */}
            <div className="game-card" style={{ maxWidth: '800px', width: '95%' }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                    {/* TITRE MIS À JOUR */}
                    <h2>Boutique de Titouan</h2>
                    <button
                        onClick={store.toggleMedia}
                        style={{ padding: "8px 16px", fontSize: "0.8rem", borderRadius: "20px", background: '#74b9ff', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        {store.showMedia ? "👁️ Effets" : "🚫 Effets"}
                    </button>
                </div>

                <div className="stats-box">
                    <div className="stats-row"><span>💰 Score</span> <b>{store.score.toLocaleString()}</b></div>
                    <div className="stats-row"><span>👆 / Clic</span> <b>{store.perClick.toLocaleString()}</b></div>
                    <div className="stats-row"><span>⏱️ / Sec</span> <b>{store.perSecond.toLocaleString()}</b></div>
                </div>

                {/* EN-TÊTES DES COLONNES */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                    <h3 style={{ margin: 0, color: '#ff7675' }}>ACHATS 🛒</h3>
                    <h3 style={{ margin: 0, color: '#d63031' }}>VENTES 💰</h3>
                </div>

                {/* === CLICS === */}
                <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ textAlign: 'left', color: '#555', marginTop: '0' }}>Améliorations Clics</h4>

                    {renderUpgradeRow("👆 +1 Clic", store.clickUpgradeCost, store.buyClickUpgrade, store.sellClickUpgrade, store.score < store.clickUpgradeCost, store.clickUpgradeCost <= 50)}

                    {store.score >= store.superClickThreshold &&
                        renderUpgradeRow("🌟 Super (+10k)", store.superClickCost, store.buySuperClick, store.sellSuperClick, store.score < store.superClickCost, store.superClickCost <= 500000, { borderColor: '#ffd700', background: 'rgba(255, 215, 0, 0.1)' })}

                    {store.score >= store.megaClickThreshold &&
                        renderUpgradeRow("🔥 Méga (+100k)", store.megaClickCost, store.buyMegaClick, store.sellMegaClick, store.score < store.megaClickCost, store.megaClickCost <= 5000000, { borderColor: '#ff4757', background: 'rgba(255, 71, 87, 0.1)' })}

                    {store.score >= store.gigaClickThreshold &&
                        renderUpgradeRow("🚀 Giga (+200k)", store.gigaClickCost, store.buyGigaClick, store.sellGigaClick, store.score < store.gigaClickCost, store.gigaClickCost <= 20000000, { borderColor: '#2ed573', background: 'rgba(46, 213, 115, 0.1)' })}

                    {/* High Level Clics */}
                    {store.score >= store.click500kThreshold && renderUpgradeRow("💎 +500k", store.click500kCost, store.buy500k, store.sell500k, store.score < store.click500kCost, store.click500kCost <= 50000000, { borderColor: '#1e90ff', background: 'rgba(30, 144, 255, 0.1)' })}
                    {store.score >= store.click1mThreshold && renderUpgradeRow("💎 +1M", store.click1mCost, store.buy1m, store.sell1m, store.score < store.click1mCost, store.click1mCost <= 100000000, { borderColor: '#3742fa', background: 'rgba(55, 66, 250, 0.1)' })}
                    {store.score >= store.click10mThreshold && renderUpgradeRow("💎 +10M", store.click10mCost, store.buy10m, store.sell10m, store.score < store.click10mCost, store.click10mCost <= 1000000000, { borderColor: '#5352ed', background: 'rgba(83, 82, 237, 0.1)' })}
                    {store.score >= store.click100mThreshold && renderUpgradeRow("💎 +100M", store.click100mCost, store.buy100m, store.sell100m, store.score < store.click100mCost, store.click100mCost <= 10000000000, { borderColor: '#70a1ff', background: 'rgba(112, 161, 255, 0.1)' })}
                    {store.score >= store.click1bThreshold && renderUpgradeRow("🪐 +1 Mrd", store.click1bCost, store.buy1b, store.sell1b, store.score < store.click1bCost, store.click1bCost <= 100000000000, { borderColor: '#ff6b81', background: 'rgba(255, 107, 129, 0.1)' })}
                    {store.score >= store.click10bThreshold && renderUpgradeRow("🪐 +10 Mrd", store.click10bCost, store.buy10b, store.sell10b, store.score < store.click10bCost, store.click10bCost <= 1000000000000, { borderColor: '#ff4757', background: 'rgba(255, 71, 87, 0.1)' })}
                    {store.score >= store.click100bThreshold && renderUpgradeRow("⚫ +100 Mrd", store.click100bCost, store.buy100b, store.sell100b, store.score < store.click100bCost, store.click100bCost <= 10000000000000, { borderColor: '#2f3542', background: 'rgba(47, 53, 66, 0.1)' })}
                </div>

                {/* === AUTO === */}
                <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ textAlign: 'left', color: '#555', marginTop: '0' }}>Automatisation</h4>

                    {renderUpgradeRow("🔄 +2 Auto", store.autoUpgradeCost, store.buyAutoUpgrade, store.sellAutoUpgrade, store.score < store.autoUpgradeCost, store.autoUpgradeCost <= 100)}

                    {store.score >= store.auto500kThreshold && renderUpgradeRow("⚙️ +500k Auto", store.auto500kCost, store.buyAuto500k, store.sellAuto500k, store.score < store.auto500kCost, store.auto500kCost <= 50000000, { borderColor: '#74b9ff', background: 'rgba(116, 185, 255, 0.1)' })}
                    {store.score >= store.auto1mThreshold && renderUpgradeRow("🏭 +1M Auto", store.auto1mCost, store.buyAuto1m, store.sellAuto1m, store.score < store.auto1mCost, store.auto1mCost <= 100000000, { borderColor: '#0984e3', background: 'rgba(9, 132, 227, 0.1)' })}
                    {store.score >= store.auto10mThreshold && renderUpgradeRow("🏭 +10M Auto", store.auto10mCost, store.buyAuto10m, store.sellAuto10m, store.score < store.auto10mCost, store.auto10mCost <= 1000000000, { borderColor: '#6c5ce7', background: 'rgba(108, 92, 231, 0.1)' })}
                    {store.score >= store.auto100mThreshold && renderUpgradeRow("🏭 +100M Auto", store.auto100mCost, store.buyAuto100m, store.sellAuto100m, store.score < store.auto100mCost, store.auto100mCost <= 10000000000, { borderColor: '#a29bfe', background: 'rgba(162, 155, 254, 0.1)' })}
                    {store.score >= store.auto1bThreshold && renderUpgradeRow("🤖 +1 Mrd Auto", store.auto1bCost, store.buyAuto1b, store.sellAuto1b, store.score < store.auto1bCost, store.auto1bCost <= 100000000000, { borderColor: '#fd79a8', background: 'rgba(253, 121, 168, 0.1)' })}
                    {store.score >= store.auto10bThreshold && renderUpgradeRow("🤖 +10 Mrd Auto", store.auto10bCost, store.buyAuto10b, store.sellAuto10b, store.score < store.auto10bCost, store.auto10bCost <= 1000000000000, { borderColor: '#e84393', background: 'rgba(232, 67, 147, 0.1)' })}
                    {store.score >= store.auto100bThreshold && renderUpgradeRow("🧠 +100 Mrd Auto", store.auto100bCost, store.buyAuto100b, store.sellAuto100b, store.score < store.auto100bCost, store.auto100bCost <= 10000000000000, { borderColor: '#2d3436', background: 'rgba(45, 52, 54, 0.1)' })}
                </div>

                {/* === PUISSANCE === */}
                <h3 style={{ textAlign: 'left', marginBottom: '15px', color: '#a29bfe' }}>Puissance</h3>

                {/* Les multiplicateurs n'ont pas de bouton de vente pour simplifier, ou ils sont gérés différemment. Ici je les laisse en pleine largeur ou je peux utiliser renderUpgradeRow sans vente si souhaité. Pour garder la grille, je vais utiliser une div qui prend 2 colonnes ou juste la colonne achat. */}

                {store.score >= store.multX2Threshold && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px' }}>
                        <button className="upgrade-btn" onClick={store.buyMultX2} disabled={store.score < store.multX2Cost} style={{ background: 'linear-gradient(45deg, #000, #444)', color: 'white', gridColumn: '1 / span 2' }}>
                            <span>⚡ <b>Double Clic (x2)</b></span> <span>{store.multX2Cost.toLocaleString()} pts</span>
                        </button>
                    </div>
                )}

                {store.score >= store.autoMultX2Threshold && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px' }}>
                        <button className="upgrade-btn" onClick={store.buyAutoMultX2} disabled={store.score < store.autoMultX2Cost} style={{ background: 'linear-gradient(45deg, #2d3436, #636e72)', color: 'white', gridColumn: '1 / span 2' }}>
                            <span>⚡ <b>Double Auto (x2)</b></span> <span>{store.autoMultX2Cost.toLocaleString()} pts</span>
                        </button>
                    </div>
                )}

                {store.score >= store.ultimateClickThreshold &&
                    renderUpgradeRow("🌌 Ultimate (x3)", store.ultimateClickCost, store.buyUltimateClick, store.sellUltimateClick, store.score < store.ultimateClickCost, store.ultimateClickCost <= 2500000, { background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)', color: 'white' })
                }

                {/* === OBJETS SPÉCIAUX === */}
                <br />
                <h3 style={{ textAlign: 'left', marginBottom: '15px', marginTop: '10px', color: '#333' }}>Compagnons</h3>

                {/* Les compagnons sont uniques, pas de vente "par niveau" */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {!store.catBought ? (
                        <button className="upgrade-btn" onClick={store.buyCatUpgrade} disabled={store.score < store.catUpgradeCost}>
                            <span>🐱 Chat (+10/s)</span> <span>{store.catUpgradeCost} pts</span>
                        </button>
                    ) : <div className="upgrade-btn" style={{opacity: 0.7, justifyContent: 'center', background: '#e0e0e0'}}>✅ Chat acquis</div>}

                    {!store.cat2Bought ? (
                        <button className="upgrade-btn" onClick={store.buyCat2Upgrade} disabled={store.score < store.cat2UpgradeCost}>
                            <span>😼 Chat Ninja (+50/s)</span> <span>{store.cat2UpgradeCost} pts</span>
                        </button>
                    ) : <div className="upgrade-btn" style={{opacity: 0.7, justifyContent: 'center', background: '#e0e0e0'}}>✅ Chat Ninja acquis</div>}

                    {!store.cat3Bought ? (
                        <button className="upgrade-btn" onClick={store.buyCat3Upgrade} disabled={store.score < store.cat3UpgradeCost}>
                            <span>👑 Roi Chat (+10k/s)</span> <span>{store.cat3UpgradeCost.toLocaleString()} pts</span>
                        </button>
                    ) : <div className="upgrade-btn" style={{opacity: 0.7, justifyContent: 'center', background: '#e0e0e0'}}>✅ Roi Chat acquis</div>}

                    {!store.volcanBought ? (
                        <button className="upgrade-btn" onClick={store.buyVolcan} disabled={store.score < store.volcanCost}>
                            <span>🌋 Volcan (+30/s)</span> <span>{store.volcanCost.toLocaleString()} pts</span>
                        </button>
                    ) : <div className="upgrade-btn" style={{opacity: 0.7, justifyContent: 'center', background: '#e0e0e0'}}>✅ Volcan acquis</div>}
                </div>

                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button className="reset-btn" onClick={store.resetGame}>
                        🗑️ Réinitialiser la partie
                    </button>
                </div>
            </div>
        </div>
    );
}