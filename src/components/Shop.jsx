import React, { useState, useEffect } from "react";

export default function Shop({ score, setScore, perClick, setPerClick, perSecond, setPerSecond }) {
    const [clickUpgradeCost, setClickUpgradeCost] = useState(
        () => Number(localStorage.getItem("clickUpgradeCost")) || 50
    );
    const [autoUpgradeCost, setAutoUpgradeCost] = useState(
        () => Number(localStorage.getItem("autoUpgradeCost")) || 100
    );
    const [catUpgradeCost, setCatUpgradeCost] = useState(
        () => Number(localStorage.getItem("catUpgradeCost")) || 250
    );
    const [showCatGif, setShowCatGif] = useState(false);
    const [catBought, setCatBought] = useState(
        () => localStorage.getItem("catBought") === "true" || false
    );



    const buyClickUpgrade = () => {
        if (score >= clickUpgradeCost) {
            setScore(score - clickUpgradeCost);
            setPerClick(perClick + 1);
            setClickUpgradeCost(Math.floor(clickUpgradeCost * 1.5));
        }
    };

    const buyAutoUpgrade = () => {
        if (score >= autoUpgradeCost) {
            setScore(score - autoUpgradeCost);
            setPerSecond(perSecond + 1);
            setAutoUpgradeCost(Math.floor(autoUpgradeCost * 1.5));
        }
    };
    const buyCatUpgrade = () => {
        if (score >= catUpgradeCost) {
            setScore(score - catUpgradeCost);
            setPerSecond(perSecond + 10);
            setCatUpgradeCost(Math.floor(catUpgradeCost * 1.5));
            setShowCatGif(true);
            setCatBought(true);
            localStorage.setItem("catBought", "true"); // sauvegarde l’achat
        }
    };

    useEffect(() => {
        localStorage.setItem("clickUpgradeCost", clickUpgradeCost);
        localStorage.setItem("autoUpgradeCost", autoUpgradeCost);
        localStorage.setItem("catUpgradeCost", catUpgradeCost);
    }, [clickUpgradeCost, autoUpgradeCost, catUpgradeCost]);


    return (
        <div style={{ marginTop: "30px" }}>
            <p>Clic par clic : {perClick}</p>
            <p>Gain automatique par seconde : {perSecond}</p>

            <h3>Boutique</h3>

            <button onClick={buyClickUpgrade} disabled={score < clickUpgradeCost}>
                Augmenter le clic (+1) — {clickUpgradeCost} pts
            </button>

            <button onClick={buyAutoUpgrade} disabled={score < autoUpgradeCost} style={{ marginLeft: "10px" }}>
                Gain automatique (+1/sec) — {autoUpgradeCost} pts
            </button>

            {!catBought && score >= catUpgradeCost && (
                <button onClick={buyCatUpgrade}>
                    Gain gif chat (+10/sec) — {catUpgradeCost} pts
                </button>
            )}


            {(showCatGif || catBought) && (
                <img
                    src="/src/img/débile.gif"
                    alt="Chat mignon !"
                    style={{
                        width: "150px",
                        display: "block",
                        margin: "20px auto",
                        animation: showCatGif ? "bounce 0.5s" : "none"
                    }}
                />
            )}






        </div>
    );
}
