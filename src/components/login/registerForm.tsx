"use client";

import { useState } from "react";
import { useAuth } from "../../context/authContext"; // Seu caminho correto
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { supabaseClient, user } = useAuth();

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        padding: "20px",
      }}
    >
      <h2>Registrar Nova Conta</h2>
      <form
        onSubmit={handleRegister}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          width: "300px",
        }}
      >
        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrar"}
        </button>
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
