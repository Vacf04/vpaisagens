import styles from "./page.module.css";
import FormPostar from "@/components/conta/FormPostar";
export default function Postar() {
  return (
    <div className={styles.postContent}>
      <FormPostar />
    </div>
  );
}
