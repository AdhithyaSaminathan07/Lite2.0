"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card p-6 rounded-lg shadow-md w-96 space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-primary">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full px-3 py-2 border rounded-md"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 border rounded-md"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
}
