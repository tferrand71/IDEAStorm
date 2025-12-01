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
            const load = async () => {
                try {
                    setLoading(true);
                    const data = await fetchLeaderboard();
                    setLeaderboardData(data);
                } catch (err) { console.error(err); } finally { setLoading(false); }
            };
            load();
        }
    }, [user]);

    return (
        <div className="page-full bg-leaderboard">
            <div className="game-card card-wide">
                <h2>🏆 Classement Mondial</h2>
                {loading ? <p>Chargement...</p> : leaderboardData && leaderboardData.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                            <tr>
                                <th>#</th><th>Joueur</th><th>Score</th><th>Clics/s</th><th>Pts/Clic</th>
                            </tr>
                            </thead>
                            <tbody>
                            {leaderboardData.map((item) => (
                                <tr key={item.rank} style={item.username === user?.email ? { background: '#ffe3e0', fontWeight: 'bold' } : {}}>
                                    <td>{item.rank}</td>
                                    <td>{item.username}</td>
                                    <td style={{ color: '#ff6f61' }}>{formatNumber(item.score)}</td>
                                    <td>{formatNumber(item.perSecond)}</td>
                                    <td>{formatNumber(item.perClick)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p>Classement vide.</p>}
            </div>
        </div>
    );
}