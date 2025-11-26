import React, { useState } from "react";
import useStore from "../store/useStore";
import supabase from "../lib/supabaseClient";

export default function Auth() {
    const { setUser, setGameState } = useStore();
    const [mode, setMode] = useState("login"); // "login" ou "signup"
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");
        const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .eq("password", password)
            .single();

        if (error || !userData) {
            setError("Utilisateur ou mot de passe incorrect");
            return;
        }

        setUser(userData);

        // Récupère l'état du jeu
        const { data: gameData, error: gameError } = await supabase
            .from("game_state")
            .select("*")
            .eq("user_id", userData.id)
            .single();

        if (!gameError && gameData) {
            setGameState({
                score: gameData.score,
                perClick: gameData.per_click,
                perSecond: gameData.per_second,
                activeMedia: gameData.active_media || [],
                catBought: gameData.cat_bought,
                cat2Bought: gameData.cat2_bought,
                cat3Bought: gameData.cat3_bought,
                volcanBought: gameData.volcan_bought,
                clickUpgradeCost: gameData.click_upgrade_cost,
                autoUpgradeCost: gameData.auto_upgrade_cost,
                catUpgradeCost: gameData.cat_upgrade_cost,
                cat2UpgradeCost: gameData.cat2_upgrade_cost,
                cat3UpgradeCost: gameData.cat3_upgrade_cost,
                volcanCost: gameData.volcan_cost,
            });
        }
    };

    const handleSignup = async () => {
        setError("");

        // Vérifie si username existe déjà
        const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .single();

        if (existingUser) {
            setError("Nom d'utilisateur déjà pris");
            return;
        }

        const { data: newUser, error } = await supabase
            .from("users")
            .insert([{ username, password }])
            .select()
            .single();

        if (error) {
            setError("Erreur lors de l'inscription");
            return;
        }

        // Crée un état de jeu vide pour ce user
        await supabase.from("game_state").insert([{
            user_id: newUser.id,
            score: 0,
            per_click: 1,
            per_second: 0,
            active_media: [],
            cat_bought: false,
            cat2_bought: false,
            cat3_bought: false,
            volcan_bought: false,
            click_upgrade_cost: 50,
            auto_upgrade_cost: 100,
            cat_upgrade_cost: 250,
            cat2_upgrade_cost: 1000,
            cat3_upgrade_cost: 10000,
            volcan_cost: 5000
        }]);

        setUser(newUser);
        setGameState({
            score: 0,
            perClick: 1,
            perSecond: 0,
            activeMedia: [],
            catBought: false,
            cat2Bought: false,
            cat3Bought: false,
            volcanBought: false,
            clickUpgradeCost: 50,
            autoUpgradeCost: 100,
            catUpgradeCost: 250,
            cat2UpgradeCost: 1000,
            cat3UpgradeCost: 10000,
            volcanCost: 5000,
        });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{mode === "login" ? "Connexion" : "Inscription"}</h2>

            <input
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br /><br />
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />
            {error && <p style={{ color: "red" }}>{error}</p>}
            {mode === "login" ? (
                <>
                    <button onClick={handleLogin}>Se connecter</button>
                    <p>
                        Pas de compte ?{" "}
                        <span
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={() => setMode("signup")}
                        >
              S'inscrire
            </span>
                    </p>
                </>
            ) : (
                <>
                    <button onClick={handleSignup}>S'inscrire</button>
                    <p>
                        Déjà un compte ?{" "}
                        <span
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={() => setMode("login")}
                        >
              Se connecter
            </span>
                    </p>
                </>
            )}
        </div>
    );
}
