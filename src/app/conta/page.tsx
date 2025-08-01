import PostsConta from "@/components/conta/PostsConta";
import styles from "./page.module.css";

export default function Profile() {
  return (
    <div className={styles.postsGrid}>
      <PostsConta />
    </div>
  );
}
