"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import photoPost from "@/actions/photo-post";
import styles from "./FormPostar.module.css";
import { FaRegImage } from "react-icons/fa";
import Button from "../forms/Button";

export default function FormPostar() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  function resetForm() {
    setDescription("");
    setImage(null);
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
    }
    setPreviewImageUrl(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (!image || !description || !description.trim()) {
      setError("Por favor, Preencha todos os campos");
      setLoading(false);
      return;
    }

    if (image && !image.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem válida.");
      return;
    }

    if (!user) {
      setError("Você precisa estar logado para postar.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await photoPost(user.id, image, description);

      if (error) {
        throw new Error(error.message || "Ocorreu um erro desconhecido.");
      }

      setSuccess("Post enviado com sucesso!");
      resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null) {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewImageUrl(imageUrl);
        setImage(file);
      } else {
        setPreviewImageUrl(null);
        setImage(null);
      }
    }
  }

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  return (
    <div className={styles.postarContent}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="image" className={styles.labelImage}>
          <FaRegImage />
          Envie sua Imagem
        </label>
        <textarea
          placeholder="Escreva sua descrição..."
          name="description"
          id="description"
          className={styles.descriptionInput}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          name="image"
          id="image"
          className={styles.inputImage}
          onChange={handleImagePreview}
        />
        <Button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            justifyContent: "center",
            marginBottom: ".5rem",
          }}
        >
          Postar
        </Button>
        {error && <p className="errorMessage">{error}</p>}
        {success && <p className="successMessage">{success}</p>}
      </form>
      {previewImageUrl && (
        <div>
          <Image
            src={previewImageUrl}
            alt="Pré-visualização da imagem selecionada"
            className={styles.previewImg}
            width={255}
            height={255}
          />
        </div>
      )}
    </div>
  );
}
