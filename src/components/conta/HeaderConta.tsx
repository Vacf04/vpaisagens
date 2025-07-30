"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { FaPlus, FaSignOutAlt, FaUser } from "react-icons/fa";
import styles from "./HeaderConta.module.css";

function getTitle(pathname: string) {
  switch (pathname) {
    case "/conta/postar":
      return "Poste uma Foto";
    default:
      return "Minha Conta";
  }
}

export default function HeaderConta() {
  const router = useRouter();
  const { supabaseClient, user } = useAuth();
  const pathname = usePathname();

  async function handleLogout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("Erro ao fazer logout:", error);
    } else {
      console.log("Usuário deslogado com sucesso!");
      router.push("/login");
    }
  }

  return (
    <header className={styles.header}>
      <h1>{getTitle(pathname)}</h1>
      <nav>
        <ul>
          <li className={pathname === "/conta" ? styles.active : ""}>
            <Link href="/conta" aria-label="Minha conta">
              <FaUser />
            </Link>
          </li>
          <li className={pathname === "/conta/postar" ? styles.active : ""}>
            <Link href="/conta/postar" aria-label="Fazer uma postagem">
              <FaPlus />
            </Link>
          </li>
          <li
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
            aria-label="Sair da conta"
          >
            <FaSignOutAlt />
          </li>
        </ul>
      </nav>
    </header>
  );
}
