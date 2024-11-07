'use client';

import axios from "axios";
import { useEffect, useState } from "react";

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // POST to localhost of dotnet
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password}, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert(res.data.message); 
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Registration failed");
        }
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input 
                        className="text-black"
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        className="text-black"
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        className="text-black"
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