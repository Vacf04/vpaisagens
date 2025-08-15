"use client";

import { useState } from "react";
import { useAuth } from "../../context/authContext";
import Input from "../forms/Input";
import Button from "../forms/Button";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { supabaseClient } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const { error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/login/registrar/criar-perfil",
      },
    });

    if (signUpError) {
      setMessage(signUpError.message);
    } else {
      setMessage(
        "Registro bem-sucedido! Por favor, verifique seu e-mail para confirmar sua conta."
      );
      setEmail("");
      setPassword("");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
        <label htmlFor="email">E-mail:</label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <label htmlFor="password">Senha:</label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrar"}
        </Button>
        {message && (
          <p
            style={{
              color: message.includes("Sucesso") ? "green" : "red",
              marginTop: "10px",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
