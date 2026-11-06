import { describe, it, expect } from "vitest";
import { parseFrontmatter } from "../lib/blogs";

describe("parseFrontmatter", () => {
  it("reads key/value fields and returns the body", () => {
    const raw = `---
title: Hello: World
date: 2026-11-06
tags: community, meetup
---

Body text here.`;
    const { data, body } = parseFrontmatter(raw);
    expect(data.title).toBe("Hello: World");
    expect(data.date).toBe("2026-11-06");
    expect(data.tags).toBe("community, meetup");
    expect(body.trim()).toBe("Body text here.");
  });

  it("returns the whole file as body when there is no frontmatter", () => {
    const { data, body } = parseFrontmatter("# Just a body");
    expect(data).toEqual({});
    expect(body).toBe("# Just a body");
  });
});
