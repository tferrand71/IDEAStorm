import React, { useState } from 'react';
import { signIn } from '../utils/api';
import useStore from '../store/useStore';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setUser = useStore(state => state.setUser);
    const setGameState = useStore(state => state.setGameState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { user, gameState } = await signIn(username, password);
            setUser(user);
            setGameState({
                score: gameState.score,
                perClick: gameState.per_click,
                perSecond: gameState.per_second,
                activeMedia: gameState.active_media
            });
        } catch(err) {
            alert(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
            <button type="submit">Se connecter</button>
        </form>
    );
}
