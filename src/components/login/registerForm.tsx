"use client";

import { useState } from "react";
import { useAuth } from "../../context/authContext";
import Input from "../forms/Input";
import Button from "../forms/Button";
import RegisterIllustration from "../../../public/login.svg";
import Image from "next/image";
import styles from "./RegisterForm.module.css";
import Link from "next/link";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { supabaseClient } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);
    if (password.trim() === confirmPassword.trim()) {
      const { error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:3000/login/registrar/criar-perfil",
        },
      });

      if (signUpError) {
        setMessage({ message: signUpError.message, type: "error" });
      } else {
        setMessage({
          message:
            "Registro bem-sucedido! Por favor, verifique seu e-mail para confirmar sua conta.",
          type: "success",
        });
        setEmail("");
        setPassword("");
      }
    } else {
      setMessage({ message: "As senhas precisam ser iguais!", type: "error" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.registerContent}>
      <form onSubmit={handleRegister}>
        <h1>Faça seu Registro</h1>
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
        <label htmlFor="password">Confirme a Senha:</label>
        <Input
          type="password"
          id="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
        {message && (
          <p
            className={
              message.type === "error" ? "errorMessage" : "successMessage"
            }
            style={{ marginBottom: "1rem" }}
          >
            {message.message}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrar"}
        </Button>
        <div className={styles.alreadyCreated}>
          <p>Já tem uma conta ?</p>
          <Link href={"/login"}>Faça o login</Link>
        </div>
      </form>
      <Image
        src={RegisterIllustration}
        alt="Register Illustration"
        width={500}
        height={500}
      />
    </div>
  );
}
