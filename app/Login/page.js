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
  const [showPassword, setShowPassword] = useState(false);
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

      if (res?.error) {
        setError(res.error);
      } else if (res?.status === 200) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-[#1C1C1C]/40 p-8 rounded-2xl border border-[#F7F0FF]/10">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#F7F0FF] mb-2">Welcome Back</h2>
          <p className="text-[#F7F0FF]/60">Sign in to your account</p>
        </div>

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

            <div className="relative group">
              <input
                className="w-full bg-[#25152C]/30 text-[#F7F0FF] border border-[#F7F0FF]/10 rounded-lg px-4 py-3 outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#F7F0FF]/60 hover:text-[#F7F0FF] transition-colors duration-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: -1 }} />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-[#F7F0FF] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Sign in
          </button>

          <div className="flex flex-col items-center space-y-2 text-sm">
            <Link href="/Forgot-Password" className="text-[#F7F0FF]/50 hover:text-[#F7F0FF] transition-colors duration-200">
              Forgot password?
            </Link>
            <Link href="/Register" className="text-[#F7F0FF]/80 hover:text-[#F7F0FF] transition-colors duration-200">
              Don't have an account? <span className="underline">Sign up</span>
            </Link>
            <Link href="/" className="text-[#F7F0FF]/60 hover:text-[#F7F0FF] transition-colors duration-200">
              Return to Homepage
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}