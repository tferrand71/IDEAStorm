import React, { useState } from 'react';
import { signUp } from '../utils/api';
import useStore from '../store/useStore';

export default function SignUpForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setUser = useStore(state => state.setUser);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await signUp(username, password);
            setUser(user);
        } catch(err) {
            alert(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
            <button type="submit">S'inscrire</button>
        </form>
    );
}
