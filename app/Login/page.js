"use client";
import "../css/Login-Signup.css";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { data: session } = useSession();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false
            });
          
            if (res?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login');
        }

    }

  return (
    <div className="LogIn flex flex-col items-center justify-center">
      <div className="Main-cntr flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit}>
          <h1 className="title1">Welcome!</h1>
          <div className="input-cntr">
            <div>
              <input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
              />
            </div>
            <div>
              <input 
                  className="text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
              />
            </div>
            <button type="submit">Login</button>
            <Link href="/Register">
              <p className="underline">Don't have an account?</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
