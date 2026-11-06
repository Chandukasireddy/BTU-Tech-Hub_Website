export interface BlogPost {
  slug: string;
  title: string;
  date: Date | null;
  author: string;
  excerpt: string;
  tags: string[];
  body: string;
}

const blogModules = import.meta.glob<string>("/src/content/blogs/*.md", { query: "?raw", import: "default", eager: true });

/** Splits a markdown file with an optional `---` frontmatter block into fields and body. */
export function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: normalized };

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (key) data[key] = value;
  }
  return { data, body: match[2] };
}

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** All blog posts from src/content/blogs, newest first. Undated posts sort last. */
export function getAllBlogs(): BlogPost[] {
  return Object.entries(blogModules)
    .map(([path, raw]) => {
      const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? "";
      const { data, body } = parseFrontmatter(raw);
      return {
        slug,
        title: data.title || slug,
        date: parseDate(data.date),
        author: data.author || "BTU Tech Hub",
        excerpt: data.excerpt || "",
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        body,
      };
    })
    .sort((a, b) => {
      if (!a.date && !b.date) return a.title.localeCompare(b.title);
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.getTime() - a.date.getTime();
    });
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return getAllBlogs().find((post) => post.slug === slug);
}

export function formatBlogDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
