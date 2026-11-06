import type { ReactNode } from "react";

// Shared markdown renderer for meetup recaps and blog posts.
const meetupImageModules = import.meta.glob("/src/content/images-meetup/**/*", { query: "?url", import: "default", eager: true });

function resolveMarkdownImageSrc(src: string) {
  const normalized = src.replace(/\\/g, "/").trim();

  // Keep absolute URLs and data URLs untouched.
  if (/^(https?:)?\/\//.test(normalized) || normalized.startsWith("data:")) {
    return normalized;
  }

  const srcKey = normalized.startsWith("/src/") ? normalized : `/${normalized.replace(/^\/+/, "")}`;

  // Check direct match in images folder
  const directMatch = meetupImageModules[srcKey];
  if (typeof directMatch === "string") {
    return directMatch;
  }
  if (directMatch && typeof directMatch === "object" && "default" in directMatch && typeof directMatch.default === "string") {
    return directMatch.default;
  }

  // Fallback to banner key replacement
  const bannerKey = srcKey.replace(
    "/src/content/images-meetup/",
    "/src/content/images-meetup/banners/"
  ).replace(/\.(jpe?g|png|webp)$/i, "-banner.jpg");
  const resolved = meetupImageModules[bannerKey];

  if (typeof resolved === "string") {
    return resolved;
  }

  if (resolved && typeof resolved === "object" && "default" in resolved && typeof resolved.default === "string") {
    return resolved.default;
  }

  return normalized;
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/\S+)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`code-${index}`} className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[0.85em] text-cyber-green">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`bold-${index}`} className="text-foreground font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const mdLinkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (mdLinkMatch) {
      const [, linkText, url] = mdLinkMatch;
      return (
        <a
          key={`mdlink-${index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyber-blue hover:text-cyber-blue/80 underline underline-offset-4 break-all"
        >
          {linkText}
        </a>
      );
    }

    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={`link-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyber-blue hover:text-cyber-blue/80 underline underline-offset-4 break-all"
        >
          {part}
        </a>
      );
    }

    return <span key={`text-${index}`}>{part}</span>;
  });
}

export function renderMeetupMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const elements: ReactNode[] = [];
  let listBuffer: string[] = [];
  const markdownImageLineRegex = /^!\[([^\]]*)\]\(([^)]+)\)$/;

  const flushList = () => {
    if (listBuffer.length === 0) {
      return;
    }

    elements.push(
      <ul key={`list-${elements.length}`} className="list-disc pl-5 space-y-1 mb-4 text-muted-foreground">
        {listBuffer.map((item, index) => (
          <li key={`item-${index}`}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>,
    );

    listBuffer = [];
  };

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushList();
      return;
    }

    if (trimmedLine.startsWith("- ")) {
      listBuffer.push(trimmedLine.slice(2));
      return;
    }

    flushList();

    if (trimmedLine === "---" || trimmedLine === "***") {
      elements.push(
        <hr key={`hr-${elements.length}`} className="my-6 border-white/10" />
      );
      return;
    }

    if (trimmedLine.startsWith("# ")) {
      elements.push(
        <h4 key={`h1-${elements.length}`} className="text-2xl font-bold tracking-tight mb-4">
          {renderInlineMarkdown(trimmedLine.slice(2))}
        </h4>,
      );
      return;
    }

    if (trimmedLine.startsWith("## ")) {
      elements.push(
        <h5 key={`h2-${elements.length}`} className="text-lg font-semibold mt-7 mb-3 text-cyber-blue">
          {renderInlineMarkdown(trimmedLine.slice(3))}
        </h5>,
      );
      return;
    }

    if (trimmedLine.startsWith("### ")) {
      elements.push(
        <h6 key={`h3-${elements.length}`} className="text-base font-semibold mt-5 mb-2 text-foreground">
          {renderInlineMarkdown(trimmedLine.slice(4))}
        </h6>,
      );
      return;
    }

    if (trimmedLine.startsWith("#### ")) {
      elements.push(
        <h6 key={`h4-${elements.length}`} className="text-sm font-semibold mt-4 mb-2 text-muted-foreground">
          {renderInlineMarkdown(trimmedLine.slice(5))}
        </h6>,
      );
      return;
    }

    const imageMatch = trimmedLine.match(markdownImageLineRegex);
    if (imageMatch) {
      const [, alt, src] = imageMatch;
      const resolvedSrc = resolveMarkdownImageSrc(src);
      elements.push(
        <div key={`img-${elements.length}`} className="mb-5 overflow-hidden rounded-xl border border-white/10 bg-background/30">
          <img
            src={resolvedSrc}
            alt={alt || "Meetup banner"}
            loading="lazy"
            className="block h-auto w-full object-cover"
          />
        </div>,
      );
      return;
    }

    elements.push(
      <p key={`p-${elements.length}`} className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
        {renderInlineMarkdown(trimmedLine)}
      </p>,
    );
  });

  flushList();

  return elements;
}

