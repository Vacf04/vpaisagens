import HeaderConta from "@/components/conta/HeaderConta";

export default function ContaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className="container">
        <HeaderConta />
        {children}
      </div>
    </section>
  );
}
