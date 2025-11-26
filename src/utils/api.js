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

// --- RÉCUPÉRATION DU CLASSEMENT COMPLET ---
export async function fetchLeaderboard() {
    const { data, error } = await supabase
        .from('game_state')
        // On récupère le score, clics/s (per_second), pts/clic (per_click) et le pseudo
        .select('score, per_second, per_click, users(username)')
        .order('score', { ascending: false })
        .limit(10);

    if (error) throw error;

    // Formatage des données pour le composant
    return data.map((item, index) => ({
        rank: index + 1,
        score: item.score,
        perSecond: item.per_second,
        perClick: item.per_click,
        // Sécurité si l'utilisateur a été supprimé
        username: item.users ? item.users.username : 'Utilisateur inconnu',
    }));
}