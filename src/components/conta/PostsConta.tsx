"use client";

import postsGet, { Posts } from "@/actions/posts-get";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./postsConta.module.css";

export default function PostsConta() {
  const { supabaseClient, user } = useAuth();
  const [posts, setPosts] = useState<Posts[] | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [infiniteScroll, setInfiniteScroll] = useState(true);
  const final = useRef(null);
  const [range, setRange] = useState({
    firstRange: 0,
    lastRange: 5,
  });

  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      if (user) {
        const { data, error } = await postsGet(user.id, range);
        if (error) console.log(error);
        if (data) {
          if (data?.length < 6) setInfiniteScroll(false);
          setPosts((postsAtuais) => {
            const posts = postsAtuais || [];
            return [...posts, ...data];
          });
        }
        setLoading(false);
      }
    }

    getPosts();
  }, [supabaseClient, user, range]);

  useEffect(() => {
    if (!infiniteScroll) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading) {
        setRange((prevRange) => ({
          firstRange: prevRange.firstRange + 6,
          lastRange: prevRange.lastRange + 6,
        }));
      }
    });

    const currentFinalRef = final.current;

    if (currentFinalRef) observer.observe(currentFinalRef);

    return () => {
      if (currentFinalRef) observer.unobserve(currentFinalRef);
    };
  }, [loading, infiniteScroll]);
  return (
    <>
      <div className={styles.gridPosts}>
        {posts &&
          posts.map((post) => (
            <div key={post.id} className={styles.containerImagePost}>
              <Image
                src={post.image_url}
                alt="teste"
                width={400}
                height={400}
              />
            </div>
          ))}
      </div>
      {infiniteScroll ? (
        <div ref={final}>{loading && <div>Carregando mais posts...</div>}</div>
      ) : (
        <div>Não Existem mais posts.</div>
      )}
    </>
  );
}
