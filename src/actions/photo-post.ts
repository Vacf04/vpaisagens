'use server'


import { createClient } from "@/lib/supabaseServer";


export default async function photoPost(id: string, image: File, description: string) {
    const supabaseServer = await createClient();

    const fileExt = image.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;
    let error = null;
    let data = null;

    const { data: dataImage, error: errorImage } = await supabaseServer.storage
      .from("imagens")
      .upload(filePath, image, {
        cacheControl: "3600",
        upsert: false,
      });

    if (!dataImage) {
        error = errorImage;
        data = dataImage;
      return {data, error};
    }

    const { data: dataPost, error: errorPost } = await supabaseServer
      .from("posts")
      .insert([
        {
          user_id: id,
          image_url: `https://bbakykgrrgwpnfukhkad.supabase.co/storage/v1/object/public/imagens/${dataImage.path}`,
          description: description,
        },
      ])
      .select();

      data = dataPost;
      error = errorPost;

    return { data, error };
}