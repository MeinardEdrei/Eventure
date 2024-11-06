'use client';

import Link from "next/link";

export default function Login() {

    const handleSubmit = () => {

    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Username"/>
                    <input placeholder="Password"/>
                    <button type="submit">Login</button>
                    <Link href='/Register'><p className="underline">Don't have an account?</p></Link>
                </form>
            </div>
        </div>
    )
}