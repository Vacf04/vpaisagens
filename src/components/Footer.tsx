import styles from "./Footer.module.css";
export default function Footer() {
  return (
    <footer>
      <div className={`${styles.footerContent} container`}>
        <p>@2025 Vpaisagens.</p>
      </div>
    </footer>
  );
}
