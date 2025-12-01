import supabase from '../lib/supabaseClient';

// Inscription
export async function signUp(username, password) {
    const { data, error } = await supabase
        .from('users')
        .insert([{ username, password_hash: password }])
        .select();
    if (error) throw error;
    return data[0];
}

// Connexion
export async function signIn(username, password) {
    const { data, error } = await supabase
        .from('users')
        .select('id, username, password_hash')
        .eq('username', username)
        .single();
    if (error) throw error;
    if(data.password_hash !== password) throw new Error('Mot de passe incorrect');

    const { data: gameData, error: gameError } = await supabase
        .from('game_state')
        .select('*')
        .eq('user_id', data.id)
        .single();
    if(gameError) throw gameError;

    return { user: data, gameState: gameData };
}

// --- NOUVELLE FONCTION LEADERBOARD (Via la Vue) ---
export async function fetchLeaderboard() {
    // On interroge directement la vue 'leaderboard' créée en SQL
    const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(10); // Top 10

    if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
    }

    // Plus besoin de "item.users.username", c'est direct "item.username"
    return data.map((item, index) => ({
        rank: index + 1,
        username: item.username || 'Inconnu',
        score: item.score,
        perSecond: item.per_second,
        perClick: item.per_click
    }));
}