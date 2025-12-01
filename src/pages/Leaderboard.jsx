import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { fetchLeaderboard } from '../utils/api';
import { formatNumber } from '../utils/format'; // Assurez-vous que ce fichier existe !

export default function Leaderboard() {
    const { user } = useStore();
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On charge le classement dès que la page s'ouvre
        const loadLeaderboard = async () => {
            try {
                setLoading(true);
                const data = await fetchLeaderboard();
                setLeaderboardData(data);
            } catch (error) {
                console.error("Impossible de charger le classement:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadLeaderboard();
        }
    }, [user]); // Se recharge si l'utilisateur change (connexion/déconnexion)

    return (
        <div className="page-full bg-leaderboard">
            <div className="game-card card-wide">
                <h2>🏆 Classement Mondial</h2>

                {loading ? (
                    <p>Chargement des scores...</p>
                ) : leaderboardData && leaderboardData.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                            <tr>
                                <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                                <th>Joueur</th>
                                <th>Score Total</th>
                                <th>Clics / sec</th>
                                <th>Pts / Clic</th>
                            </tr>
                            </thead>
                            <tbody>
                            {leaderboardData.map((item) => {
                                // Vérifie si c'est la ligne du joueur connecté pour la mettre en valeur
                                const isMe = user && (
                                    item.username === user.user_metadata?.username ||
                                    item.username === user.email // Fallback si username n'est pas dans metadata
                                );

                                return (
                                    <tr key={item.rank}
                                        style={isMe ? { background: 'rgba(255, 118, 117, 0.2)', fontWeight: 'bold' } : {}}
                                    >
                                        <td style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                                            {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                                        </td>
                                        <td>
                                            {item.username}
                                            {isMe && <span style={{ fontSize: '0.8em', color: '#ff6f61', marginLeft: '5px' }}>(Toi)</span>}
                                        </td>
                                        <td style={{ color: '#ff6f61', fontWeight: 'bold' }}>
                                            {formatNumber(item.score)}
                                        </td>
                                        <td>{formatNumber(item.perSecond)}</td>
                                        <td>{formatNumber(item.perClick)}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: '20px', color: '#666' }}>
                        <p>Le classement est vide ou inaccessible.</p>
                        <p style={{ fontSize: '0.9rem' }}>Vérifiez votre connexion internet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}