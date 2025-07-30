import Link from "next/link";
import { FaUser } from "react-icons/fa";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header>
      <div className={`${styles.headerContent} container`}>
        <h1>
          <Link href="/">Vpaisagens</Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link href="/login" className={styles.linkWithIcon}>
                <FaUser /> Conta
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
