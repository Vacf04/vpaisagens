import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container">
      <h1>Página não encontrada</h1>
      <Link
        style={{ marginBottom: "1rem", display: "inline-block" }}
        href={"/"}
      >
        Volte para a Home.
      </Link>
    </section>
  );
}
