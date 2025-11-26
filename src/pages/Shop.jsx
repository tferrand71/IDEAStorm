import React from "react";
import useStore from "../store/useStore";

export default function Shop() {
    const {
        score,
        perClick,
        perSecond,
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
        buyClickUpgrade,
        buyAutoUpgrade,
        buyCatUpgrade,
        buyCat2Upgrade,
        buyCat3Upgrade,
        buyVolcan,
        resetGame,
        superClickCost,
        superClickThreshold,
        buySuperClick,

        // Nouveaux Upgrades
        megaClickCost,
        megaClickThreshold,
        buyMegaClick,
        gigaClickCost,
        gigaClickThreshold,
        buyGigaClick,

        ultimateClickCost,
        ultimateClickThreshold,
        buyUltimateClick,

        showMedia,
        toggleMedia
    } = useStore();

    return (
        <div className="page-full bg-shop">
            <div className="game-card">

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                    <h2>Boutique</h2>
                    <button
                        onClick={toggleMedia}
                        style={{ padding: "8px 16px", fontSize: "0.8rem", borderRadius: "20px" }}
                    >
                        {showMedia ? "👁️ Effets: ON" : "🚫 Effets: OFF"}
                    </button>
                </div>

                <div className="stats-box">
                    <div className="stats-row"><span>💰 Score actuel</span> <b>{score.toLocaleString()}</b></div>
                    <div className="stats-row"><span>👆 Par clic</span> <b>{perClick.toLocaleString()}</b></div>
                    <div className="stats-row"><span>⏱️ Par seconde</span> <b>{perSecond.toLocaleString()}</b></div>
                </div>

                <h3 style={{ textAlign: 'left', marginBottom: '15px' }}>Améliorations</h3>

                <button className="upgrade-btn" onClick={buyClickUpgrade} disabled={score < clickUpgradeCost}>
                    <span>👆 <b>+1 Clic</b></span>
                    <span>{clickUpgradeCost.toLocaleString()} pts</span>
                </button>

                <button className="upgrade-btn" onClick={buyAutoUpgrade} disabled={score < autoUpgradeCost}>
                    <span>🔄 <b>+2 Auto</b></span>
                    <span>{autoUpgradeCost.toLocaleString()} pts</span>
                </button>

                {/* SUPER CLIC */}
                {score >= superClickThreshold && (
                    <button
                        className="upgrade-btn"
                        onClick={buySuperClick}
                        disabled={score < superClickCost}
                        style={{ borderColor: '#ffd700', background: 'rgba(255, 215, 0, 0.1)' }}
                    >
                        <span>🌟 <b>Super Clic (+10k)</b></span>
                        <span>{superClickCost.toLocaleString()} pts</span>
                    </button>
                )}

                {/* MEGA CLIC (+100k) */}
                {score >= megaClickThreshold && (
                    <button
                        className="upgrade-btn"
                        onClick={buyMegaClick}
                        disabled={score < megaClickCost}
                        style={{ borderColor: '#ff4757', background: 'rgba(255, 71, 87, 0.1)' }}
                    >
                        <span>🔥 <b>Méga Clic (+100k)</b></span>
                        <span>{megaClickCost.toLocaleString()} pts</span>
                    </button>
                )}

                {/* GIGA CLIC (+200k) */}
                {score >= gigaClickThreshold && (
                    <button
                        className="upgrade-btn"
                        onClick={buyGigaClick}
                        disabled={score < gigaClickCost}
                        style={{ borderColor: '#2ed573', background: 'rgba(46, 213, 115, 0.1)' }}
                    >
                        <span>🚀 <b>Giga Clic (+200k)</b></span>
                        <span>{gigaClickCost.toLocaleString()} pts</span>
                    </button>
                )}

                {/* ULTIMATE CLIC */}
                {score >= ultimateClickThreshold && (
                    <button
                        className="upgrade-btn"
                        onClick={buyUltimateClick}
                        disabled={score < ultimateClickCost}
                        style={{ borderColor: '#a29bfe', background: 'rgba(162, 155, 254, 0.1)' }}
                    >
                        <span>🌌 <b>Ultimate (x3)</b></span>
                        <span>{ultimateClickCost.toLocaleString()} pts</span>
                    </button>
                )}

                <br />
                <h3 style={{ textAlign: 'left', marginBottom: '15px', marginTop: '10px' }}>Compagnons</h3>

                {!catBought ? (
                    <button className="upgrade-btn" onClick={buyCatUpgrade} disabled={score < catUpgradeCost}>
                        <span>🐱 Chat (+10/s)</span> <span>{catUpgradeCost} pts</span>
                    </button>
                ) : <div className="upgrade-btn" style={{opacity: 0.7}}>✅ Chat acquis</div>}

                {!cat2Bought ? (
                    <button className="upgrade-btn" onClick={buyCat2Upgrade} disabled={score < cat2UpgradeCost}>
                        <span>😼 Chat Ninja (+50/s)</span> <span>{cat2UpgradeCost} pts</span>
                    </button>
                ) : <div className="upgrade-btn" style={{opacity: 0.7}}>✅ Chat Ninja acquis</div>}

                {!cat3Bought ? (
                    <button className="upgrade-btn" onClick={buyCat3Upgrade} disabled={score < cat3UpgradeCost}>
                        <span>👑 Roi Chat (+10k/s)</span> <span>{cat3UpgradeCost.toLocaleString()} pts</span>
                    </button>
                ) : <div className="upgrade-btn" style={{opacity: 0.7}}>✅ Roi Chat acquis</div>}

                {!volcanBought ? (
                    <button className="upgrade-btn" onClick={buyVolcan} disabled={score < volcanCost}>
                        <span>🌋 Volcan (+30/s)</span> <span>{volcanCost.toLocaleString()} pts</span>
                    </button>
                ) : <div className="upgrade-btn" style={{opacity: 0.7}}>✅ Volcan acquis</div>}

                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button className="reset-btn" onClick={resetGame}>
                        🗑️ Réinitialiser la partie
                    </button>
                </div>
            </div>
        </div>
    );
}