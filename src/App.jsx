import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ClickButton from "./components/ClickButton.jsx";
import Score from "./components/Score.jsx";
import Shop from "./pages/Shop.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import LoginForm from "./pages/LoginForm.jsx";
import SignupForm from "./pages/SignupForm.jsx";

import Header from "./components/Header.jsx";
import MediaOverlay from "./components/MediaOverlay.jsx";
import Snow from "./components/Snow.jsx";

import useStore from "./store/useStore.js";
import supabase from "./lib/supabaseClient.js";

// Import pour le formatage
import { formatNumber } from "./utils/format.js";

export default function App() {
    const { score, perClick, perSecond, activeMedia, addScore, addPerSecond, user, setUser, showMedia } = useStore();

    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) setUser(data.session.user);
        };
        fetchSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) setUser(session.user);
            else setUser(null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => addPerSecond(), 1000);
        return () => clearInterval(interval);
    }, [perSecond, addPerSecond]);

    return (
        <Router>
            {showMedia && <Snow />}
            {showMedia && <MediaOverlay media={activeMedia} />}

            <Header />

            <Routes>
                <Route
                    path="/"
                    element={
                        user ? (
                            <div className="page-full bg-home">
                                <div className="game-card">
                                    <h1>IdeaStorm</h1>
                                    {/* Le composant Score utilise déjà formatNumber à l'intérieur */}
                                    <Score score={score} />

                                    {/* Utilisation de formatNumber ici */}
                                    <p>Clic par clic : {formatNumber(perClick)}</p>
                                    <p>Gain automatique : {formatNumber(perSecond)} /s</p>

                                    <ClickButton onClick={() => addScore(perClick)} />
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="/pages" element={user ? <Shop /> : <Navigate to="/login" />} />
                <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" />} />
                <Route path="/login" element={user ? <Navigate to="/" /> : (<div className="page-full bg-auth"><div className="game-card"><LoginForm /></div></div>)} />
                <Route path="/signup" element={user ? <Navigate to="/" /> : (<div className="page-full bg-auth"><div className="game-card"><SignupForm /></div></div>)} />
            </Routes>
        </Router>
    );
}