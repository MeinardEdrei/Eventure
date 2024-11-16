"use client";
import "../css/Login-Signup.css";
import {
  ComboBox,
  Label,
  Input,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
} from "react-aria-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";

const departments = [
  { id: "ccis", name: "CCIS - College of Computing and Information Sciences" },
  { id: "cthm", name: "CTHM - College of Tourism and Hospitality Management" },
  { id: "ion", name: "ION - Institute of Nursing" },
  { id: "cite", name: "CITE - College of Information Technology Education" },
  { id: "chk", name: "CHK - College of Human Kinetics" },
  { id: "hsu", name: "HSU - Higher School ng UMak" },
];

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [status, setStatus] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { username, email, password, status, department: selectedDepartment },
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
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="LogIn flex flex-col items-center justify-center">
      <div className="Main-cntr flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit}>
          <h1 className="title1">Register Account</h1>
          <div className="input-cntr">
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
            <div>
              <input className="text-black" placeholder="Student Number" />
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

            <div className="dropdown-container">
              <ComboBox
                selectedKey={selectedDepartment}
                onSelectionChange={setSelectedDepartment}
                onOpenChange={setIsOpen}
              >
                <div className="input-button-container">
                  <Input placeholder="Select Department" />
                  <Button
                    className={`chevron-button ${isOpen ? "rotate" : ""}`}
                  >
                    <ChevronDown />
                  </Button>
                </div>

                <Popover>
                  <ListBox>
                    {departments.map((dept) => (
                      <ListBoxItem
                        key={dept.id}
                        id={dept.id}
                        textValue={dept.name}
                      >
                        {({ isSelected }) => (
                          <>
                            <span>{dept.name}</span>
                            {isSelected && <Check className="check-icon" />}
                          </>
                        )}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                </Popover>
              </ComboBox>
            </div>
            <button className="signup-btn" type="submit">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
