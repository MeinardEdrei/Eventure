"use client";
import "../css/Login-Signup.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import {
  ComboBox,
  Label,
  Input,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
} from "react-aria-components";

const departments = [
  { id: "CCIS", name: "CCIS - College of Computing and Information Sciences" },
  { id: "CTHM", name: "CTHM - College of Tourism and Hospitality Management" },
  { id: "ION", name: "ION - Institute of Nursing" },
  { id: "CITE", name: "CITE - College of Information Technology Education" },
  { id: "CHK", name: "CHK - College of Human Kinetics" },
  { id: "HSU", name: "HSU - Higher School ng UMak" },
];

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [section, setSection] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [role, setRole] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("Approved");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { 
          username, 
          email, 
          password, 
          student_number: studentNumber, 
          status, 
          role, 
          department: selectedDepartment 
        },
        { headers: { "Content-Type": "application/json" } }
      );
      
      if (res.status === 200) {
        alert(res.data.message);
        router.push("/Login");
      } else {
        throw new Error(res.data.message || "Unknown error");
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-[#1C1C1C]/40 p-8 rounded-2xl border border-[#F7F0FF]/10">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#F7F0FF] mb-2">Create Account</h2>
          <p className="text-[#F7F0FF]/60">Join our community</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
          <div className="relative group">
              <input 
                className="w-full bg-[#25152C]/30 text-[#F7F0FF] border border-[#F7F0FF]/10 rounded-lg px-4 py-3 outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                placeholder="Student Number" 
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: -1 }} />
            </div>

            <div className="relative group">
              <input
                className="w-full bg-[#25152C]/30 text-[#F7F0FF] border border-[#F7F0FF]/10 rounded-lg px-4 py-3 outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                placeholder="Full Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: -1 }} />
            </div>

            <div className="relative group">
              <input 
                className="w-full bg-[#25152C]/30 text-[#F7F0FF] border border-[#F7F0FF]/10 rounded-lg px-4 py-3 outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                placeholder="Section" 
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: -1 }} />
            </div>

            <div className="relative group">
              <input
                className="w-full bg-[#25152C]/30 text-[#F7F0FF] border border-[#F7F0FF]/10 rounded-lg px-4 py-3 outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                pattern="[a-zA-Z0-9._%+-]+@umak\.edu\.ph"
                title="Please use your UMAK email"
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: -1 }} />
            </div>

            <div className="relative group">
              <div className="relative">
                <input
                  className="w-full bg-[#25152C]/30 text-[#F7F0FF] border border-[#F7F0FF]/10 rounded-lg px-4 py-3 outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
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
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: -1 }} />
            </div>

            <div className="relative group">
              <ComboBox
                selectedKey={selectedDepartment}
                onSelectionChange={setSelectedDepartment}
                onOpenChange={setIsOpen}
              >
                <div className="input-button-container relative">
                  <Input 
                    placeholder="Select Department" 
                    className="w-full bg-[#25152C]/30 text-[#F7F0FF] border border-[#F7F0FF]/10 rounded-lg px-4 py-3 outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                  />
                  <Button
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-[#F7F0FF]/60 hover:text-[#F7F0FF] transition-colors duration-200 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <ChevronDown />
                  </Button>
                </div>

                <Popover className="bg-[#1C1C1C] border border-[#F7F0FF]/10 rounded-lg shadow-xl">
                  <ListBox className="p-1">
                    {departments.map((dept) => (
                      <ListBoxItem
                        key={dept.id}
                        id={dept.id}
                        textValue={dept.name}
                        className="px-3 py-2 hover:bg-[#25152C]/50 rounded-md cursor-pointer flex justify-between items-center"
                      >
                        {({ isSelected }) => (
                          <>
                            <span className="text-[#F7F0FF]">{dept.name}</span>
                            {isSelected && <Check className="text-[#F7F0FF]" />}
                          </>
                        )}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                </Popover>
              </ComboBox>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: -1 }} />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-[#F7F0FF] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Register
          </button>

          <div className="flex flex-col items-center space-y-2 text-sm">
            <Link href="/Login" className="text-[#F7F0FF]/80 hover:text-[#F7F0FF] transition-colors duration-200">
              Already have an account? <span className="underline">Sign in</span>
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