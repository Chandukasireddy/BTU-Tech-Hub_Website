import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { formatBlogDate, getAllBlogs } from "@/lib/blogs";

const Blogs = () => {
  const posts = getAllBlogs();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Blogs | BTU Tech Hub";
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-24">
        <section className="section-container">
          <div className="text-center mb-14">
            <span className="mono-tag text-cyber-blue">Knowledge Hub</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              <span className="gradient-text">Blogs</span> by the Community
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Meetup recaps, guides, and stories from BTU Tech Hub builders. Want to write one? Every post is an
              open-source contribution.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No posts yet. Check back soon.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blogs/${post.slug}`}
                  className="glass-card group flex flex-col rounded-2xl p-6 border border-white/5 hover:border-cyber-blue/40 transition-colors duration-200"
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="mono-tag text-cyber-green inline-flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight group-hover:text-cyber-blue transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-1">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatBlogDate(post.date) || "Undated"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-cyber-blue">
                      Read more <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default Blogs;
