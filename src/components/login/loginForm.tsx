"use client";

import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import Input from "../forms/Input";
import Button from "../forms/Button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { supabaseClient } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/conta");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label htmlFor="email"></label>
      <Input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password"></label>
      <Input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: "red", fontSize: "0.9em" }}>{error}</p>}
      <Button type="submit">Logar</Button>
    </form>
  );
}
