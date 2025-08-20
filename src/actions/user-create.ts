'use server'


import { createClient } from "@/lib/supabaseServer";


export default async function userCreate(id: string, username: string, avatar: File ) {
    const supabaseServer = await createClient();

    const fileExt = avatar.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;
    let error = null;
    let data = null;

    const { data: dataImage, error: errorImage } = await supabaseServer.storage
      .from("imagens")
      .upload(filePath, avatar, {
        cacheControl: "3600",
        upsert: false,
      });

    if (!dataImage) {
        error = errorImage;
        data = dataImage;
      return {data, error};
    }

    console.log(dataImage)

    const { data: dataPost, error: errorPost } = await supabaseServer
      .from("profiles")
      .insert([
        {
          id,
          username,
          avatar_url: `https://bbakykgrrgwpnfukhkad.supabase.co/storage/v1/object/public/imagens/${dataImage.path}`,
        },
      ])
      .select();

      if(errorPost) {
       await supabaseServer.storage.from("imagens").remove([filePath])
      }

      data = dataPost;
      error = errorPost;

      console.log(dataPost, errorPost)
    return { data, error };
}