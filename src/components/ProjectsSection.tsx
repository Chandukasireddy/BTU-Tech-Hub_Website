import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, GitFork, Star } from "lucide-react";

const projects = [
  {
    name: "Prompt Refiner Chrome Extension",
    description: "A fully functional browser extension built from scratch that refines and optimizes prompts in real time for higher quality AI responses.",
    tags: ["Chrome Extension", "Prompt Eng", "AI Tools"],
    stars: 18,
    color: "blue",
  },
  {
    name: "The AI Debate Challenge",
    description: "An autonomous multi-agent simulation where two or more AI agents debate complex topics with timed arguments, rebuttals, and consensus rounds.",
    tags: ["Multi-Agent", "Autonomous AI", "LLM"],
    stars: 16,
    color: "purple",
  },
  {
    name: "Custom MCP Servers",
    description: "Built specialized Model Context Protocol (MCP) servers to extend AI tool use—including Weather Comparison, System Diagnostics, NASA API, and BTU Course search.",
    tags: ["MCP", "API Integration", "AI Tooling"],
    stars: 15,
    color: "green",
  },
  {
    name: "LLM Fine-Tuning with Unsloth",
    description: "Hands-on fine-tuning of open-source language models using Unsloth, accelerating training speed and customizing model behavior on specific tasks.",
    tags: ["Fine-Tuning", "Unsloth", "LLM", "PyTorch"],
    stars: 14,
    color: "blue",
  },
  {
    name: "n8n AI & Automation Workflows",
    description: "Designed end-to-end automation pipelines using n8n, featuring automated LinkedIn content creation, autonomous AI agent helpers, and smart Gmail sorting & labeling.",
    tags: ["n8n", "Automation", "AI Agents"],
    stars: 13,
    color: "purple",
  },
  {
    name: "CNN on MNIST Dataset",
    description: "Implemented and trained Convolutional Neural Networks from scratch to recognize handwritten digits, exploring architectural trade-offs and presenting comparative results.",
    tags: ["Deep Learning", "CNN", "Computer Vision"],
    stars: 12,
    color: "green",
  },
  {
    name: "ML Algorithms from Scratch",
    description: "Built distinct Machine Learning algorithms from the ground up using pure Python, complete with collaborative peer code reviews and deep architectural discussions.",
    tags: ["Machine Learning", "Python", "Algorithms"],
    stars: 11,
    color: "blue",
  },
  {
    name: "Interactive Personal Portfolios",
    description: "Crafted and deployed highly creative personal portfolio websites—including an interactive Paris exploration theme and animated showcases with custom interactive elements.",
    tags: ["Web Dev", "Portfolio", "Deployment"],
    stars: 10,
    color: "purple",
  },
];

const tagColorMap: Record<string, string> = {
  AI: "border-cyber-blue/30 text-cyber-blue bg-primary/5",
  LLM: "border-cyber-blue/30 text-cyber-blue bg-primary/5",
  "Prompt Eng": "border-cyber-blue/30 text-cyber-blue bg-primary/5",
  "AI Tools": "border-cyber-blue/30 text-cyber-blue bg-primary/5",
  "AI Tooling": "border-cyber-blue/30 text-cyber-blue bg-primary/5",
  "AI Agents": "border-cyber-blue/30 text-cyber-blue bg-primary/5",
  "Autonomous AI": "border-cyber-blue/30 text-cyber-blue bg-primary/5",
  ML: "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5",
  "Machine Learning": "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5",
  "Deep Learning": "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5",
  CNN: "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5",
  "Computer Vision": "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5",
  "Multi-Agent": "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5",
  "Fine-Tuning": "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5",
  Unsloth: "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5",
  PyTorch: "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5",
  Algorithms: "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5",
  Research: "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5",
  "Web Dev": "border-cyber-green/30 text-cyber-green bg-cyber-green/5",
  "Chrome Extension": "border-cyber-green/30 text-cyber-green bg-cyber-green/5",
  MCP: "border-cyber-green/30 text-cyber-green bg-cyber-green/5",
  n8n: "border-cyber-green/30 text-cyber-green bg-cyber-green/5",
  Automation: "border-cyber-green/30 text-cyber-green bg-cyber-green/5",
  "API Integration": "border-cyber-green/30 text-cyber-green bg-cyber-green/5",
  Deployment: "border-cyber-green/30 text-cyber-green bg-cyber-green/5",
  Python: "border-amber-400/30 text-amber-400 bg-amber-400/5",
  Portfolio: "border-pink-500/30 text-pink-400 bg-pink-500/5",
  "Student Project": "border-white/20 text-muted-foreground bg-white/5",
  "Open Source": "border-white/20 text-muted-foreground bg-white/5",
  Bot: "border-white/20 text-muted-foreground bg-white/5",
  Discord: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5",
  Collaboration: "border-cyber-blue/30 text-cyber-blue bg-primary/5",
  Content: "border-white/20 text-muted-foreground bg-white/5",
  Community: "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5",
};

const glowColors: Record<string, string> = {
  blue: "hover:shadow-[0_0_30px_-10px_rgba(56,189,248,0.3)]",
  purple: "hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]",
  green: "hover:shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]",
};

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24">
      <div className="section-container">
        <FadeIn>
          <div className="text-center mb-14">
            <span className="mono-tag text-cyber-blue">04 — Projects</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              What We're <span className="gradient-text">Building</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-pretty">
              Community-driven projects born at BTU Tech Hub meetups. Contribute, fork, or just get inspired.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <FadeIn key={i} delay={0.06 * i}>
              <div className={`project-card p-6 flex flex-col gap-4 group h-full ${glowColors[project.color]}`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-lg leading-tight tracking-tight">{project.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Star className="w-3 h-3" />
                    {project.stars}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 text-pretty">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`mono-tag px-2 py-0.5 rounded-full border ${tagColorMap[tag] || "border-white/10 text-muted-foreground bg-white/5"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover reveal button */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                  <a
                    href="https://discord.gg/jWHT3fPuHj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 text-cyber-blue text-xs font-semibold hover:bg-primary/10 transition-colors"
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    Contribute
                  </a>
                  <a
                    href="https://discord.gg/jWHT3fPuHj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-muted-foreground text-xs font-semibold hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Learn More
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
