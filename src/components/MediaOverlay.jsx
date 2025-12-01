import React from "react";
import useStore from "../store/useStore";

// =========================================================
// IMPORTS (Noms exacts des fichiers)
// =========================================================
import chatDebile from "../img/débile.gif";
import chatMimir from "../img/mimir.mp4";
import chatSeducteur from "../img/séducteur.mp4";
import volcanPistolet from "../img/pistolet.mp4";
import oieGoose from "../img/goose.mp4";


export default function MediaOverlay() {
    const { catBought, cat2Bought, cat3Bought, volcanBought, gooseBought } = useStore();

    return (
        <div className="media-overlay-container" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 5, overflow: 'hidden'
        }}>

            {/* --- GAUCHE --- */}

            {/* 1. HAUT GAUCHE : Chat 3 (Roi) */}
            {cat3Bought && (
                <video
                    src={chatSeducteur}
                    autoPlay loop muted playsInline
                    style={{
                        position: 'absolute',
                        top: '120px', // Décalé pour éviter le Header
                        left: '20px',
                        width: '160px',
                        borderRadius: '50%',
                        border: '3px solid gold',
                        boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
                    }}
                />
            )}

            {/* 2. BAS GAUCHE : Chat 1 (Débile) */}
            {catBought && (
                <img
                    src={chatDebile}
                    alt="Chat Débile"
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        width: '130px'
                    }}
                />
            )}


            {/* --- DROITE --- */}

            {/* 3. HAUT DROITE : L'Oie */}
            {gooseBought && (
                <video
                    src={oieGoose}
                    autoPlay loop muted playsInline
                    style={{
                        position: 'absolute',
                        top: '120px', // Décalé pour le Header
                        right: '20px',
                        width: '140px',
                        borderRadius: '10px'
                    }}
                />
            )}

            {/* 4. MILIEU DROITE : Volcan (Pistolet) */}
            {/* Déplacé à droite pour ne pas gêner le chat roi ou débile à gauche */}
            {volcanBought && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)'
                }}>
                    <video
                        src={volcanPistolet}
                        autoPlay loop muted playsInline
                        style={{ width: '150px', borderRadius: '10px' }}
                    />
                </div>
            )}

            {/* 5. BAS DROITE : Chat 2 (Mimir) */}
            {cat2Bought && (
                <video
                    src={chatMimir}
                    autoPlay loop muted playsInline
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        width: '160px',
                        borderRadius: '10px'
                    }}
                />
            )}

        </div>
    );
}