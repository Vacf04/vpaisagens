"use client";

import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import Input from "../forms/Input";
import Button from "../forms/Button";
import Image from "next/image";
import LoginIllustration from "../../../public/login.svg";
import styles from "./LoginForm.module.css";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { supabaseClient } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
    setIsSubmitting(false);
  };

  return (
    <div className={styles.loginContent}>
      <form onSubmit={handleLogin}>
        <h1>Faça seu Login</h1>
        <label htmlFor="email">Email:</label>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <label htmlFor="password">Senha:</label>
        <Input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
        {error && (
          <p className="errorMessage" style={{ marginBottom: "1rem" }}>
            {error}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logando..." : "Logar"}
        </Button>
        <div className={styles.notCreated}>
          <p>Ainda não tem uma conta ?</p>
          <Link href={"/login/registrar"}>Crie agora</Link>
        </div>
      </form>
      <Image
        src={LoginIllustration}
        alt="Login Illustration"
        width={500}
        height={500}
      />
    </div>
  );
}
