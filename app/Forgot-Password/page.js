"use client";
import "../css/Login-Signup.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/user/forgot-password", 
        email,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (res.status === 200) {
        setMessage("A password reset code has been sent to your email.");
        router.push("/Reset-Password");
      }
    } catch (err) {
      console.error("Error sending reset code:", err);
      setError("An error occurred while sending the reset code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-[#1C1C1C]/40 p-8 rounded-2xl border border-[#F7F0FF]/10">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#F7F0FF] mb-2">Forgot Password</h2>
          <p className="text-[#F7F0FF]/60">Enter your email to receive a password reset code</p>
        </div>

        {message && (
          <div className="bg-green-900/20 border border-green-500/50 text-green-500 p-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <div className="relative group">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#25152C]/30 text-[#F7F0FF] border border-[#F7F0FF]/10 rounded-lg px-4 py-3 outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                  placeholder="Email"
                  required
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: -1 }} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-[#F7F0FF] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Send Reset Code
          </button>

          <div className="flex flex-col items-center space-y-2 text-sm">
            <Link href="/Login" className="text-[#F7F0FF]/60 hover:text-[#F7F0FF] transition-colors duration-200">
              Return to Log in
            </Link>
            <Link href="/" className="text-[#F 7F0FF]/60 hover:text-[#F7F0FF] transition-colors duration-200">
              Return to Homepage
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}