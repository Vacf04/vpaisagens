"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import photoPost from "@/actions/photo-post";

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
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          name="image"
          id="image"
          onChange={handleImagePreview}
        />
        {error && <p className="errorMessage">{error}</p>}
        {success && <p className="successMessage">{success}</p>}
        <button type="submit" disabled={loading}>
          Enviar
        </button>
      </form>
      {previewImageUrl && (
        <div>
          <h2>Pré-visualização:</h2>
          <Image
            src={previewImageUrl}
            alt="Pré-visualização da imagem selecionada"
            width={200}
            height={200}
          />
        </div>
      )}
    </>
  );
}
