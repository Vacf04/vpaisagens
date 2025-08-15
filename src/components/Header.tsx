"use client";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import styles from "./Header.module.css";
import { useAuth } from "@/context/authContext";

export default function Header() {
  const { user } = useAuth();

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
                <FaUser /> {user ? "Conta" : "Login"}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
