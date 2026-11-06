import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { formatBlogDate, getBlogBySlug } from "@/lib/blogs";
import { renderMeetupMarkdown } from "@/lib/markdownRenderer";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug = "" } = useParams();
  const post = getBlogBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) document.title = `${post.title} | BTU Tech Hub`;
  }, [post]);

  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-24">
        <article className="section-container max-w-3xl mx-auto">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-cyber-blue transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All blogs
          </Link>

          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="mono-tag text-cyber-green inline-flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{post.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              {post.date && (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatBlogDate(post.date)}
                </span>
              )}
            </div>
          </header>

          <div className="glass-card rounded-2xl p-6 md:p-10">{renderMeetupMarkdown(post.body)}</div>
        </article>
      </main>
      <FooterSection />
    </div>
  );
};

export default BlogPost;
