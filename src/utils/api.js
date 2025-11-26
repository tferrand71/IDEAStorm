import supabase from '../lib/supabaseClient';

// Inscription
export async function signUp(username, password) {
    const { data, error } = await supabase
        .from('users')
        .insert([{ username, password_hash: password }])
        .select();
    if (error) throw error;
    const userId = data[0].id;
    await supabase.from('game_state').insert([{ user_id: userId }]);
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
