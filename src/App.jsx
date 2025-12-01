import React, { useEffect } from "react";
// 1. CHANGEMENT ICI : On importe HashRouter au lieu de BrowserRouter
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ClickButton from "./components/ClickButton.jsx";
import Score from "./components/Score.jsx";
import Shop from "./pages/Shop.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import LoginForm from "./pages/LoginForm.jsx";
import SignupForm from "./pages/SignupForm.jsx";
import Header from "./components/Header.jsx";
import MediaOverlay from "./components/MediaOverlay.jsx";
import Snow from "./components/Snow.jsx";
import EasterEgg from "./components/EasterEgg.jsx";

import useStore from "./store/useStore.js";
import supabase from "./lib/supabaseClient.js";
import { formatNumber } from "./utils/format.js";

export default function App() {
    const { score, perClick, perSecond, activeMedia, addScore, addPerSecond, user, setUser, showMedia, hasSeenEnding, closeEasterEgg } = useStore();

    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) setUser(data.session.user);
        };
        fetchSession();
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) setUser(session.user); else setUser(null);
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => addPerSecond(), 1000);
        return () => clearInterval(interval);
    }, [perSecond, addPerSecond]);

    const END_GAME_THRESHOLD = 1e90;
    const showEnding = score >= END_GAME_THRESHOLD && !hasSeenEnding;

    return (
        // 2. CHANGEMENT ICI : On utilise <Router> tout court (qui est le HashRouter)
        // Plus besoin de 'basename' avec le HashRouter
        <Router>
            {showMedia && <Snow />}
            {showMedia && <MediaOverlay media={activeMedia} />}
            {showEnding && <EasterEgg score={score} onClose={closeEasterEgg} />}

            <Header />

            <Routes>
                <Route
                    path="/"
                    element={
                        user ? (
                            <div className="page-full bg-home">
                                <div className="game-card">
                                    <h1>IdeaStorm</h1>
                                    <Score score={score} />
                                    <p>Clic par clic : {formatNumber(perClick)}</p>
                                    <p>Gain automatique : {formatNumber(perSecond)} /s</p>
                                    <ClickButton onClick={() => addScore(perClick)} />
                                </div>
                            </div>
                        ) : <Navigate to="/login" />
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