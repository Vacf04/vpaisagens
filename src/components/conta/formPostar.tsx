"use client";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
export default function FormPostar() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>();
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const { supabaseClient, user } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!image) {
      alert("Por favor, selecione uma imagem.");
      return;
    }

    const fileExt = image.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { data: dataImage, error: errorImage } =
        await supabaseClient.storage.from("imagens").upload(filePath, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!dataImage) {
        return null;
      }
    } catch (error: unknown) {}

    const { data, error } = await supabaseClient
      .from("posts")
      .insert([
        {
          user_id: user?.id,
          image_url: `https://bbakykgrrgwpnfukhkad.supabase.co/storage/v1/object/public/imagens/${dataImage.path}`,
          description: description,
        },
      ])
      .select();
  }

  function handleImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewImageUrl(imageUrl);
      setImage(e.target.files[0]);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          accept="image/*"
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          name="image"
          id="image"
          onChange={handleImagePreview}
        />
        <button type="submit">Enviar</button>
      </form>
      {previewImageUrl && (
        <div>
          <h2>Pré-visualização:</h2>
          <Image
            src={previewImageUrl}
            alt="Pré-visualização da imagem selecionada"
          />
        </div>
      )}
    </>
  );
}
