import { motion, type Variants } from "framer-motion";
import { ArrowRight, Users, Calendar, ChevronDown } from "lucide-react";

const floatingIcons = [
  { icon: "⚡", x: "10%", y: "20%", delay: 0 },
  { icon: "🤖", x: "85%", y: "15%", delay: 0.5 },
  { icon: "🔗", x: "5%", y: "65%", delay: 1 },
  { icon: "💡", x: "90%", y: "60%", delay: 0.8 },
  { icon: "🚀", x: "75%", y: "80%", delay: 0.3 },
  { icon: "🧠", x: "20%", y: "80%", delay: 1.2 },
];

const EASE = "easeOut" as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-radial pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56,189,248,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
        {/* Radial glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-cyber-purple/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-cyber-green/4 blur-3xl" />
      </div>

      {/* Floating icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none select-none"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: item.delay + 0.8, duration: 0.5 }}
        >
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {item.icon}
          </motion.span>
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="section-container relative z-10 text-center flex flex-col items-center gap-6 py-20"
      >
        {/* Eyebrow badge */}
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mono-tag text-cyber-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
            BTU Cottbus-Senftenberg · Every Sunday 14:00
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance leading-[1.05] max-w-5xl"
        >
          Welcome to{" "}
          <span className="gradient-text">BTU Tech Hub</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed"
        >
          Connect • Learn • Build — A student tech community for collaboration, growth, and fun.
          Join BTU's fastest-growing tech club every Sunday.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center mt-2"
        >
          <a
            href="https://discord.gg/jWHT3fPuHj"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl btn-discord text-base font-semibold shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.02.01.04.025.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Join Discord
          </a>

          <a
            href="https://luma.com/calendar/cal-15EeqDt3eUrf1et"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl btn-cyber text-base font-semibold"
          >
            <Calendar className="w-5 h-5" />
            Register on Luma
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-8 mt-6 text-sm text-muted-foreground"
        >
          {[
            { icon: <Users className="w-4 h-4 text-cyber-blue" />, label: "Members", value: "70+" },
            { icon: <Calendar className="w-4 h-4 text-cyber-purple" />, label: "Meetups Held", value: "26+" },
            { icon: <span className="text-cyber-green text-base">🔥</span>, label: "Weekly Sundays", value: "14:00" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2">
              {stat.icon}
              <span className="text-foreground font-bold">{stat.value}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-cyber-blue transition-colors"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.a>
    </section>
  );
}
