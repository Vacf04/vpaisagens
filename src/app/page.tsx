import Posts from "@/components/posts/Posts";

export default function Home() {
  return (
    <section>
      <div className="container">
        <Posts isHome={true} />
      </div>
    </section>
  );
}
