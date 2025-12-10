import React, { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { formatNumber } from "../utils/format";

export default function Leaderboard() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            // On appelle la vue simplifiée
            const { data, error } = await supabase
                .from("leaderboard_view")
                .select("*")
                .order("rank", { ascending: true }) // Le tri est déjà fait, on suit le rang
                .limit(50);

            if (error) {
                console.error("Erreur leaderboard:", error);
            } else {
                setPlayers(data);
            }
            setLoading(false);
        };

        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 10000); // Refresh auto 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="page-full bg-leaderboard">
            <div className="game-card" style={{ maxWidth: '850px', width: '95%' }}>
                <h1 style={{ color: '#0984e3', marginBottom: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    🏆 Classement Mondial
                </h1>

                {loading ? (
                    <div style={{ padding: '20px', fontSize: '1.2rem', color: '#666' }}>Chargement des champions... ⏳</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', borderRadius: '10px', overflow: 'hidden' }}>
                            <thead>
                            <tr style={{ background: '#74b9ff', color: 'white' }}>
                                <th style={{ padding: '15px', textAlign: 'center', width: '60px' }}>#</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Joueur</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>🔥 Rebirths</th>
                                <th style={{ padding: '15px', textAlign: 'right' }}>Score</th>
                            </tr>
                            </thead>
                            <tbody>
                            {players.map((player) => {
                                // Style Top 3
                                let rankBadge = <span style={{fontWeight:'bold', color: '#777'}}>#{player.rank}</span>;
                                let rowStyle = { borderBottom: '1px solid #eee', background: 'white' };

                                if (player.rank === 1) {
                                    rankBadge = <span style={{fontSize:'1.5rem'}}>🥇</span>;
                                    rowStyle = { ...rowStyle, background: 'linear-gradient(90deg, rgba(255,215,0,0.2), white)', borderLeft: '5px solid gold' };
                                } else if (player.rank === 2) {
                                    rankBadge = <span style={{fontSize:'1.5rem'}}>🥈</span>;
                                    rowStyle = { ...rowStyle, background: 'linear-gradient(90deg, rgba(192,192,192,0.2), white)', borderLeft: '5px solid silver' };
                                } else if (player.rank === 3) {
                                    rankBadge = <span style={{fontSize:'1.5rem'}}>🥉</span>;
                                    rowStyle = { ...rowStyle, background: 'linear-gradient(90deg, rgba(205,127,50,0.2), white)', borderLeft: '5px solid #cd7f32' };
                                }

                                return (
                                    <tr key={player.rank} style={rowStyle}>
                                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                                            {rankBadge}
                                        </td>

                                        <td style={{ padding: '12px', fontWeight: '600', color: '#2d3436' }}>
                                            {/* On affiche directement player.username, plus besoin de player.profiles... */}
                                            {player.username || "Anonyme"}
                                        </td>

                                        {/* Badge Rebirth */}
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            {player.rebirth_count > 0 ? (
                                                <div style={{
                                                    display: 'inline-block',
                                                    background: 'linear-gradient(45deg, #2c3e50, #000)',
                                                    color: 'gold',
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.9em',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                                }}>
                                                    ★ {player.rebirth_count}
                                                </div>
                                            ) : (
                                                <span style={{ color: '#ccc' }}>-</span>
                                            )}
                                        </td>

                                        <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace', fontSize: '1.1em', color: '#0984e3' }}>
                                            {formatNumber(player.score)}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}