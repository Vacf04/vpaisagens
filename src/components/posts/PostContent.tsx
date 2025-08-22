"use client";

import postGet from "@/actions/post-get";
import { PostsType } from "@/actions/posts-get";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../helper/Loading";
import Image from "next/image";
import userGet, { UserType } from "@/actions/user-get";
import styles from "./PostContent.module.css";
import Link from "next/link";

export default function PostContent() {
  const [post, setPost] = useState<PostsType[] | null>(null);
  const [userFromPost, setUserFromPost] = useState<UserType[] | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pathname = usePathname();

  console.log();

  useEffect(() => {
    async function getPost() {
      setErrorMessage(null);
      setLoadingPost(true);
      try {
        const idPost = pathname.replace("/post/", "");
        const { data, error } = await postGet(idPost);
        if (error) {
          throw new Error(error.message || "Ocorreu um erro desconhecido.");
        }

        if (data) setPost(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Ocorreu um erro desconhecido.");
        }
      } finally {
        setLoadingPost(false);
      }
    }

    getPost();
  }, [pathname]);

  useEffect(() => {
    async function getUser() {
      if (post) {
        setErrorMessage(null);
        setLoadingUser(true);
        try {
          const { data, error } = await userGet(post[0].user_id);
          if (error) {
            throw new Error(error.message || "Ocorreu um erro desconhecido.");
          }
          if (data) setUserFromPost(data);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("Ocorreu um erro desconhecido.");
          }
        } finally {
          setLoadingUser(false);
        }
      }
    }

    getUser();
  }, [post]);

  if (loadingPost || loadingUser) return <Loading />;
  if (!post || !userFromPost)
    return <p className="errorMessage">{errorMessage}</p>;
  return (
    <article className={styles.postGrid}>
      <div className={styles.imageContainerPost}>
        <Image
          src={post[0].image_url}
          width={500}
          height={500}
          alt={post[0].description}
          className={styles.image}
        />
      </div>
      <div className={styles.postData}>
        <Link
          href={`/user/${userFromPost[0].username}`}
          className={styles.username}
        >
          <div className={styles.imageContainerAvatar}>
            <Image
              src={userFromPost[0].avatar_url}
              width={150}
              height={150}
              alt={`${userFromPost[0].username} avatar image.`}
              className={styles.image}
            />
          </div>
          <p>{userFromPost[0].username}</p>
        </Link>
        <p>{new Date(post[0].created_at).toLocaleDateString("pt-BR")}</p>
        <p>{post[0].description}</p>
      </div>
    </article>
  );
}
