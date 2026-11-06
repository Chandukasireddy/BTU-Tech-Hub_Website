# BTU Tech Spark ⚡

<p align="center">
  <strong>The Sunday Ritual for Builders at BTU Cottbus-Senftenberg</strong><br />
  A welcoming, student-led community for anyone passionate about technology, coding, and building things together.
</p>

<p align="center">
  <a href="https://btu-tech-hub.vercel.app"><img src="https://img.shields.io/badge/Website-Live-0EA5E9?style=flat" alt="Website" /></a>
  <a href="https://discord.gg/jWHT3fPuHj"><img src="https://img.shields.io/badge/Discord-Join%20Community-5865F2?style=flat&logo=discord&logoColor=white" alt="Discord" /></a>
  <a href="https://luma.com/calendar/cal-15EeqDt3eUrf1et"><img src="https://img.shields.io/badge/Luma-Weekly%20Meetups-EA580C?style=flat" alt="Luma" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-38BDF8?style=flat" alt="License: MIT" /></a>
  <a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-Welcome-22C55E?style=flat" alt="PRs Welcome" /></a>
</p>

> **"Everyone can use this repository, and everyone is welcome to the repository."**

## Table of Contents

- [Overview](#overview)
- [Core Motto](#core-motto)
- [Weekly Meetups](#weekly-meetups-the-sunday-ritual)
- [Community & Links](#community--links)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Community Values](#community-values)
- [License](#license)

## Overview

This repository powers the official website and community hub of **BTU Tech Spark** (BTU Tech Hub), a student-led tech community at **BTU Cottbus-Senftenberg**. The site showcases our meetups, projects, photos, and ways to join.

## Core Motto

<h3 align="center">Connect • Learn • Build</h3>

- 🤝 **Connect**: Make friends, meet study partners, find project teammates, and build real connections with peers across disciplines.
- 💡 **Learn**: Explore modern technologies together: Artificial Intelligence, Large Language Models, Web & Cloud, Open Source, and Career Skills.
- 🚀 **Build**: Don't just watch tutorials. Build real projects, join live coding sessions, and share what you create.

## Weekly Meetups: The Sunday Ritual

Every Sunday, builders and learners at BTU Cottbus gather to learn and code together:

- **When**: Every Sunday, 14:00 – 17:00
- **Where**: IKMZ −1 Floor Cabins, BTU Cottbus-Senftenberg
- **Who**: Open to all students, beginners, seniors, and tech enthusiasts. No prior experience required!
- **Bring**: Your laptop, your curiosity, and good vibes.

## Community & Links

- 💬 **Discord**: [Join our Discord Server](https://discord.gg/jWHT3fPuHj) to chat, ask questions, and share projects.
- 📅 **Luma Calendar**: [Register on Luma](https://luma.com/calendar/cal-15EeqDt3eUrf1et) to RSVP for upcoming Sunday meetups.
- 📍 **Campus Map**: [Find the IKMZ Basement Cabins](https://btu.mapongo.de/viewer?p=1&b=1&f=13&l=349&lang=en)
- 🌐 **Live Website**: [btu-tech-hub.vercel.app](https://btu-tech-hub.vercel.app)

## Tech Stack

| Area | Technologies |
| --- | --- |
| UI framework | React 18, TypeScript, Vite (SWC) |
| Styling & components | Tailwind CSS, Radix UI, shadcn/ui, Lucide icons |
| Animation | Framer Motion, tailwindcss-animate |
| Data & routing | React Router, TanStack Query, date-fns |
| Testing & quality | Vitest, Testing Library, Playwright, ESLint |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (or Bun, since `bun.lock` is included)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Chandukasireddy/BTU-Tech-Hub_Website.git
cd BTU-Tech-Hub_Website

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app is then available at `http://localhost:8080` (or the port Vite reports in the terminal).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm test` | Run the Vitest test suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run generate-thumbs` | Generate optimized thumbnails for meetup photos |

## Project Structure

```text
├── public/                  # Static assets served as-is
├── scripts/                 # Build helpers (e.g. thumbnail generation)
├── src/
│   ├── components/          # Page sections (Hero, Meetup, Projects, Footer, …) and ui/ primitives
│   ├── content/
│   │   ├── meetups/         # Meetup notes, one markdown file per session (meetup-XX.md)
│   │   └── images-meetup/   # Meetup photos, one folder per session
│   ├── data/                # Structured site data (e.g. meetups.ts)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and the meetup parser
│   ├── pages/               # Route-level pages (Index, NotFound)
│   └── test/                # Vitest setup and tests
└── index.html
```

## Contributing

BTU Tech Spark is **100% open source** and community-driven. Everyone is encouraged to contribute, and you don't need to write complex code to help:

- 📝 Add summary notes and takeaways for weekly meetups in `src/content/meetups/`.
- 📸 Share photos from our sessions in `src/content/images-meetup/`.
- 🛠️ Add your student side project to the community showcase.
- ✍️ Write a blog post in `src/content/blogs/`. See [How to Write a Blog Post](https://btu-tech-hub.vercel.app/blogs/how-to-write-a-blog-post).
- 🎨 Suggest new ideas or improve the website's design and accessibility.

👉 **Read the [Contribution Guide](./CONTRIBUTING.md)** to get started, and check the [Contributor Guide](./CONTRIBUTOR.md) for quick links.

Found a bug or have an idea? [Open an issue](../../issues/new/choose) using one of our templates.

## Community Values

- **Be welcoming & kind**: Treat everyone with respect, encouragement, and patience.
- **Beginner-friendly**: Everyone was a beginner once. No question is silly.
- **Collaborative over competitive**: We thrive when we help each other succeed.
- **Keep it open**: Share open-source knowledge, tools, and ideas freely.

## License

This project is licensed under the [MIT License](./LICENSE), open for everyone to learn from, use, and build upon.
