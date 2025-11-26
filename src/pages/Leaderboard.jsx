import React, { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data, error } = await supabase
                .from("game_state")
                .select(`
          score,
          per_click,
          per_second,
          users(username)
        `)
                .order("score", { ascending: false })
                .limit(10);

            if (error) console.error("Erreur leaderboard:", error);
            else setLeaderboard(data);
        };

        fetchLeaderboard();
    }, []);

    return (
        <div style={{ margin: "20px" }}>
            <h2>🏆 Leaderboard</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>#</th>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Username</th>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Score</th>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Clics/sec</th>
                </tr>
                </thead>
                <tbody>
                {leaderboard.map((user, index) => (
                    <tr key={index}>
                        <td style={{ padding: "10px" }}>{index + 1}</td>
                        <td style={{ padding: "10px" }}>{user.users.username}</td>
                        <td style={{ padding: "10px" }}>{user.score}</td>
                        <td style={{ padding: "10px" }}>{user.per_second}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
