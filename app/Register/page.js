"use client";
import "../css/Login-Signup.css";

// import for radio buttons 
import { Label, Radio, RadioGroup } from "react-aria-components"; 
import CheckCircleIcon from "@spectrum-icons/workflow/CheckmarkCircle";
// import for dropdown
// import {Button, Label, ListBox, ListBoxItem, Popover, Select, SelectValue} from 'react-aria-components';

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
    <div className="LogIn flex flex-col items-center justify-center">
      <div className="Main-cntr flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit}>
          <h1 className="title1">Welcome!</h1>
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
            <input
              className="text-black"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <RadioGroupExample />
            <button type="submit">Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );

function RadioGroupExample() {
  return (
    <div className="usertype-container">
      <Label className="textUsertype">User Type:</Label>
      <RadioGroup className="radio-group">
        <div className="userOptions-container">
          <UserOptions name="Student" />
          <UserOptions name="Organizer" />
          {/* <UserOptions name="Admin" /> */}
        </div>
      </RadioGroup>
    </div>
  );
}

function UserOptions({ name }) {
  return (
    <Radio
      value={name}
      className={({ isFocusVisible, isSelected, isPressed }) => `
        users-options
        ${isFocusVisible ? "focus-visible" : ""}
        ${isSelected ? "selected" : ""}
        ${isPressed && !isSelected ? "pressed" : ""}
      `}
    >
      <div className="radio-button">
        <div className="icon-container">
          <CheckCircleIcon />
        </div>
        <div className="text-container">
          <div className="option-text">{name}</div>
        </div>
      </div>
    </Radio>
  );
}





}
