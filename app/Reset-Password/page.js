"use client";
import "../css/Login-Signup.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate that the new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/user/reset-password", 
        { Code: code, NewPassword: newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (res.status === 200) {
        setMessage("Your password has been reset successfully.");
        // Optionally redirect to login page after a successful reset
        setTimeout(() => {
          router.push("/Login");
        }, 2000);
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("An error occurred while resetting the password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-[#1C1C1C]/40 p-8 rounded-2xl border border-[#F7F0FF]/10">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#F7F0FF] mb-2">Reset Password</h2>
          <p className="text-[#F7F0FF]/60">Enter your reset code and new password</p>
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
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#25152C]/30 text-[#F7F0FF] border border-[#F7F0FF]/10 rounded-lg px-4 py-3 outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                  placeholder="Reset Code"
                  required
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: -1 }} />
              </div>
            </div>

            <div>
              <div className="relative group">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#25152C]/30 text-[#F7F0FF] border border-[#F7F0FF]/10 rounded-lg px-4 py-3 outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                  placeholder="New Password"
                  required
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: -1 }} />
              </div>
            </div>

            <div>
              <div className="relative group">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#25152C]/30 text-[#F7F0FF] border border-[#F7F0FF]/10 rounded-lg px-4 py-3 outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                  placeholder="Confirm Password"
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
            Reset Password
          </button>

          <div className="flex flex-col items-center space-y-2 text-sm">
            <Link href="/Login" className="text-[#F7F0FF]/60 hover:text-[#F7F0FF] transition-colors duration-200">
              Return to Log in
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