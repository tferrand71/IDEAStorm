import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { fetchLeaderboard } from '../utils/api';
import { formatNumber } from '../utils/format';

export default function Leaderboard() {
    const { user } = useStore();
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const loadLeaderboard = async () => {
                try {
                    setLoading(true);
                    const data = await fetchLeaderboard();
                    setLeaderboardData(data);
                } catch (error) {
                    console.error("Erreur leaderboard:", error);
                } finally {
                    setLoading(false);
                }
            };
            loadLeaderboard();
        }
    }, [user]);

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
                                <th style={{width: '50px'}}>#</th>
                                <th>Utilisateur</th>
                                <th>Points</th>
                                <th>Clics/s</th>
                                <th>Pts/Clic</th>
                            </tr>
                            </thead>
                            <tbody>
                            {leaderboardData.map((item) => (
                                <tr key={item.rank}
                                    style={
                                        item.username === user?.user_metadata?.username || item.username === user?.email?.split('@')[0] || item.username === user?.email
                                            ? { background: 'rgba(255, 118, 117, 0.15)', fontWeight: 'bold' }
                                            : {}
                                    }
                                >
                                    <td style={{ textAlign: 'center' }}>
                                        {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                                    </td>
                                    <td>{item.username}</td>
                                    <td style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                        {formatNumber(item.score)}
                                    </td>
                                    <td>{formatNumber(item.perSecond)}</td>
                                    <td>{formatNumber(item.perClick)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Aucun classement disponible.</p>
                )}
            </div>
        </div>
    );
}