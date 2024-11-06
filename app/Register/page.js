'use client';

import axios from "axios";
import { useEffect, useState } from "react";

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [role, setRole] = useState('');
    // const [approved, setApproved] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const res = await axios.post('/api/register', { username, email, password });
        
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input 
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Sign up</button>
                </form>
            </div>
        </div>
    )
}