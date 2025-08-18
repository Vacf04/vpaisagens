"use client";

import postsGet, { PostsType } from "@/actions/posts-get";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Posts.module.css";
import Link from "next/link";
import Loading from "../helper/Loading";

export default function Posts({ isHome }: { isHome: boolean }) {
  const { supabaseClient, user } = useAuth();
  const [posts, setPosts] = useState<PostsType[] | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [infiniteScroll, setInfiniteScroll] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const final = useRef(null);
  const [range, setRange] = useState({
    firstRange: 0,
    lastRange: 5,
  });

  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      const userIdParameter = isHome ? null : user ? user?.id : null; //parameter to know if is on home or on a page of user
      const { data, error } = await postsGet(userIdParameter, range);
      if (error) setErrorMessage(error.message);
      if (data) {
        if (data?.length < 6) setInfiniteScroll(false);
        setPosts((postsAtuais) => {
          const posts = postsAtuais || [];
          const newPosts = data.filter((novoPost) => {
            return !posts.some(
              (existingPost) => existingPost.id === novoPost.id
            );
          });
          return [...posts, ...newPosts];
        });
      }
      setLoading(false);
    }

    getPosts();
  }, [supabaseClient, user, range, isHome]);

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

  if (errorMessage) return <p className="errorMessage">{errorMessage}</p>;
  return (
    <>
      <ul className={styles.gridPosts}>
        {posts &&
          posts.map((post) => (
            <li key={post.id} className={styles.postListItem}>
              <Link href={`/post/${post.id}`}>
                <article className={styles.containerImagePost}>
                  <Image
                    src={post.image_url}
                    alt="teste"
                    width={400}
                    height={400}
                  />
                  <span className={styles.overlayImage}></span>
                </article>
              </Link>
            </li>
          ))}
      </ul>
      {infiniteScroll ? (
        <div ref={final}>{loading && <Loading />}</div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          Não Existem mais posts.
        </div>
      )}
    </>
  );
}
