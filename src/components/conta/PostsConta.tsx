"use client";

import postsGet, { Posts } from "@/actions/posts-get";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PostsConta() {
  const { supabaseClient, user } = useAuth();
  const [posts, setPosts] = useState<Posts[] | null>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      if (user) {
        const { data, error } = await postsGet(user.id);
        if (error) console.log(error);
        setPosts(data);
        setLoading(false);
      }
    }

    getPosts();
  }, [supabaseClient, user]);

  if (loading) return <div>Carregando...</div>;
  if (!posts) return <div>Nenhum Post Encontrado</div>;
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <Image src={post.image_url} alt="teste" width={200} height={200} />
          <p>{post.description}</p>
          <p>{post.user_id}</p>
        </div>
      ))}
    </div>
  );
}
