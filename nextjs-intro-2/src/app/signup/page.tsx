"use client";
import { signup } from "@/app/action/user";
import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const response = await signup(username, password);
    console.log(response);
    localStorage.setItem("token", response);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <div className="bg-white rounded-2xl border shadow-x1 p-10 max-w-lg">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="font-bold text-2xl text-gray-700 text-center">
            Signup
          </h1>
          <input
            value={username}
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 rounded-lg w-full h-12 px-4"
          />
          <input
            value={password}
            type="text"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 rounded-lg w-full h-12 px-4"
          />
          <button
            className="bg-red-400 text-white rounded-md hover:bg-red-500 font-semibold px-4 py-3 w-full"
            onClick={handleSignUp}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
