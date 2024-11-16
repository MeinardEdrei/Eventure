"use client";
import "../css/Login-Signup.css";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState("");
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.status === 200) {
        router.push("/");
        router.refresh();
      }else if (res.status == 400) {
        alert('Enter credentials')
      }else if (res.status == 404) {
        alert('No user found');
      }else if (res.status == 401) {
        alert('Invalid password');
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    }
  };

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
            <div className="password-container">
              <input
                className="text-black password-input"
                placeholder="Password"
                type={showPassword ? "text" : "password"} // Toggle type based on state
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="password-toggle">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)} // Toggle visibility
                />
                <div className="toggle-icon"></div>
              </label>
            </div>

            <button className="signup-btn" type="submit">
              Login
            </button>
            <Link href="/Register">
              <p className="underline">Don't have an account?</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
