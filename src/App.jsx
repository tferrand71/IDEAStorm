import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ClickButton from "./components/ClickButton.jsx";
import Score from "./components/Score.jsx";
import Shop from "./pages/Shop.jsx";
import LoginForm from "./pages/LoginForm.jsx";
import SignupForm from "./pages/SignupForm.jsx";

import Header from "./components/Header.jsx";
import MediaOverlay from "./components/MediaOverlay.jsx";
import Snow from "./components/Snow.jsx";

import useStore from "./store/useStore.js";
import supabase from "./lib/supabaseClient.js";

export default function App() {
    const { score, perClick, perSecond, activeMedia, addScore, addPerSecond, user, setUser } = useStore();

    // Vérifie si l'utilisateur est connecté au démarrage
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

    // Gain automatique par seconde
    useEffect(() => {
        const interval = setInterval(() => addPerSecond(), 1000);
        return () => clearInterval(interval);
    }, [perSecond, addPerSecond]);

    return (
        <Router>
            <Snow />
            <MediaOverlay media={activeMedia} />
            <Header />

            <Routes>
                {/* PAGE JEU (HOME) */}
                <Route
                    path="/"
                    element={
                        user ? (
                            <div className="page-full bg-home">
                                <div className="game-card">
                                    <h1>IdeaStorm</h1>
                                    <Score score={score} />
                                    <p>Clic par clic : {perClick}</p>
                                    <p>Gain automatique par seconde : {perSecond}</p>
                                    <ClickButton onClick={() => addScore(perClick)} />
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* PAGE SHOP */}
                <Route path="/pages" element={user ? <Shop /> : <Navigate to="/login" />} />

                {/* PAGE LOGIN */}
                <Route
                    path="/login"
                    element={
                        user ? <Navigate to="/" /> : (
                            <div className="page-full bg-auth">
                                <div className="game-card">
                                    <LoginForm />
                                </div>
                            </div>
                        )
                    }
                />

                {/* PAGE SIGNUP */}
                <Route
                    path="/signup"
                    element={
                        user ? <Navigate to="/" /> : (
                            <div className="page-full bg-auth">
                                <div className="game-card">
                                    <SignupForm />
                                </div>
                            </div>
                        )
                    }
                />
            </Routes>
        </Router>
    );
}