"use client";
import { useState } from "react";
import styles from "./CriarPerfilForm.module.css";
import { useAuth } from "@/context/authContext";
import { redirect } from "next/navigation";
import Input from "../forms/Input";
import { FaRegImage, FaUser } from "react-icons/fa";
import Image from "next/image";
import userCreate from "@/actions/user-create";
import Button from "../forms/Button";

export default function CriarPerfilForm() {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    if (!avatar || !username || !username.trim()) {
      setMessage({
        message: "Por favor, Preencha todos os campos",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    if (avatar && !avatar.type.startsWith("image/")) {
      setMessage({
        message: "Selecione uma imagem válida.",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }
    if (!user) {
      setMessage({
        message: "Usuário não autenticado.",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }
    try {
      const { data, error } = await userCreate(user.id, username, avatar);
      if (error) {
        throw new Error(error.message || "Ocorreu um erro desconhecido.");
      }

      if (data) {
        setMessage({
          message: "Perfil criado com sucesso, Vamos te redirecionar",
          type: "success",
        });
        setTimeout(() => {
          redirect("/conta");
        }, 1500);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (
          error.message ===
          'duplicate key value violates unique constraint "profiles_username_key"'
        ) {
          setMessage({
            message: "Nome de usuário já criado, tente outro!",
            type: "error",
          });
        } else {
          setMessage({
            message: error.message,
            type: "error",
          });
        }
      } else {
        setMessage({
          message: "Erro desconhecido",
          type: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }

    setIsSubmitting(false);
  };

  function handleImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null) {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewImageUrl(imageUrl);
        setAvatar(file);
      } else {
        setPreviewImageUrl(null);
        setAvatar(null);
      }
    }
  }

  return (
    <form onSubmit={handleProfileSubmit} className={styles.form}>
      <h1>Crie seu Perfil:</h1>
      <Input
        type="text"
        id="username"
        name="username"
        placeholder="Digite seu username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        disabled={isSubmitting}
      />
      <label htmlFor="image" className={styles.labelImage}>
        <FaRegImage className={styles.sendImage} />
        {previewImageUrl ? (
          <Image src={previewImageUrl} width={500} height={500} alt="User" />
        ) : (
          <FaUser />
        )}
      </label>
      <input
        type="file"
        accept="image/*"
        name="image"
        id="image"
        className={styles.inputImage}
        onChange={handleImagePreview}
      />
      {message && message.type === "error" ? (
        <p className="errorMessage">{message.message}</p>
      ) : (
        message && <p className="successMessage">{message?.message}</p>
      )}
      <Button>{isSubmitting ? "Criando..." : "Criar"}</Button>
    </form>
  );
}
