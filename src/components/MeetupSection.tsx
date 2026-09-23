import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, ExternalLink, MapPin, Navigation } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { Button } from "@/components/ui/button";

// Dynamically load all markdown files from the meetups folder using Vite's glob
const meetupModules = import.meta.glob<string>("/src/content/meetups/*.md", { query: "?raw", import: "default", eager: true });
const meetupBannerModules = import.meta.glob("/src/content/images-meetup/banners/*", { query: "?url", import: "default", eager: true });

// Extract and sort meetup markdowns by numeric part (if exists) and preserve filenames
const meetupMarkdowns = Object.entries(meetupModules)
  .sort(([pathA], [pathB]) => {
    // Extract numeric value from filename for sorting
    const numA = parseInt(pathA.match(/(\d+)/)?.[1] || "0");
    const numB = parseInt(pathB.match(/(\d+)/)?.[1] || "0");
    return numB - numA; // Descending order (highest to lowest)
  })
  .map(([path, content]) => {
    // Extract filename without path and without .md extension
    const filename = path.split("/").pop()?.replace(".md", "") || "";
    return { filename, content };
  });

function resolveMarkdownImageSrc(src: string) {
  const normalized = src.replace(/\\/g, "/").trim();

  // Keep absolute URLs and data URLs untouched.
  if (/^(https?:)?\/\//.test(normalized) || normalized.startsWith("data:")) {
    return normalized;
  }

  const srcKey = normalized.startsWith("/src/") ? normalized : `/${normalized.replace(/^\/+/, "")}`;
  const bannerKey = srcKey.replace(
    "/src/content/images-meetup/",
    "/src/content/images-meetup/banners/"
  ).replace(/\.(jpe?g|png|webp)$/i, "-banner.jpg");
  const resolved = meetupBannerModules[bannerKey];

  if (typeof resolved === "string") {
    return resolved;
  }

  if (resolved && typeof resolved === "object" && "default" in resolved && typeof resolved.default === "string") {
    return resolved.default;
  }

  return normalized;
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/\S+)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`bold-${index}`} className="text-foreground font-semibold">
          {part.slice(2, -2)}
        </strong>
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

function renderMeetupMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
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

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function DigitBlock({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="countdown-digit w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-cyber-blue tabular-nums"
        >
          {str}
        </motion.span>
      </div>
      <span className="mono-tag text-muted-foreground">{label}</span>
    </div>
  );
}

export function parseMeetupDateTime(markdown: string): { start: Date; end: Date } | null {
  const lines = markdown.split(/\r?\n/);
  
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let dateLineIdx = -1;
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const line = lines[i];
    if (weekdays.some(day => line.includes(day))) {
      dateLineIdx = i;
      break;
    }
  }

  if (dateLineIdx === -1) return null;

  const textToParse = lines.slice(dateLineIdx, dateLineIdx + 3).join("\n");
  
  const boldSegments: string[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let match;
  while ((match = regex.exec(textToParse)) !== null) {
    boldSegments.push(match[1].trim());
  }

  if (boldSegments.length === 0) return null;

  const dateStr = boldSegments[0];
  
  const monthsMap: { [key: string]: number } = {
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sep: 8, sept: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11
  };
  
  let monthIndex = -1;
  const words = dateStr.toLowerCase().replace(/,/g, " ").split(/\s+/);
  for (const word of words) {
    if (word in monthsMap) {
      monthIndex = monthsMap[word];
      break;
    }
  }

  if (monthIndex === -1) return null;

  let day = 1;
  for (const word of words) {
    const num = parseInt(word);
    if (!isNaN(num) && num >= 1 && num <= 31) {
      day = num;
    }
  }

  let year = new Date().getFullYear();
  for (const word of words) {
    const num = parseInt(word);
    if (!isNaN(num) && num >= 2020 && num <= 2040) {
      year = num;
      break;
    }
  }

  let timeStr = "";
  for (const segment of boldSegments) {
    if (segment.toLowerCase().includes("am") || segment.toLowerCase().includes("pm")) {
      timeStr = segment;
      break;
    }
  }

  if (!timeStr) {
    const timeMatch = textToParse.match(/\b\d{1,2}:\d{2}\s*(?:am|pm|AM|PM)\b/);
    if (timeMatch) {
      timeStr = timeMatch[0];
    }
  }

  let startHour = 14;
  let startMinute = 0;
  let endHour = 17;
  let endMinute = 0;

  if (timeStr) {
    const parts = timeStr.split("-").map(p => p.trim());
    const startPart = parts[0];
    const endPart = parts[1] || "";

    const parseTimePart = (part: string) => {
      const match = part.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
      if (match) {
        let h = parseInt(match[1]);
        const m = parseInt(match[2]);
        const ampm = match[3]?.toLowerCase();
        if (ampm === "pm" && h < 12) h += 12;
        if (ampm === "am" && h === 12) h = 0;
        return { h, m };
      }
      return null;
    };

    const parsedStart = parseTimePart(startPart);
    if (parsedStart) {
      startHour = parsedStart.h;
      startMinute = parsedStart.m;
      endHour = (startHour + 3) % 24;
      endMinute = startMinute;
    }

    if (endPart) {
      const parsedEnd = parseTimePart(endPart);
      if (parsedEnd) {
        endHour = parsedEnd.h;
        endMinute = parsedEnd.m;
      }
    }
  }

  const startDate = new Date(year, monthIndex, day, startHour, startMinute, 0, 0);
  const endDate = new Date(year, monthIndex, day, endHour, endMinute, 0, 0);

  return { start: startDate, end: endDate };
}

export default function MeetupSection() {
  const [selectedMeetupIndex, setSelectedMeetupIndex] = useState(-1); // -1 means use default (latest)

  const meetups = useMemo(
    () =>
      meetupMarkdowns.map(({ filename, content }, index) => {
        const numberMatch = filename.match(/(\d+)/);
        const filenameNumber = numberMatch ? parseInt(numberMatch[1]) : 0;
        return {
          index,
          filename,
          filenameNumber,
          title: `BTU Tech Hub Meetup - ${filename}`,
          markdown: content,
          weekday: "Sunday",
          time: "2:00 PM",
          place: "IKMZ - BTU Cottbus-Senftenberg",
        };
      }),
    [],
  );

  // Find the meetup with the highest numeric value
  const highestNumberedMeetup = useMemo(() => {
    if (meetups.length === 0) return null;
    return meetups.reduce((max, current) => 
      current.filenameNumber > (max?.filenameNumber || 0) ? current : max
    );
  }, [meetups]);

  // Set default index to highest numbered meetup on mount
  useEffect(() => {
    if (selectedMeetupIndex === -1 && highestNumberedMeetup) {
      const indexOfHighest = meetups.findIndex(m => m.filenameNumber === highestNumberedMeetup.filenameNumber);
      setSelectedMeetupIndex(indexOfHighest !== -1 ? indexOfHighest : 0);
    }
  }, [meetups, highestNumberedMeetup, selectedMeetupIndex]);

  // Use highest numbered meetup if not manually selected
  const defaultHighestIndex = highestNumberedMeetup ? meetups.findIndex(m => m.filenameNumber === highestNumberedMeetup.filenameNumber) : 0;
  const displayIndex = selectedMeetupIndex === -1 ? defaultHighestIndex : selectedMeetupIndex;
  const selectedMeetup = meetups[displayIndex] ?? meetups[0];
  const meetupSelectorItems = meetups;

  const meetupDateTime = useMemo(() => {
    if (!selectedMeetup) return null;
    return parseMeetupDateTime(selectedMeetup.markdown);
  }, [selectedMeetup]);

  const isUpcoming = useMemo(() => {
    if (!meetupDateTime) return false;
    const now = new Date();
    return now < meetupDateTime.start;
  }, [meetupDateTime]);

  const countdown = useCountdown(meetupDateTime?.start);

  const navigateMeetup = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedMeetupIndex((current) => Math.max(0, current - 1));
      return;
    }

    setSelectedMeetupIndex((current) => Math.min(meetups.length - 1, current + 1));
  };

  return (
    <section id="meetup" className="py-24">
      <div className="section-container">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="mono-tag text-cyber-blue">02 — Meetup Timeline</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              All <span className="gradient-text">25 Meetups</span> in One Place
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="glass-card rounded-2xl p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="mono-tag text-cyber-green">Easy Navigation</p>
                  <p className="text-sm text-muted-foreground mt-1">Select any meetup to read its markdown details.</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMeetup("prev")}
                    disabled={displayIndex === 0}
                    className="bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMeetup("next")}
                    disabled={displayIndex === meetups.length - 1}
                    className="bg-transparent"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <div className="flex gap-2 min-w-max pb-1">
                  {meetupSelectorItems.map((meetup) => (
                    <button
                      key={meetup.index}
                      type="button"
                      onClick={() => setSelectedMeetupIndex(meetup.index)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-all border ${
                        displayIndex === meetup.index
                          ? "border-cyber-blue/60 bg-cyber-blue/10 text-cyber-blue"
                          : "border-white/10 bg-background/30 text-muted-foreground hover:text-foreground hover:border-white/20"
                      }`}
                    >
                      {meetup.filename}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="glass-card rounded-3xl overflow-hidden hover:scale-[1.01] transition-all duration-200"
              style={{ boxShadow: "0 0 40px -10px rgba(56,189,248,0.15), inset 0 1px 1px 0 rgba(255,255,255,0.1)" }}
            >
              <div className="relative px-8 pt-8 pb-6 border-b border-white/5">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                      <span className="mono-tag text-cyber-green">{selectedMeetup.filename}</span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">{selectedMeetup.filename}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">Connect · Learn · Build · Review past sessions</p>
                  </div>

                  <a
                    href="https://luma.com/calendar/cal-15EeqDt3eUrf1et"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-cyber text-sm font-semibold flex-shrink-0"
                  >
                    View on Luma
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex flex-wrap gap-4 mt-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyber-blue" />
                    {selectedMeetup.weekday}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyber-purple" />
                    {selectedMeetup.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyber-green" />
                    {selectedMeetup.place}
                  </div>
                </div>
              </div>

              <div className="px-8 py-8 space-y-7">
                {selectedMeetup.filenameNumber === highestNumberedMeetup?.filenameNumber && isUpcoming && (
                  <div className="flex flex-col items-center gap-6 border border-cyber-blue/20 rounded-2xl bg-cyber-blue/5 p-6">
                    <p className="mono-tag text-muted-foreground">Current meetup starts in</p>

                    <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:gap-4">
                      <DigitBlock value={countdown.days} label="Days" />
                      <span className="hidden md:block text-2xl font-bold text-cyber-blue/40 mb-5 font-mono">:</span>
                      <DigitBlock value={countdown.hours} label="Hours" />
                      <span className="hidden md:block text-2xl font-bold text-cyber-blue/40 mb-5 font-mono">:</span>
                      <DigitBlock value={countdown.minutes} label="Min" />
                      <span className="hidden md:block text-2xl font-bold text-cyber-blue/40 mb-5 font-mono">:</span>
                      <DigitBlock value={countdown.seconds} label="Sec" />
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-white/10 bg-background/25 p-5 md:p-6 text-left">
                  {renderMeetupMarkdown(selectedMeetup.markdown)}
                </div>

                <a
                  href="https://btu.mapongo.de/viewer?p=1&b=1&f=13&l=349&lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-cyber-blue transition-colors group"
                >
                  <Navigation className="w-3.5 h-3.5 group-hover:text-cyber-blue" />
                  Location guide: Find IKMZ −1 Floor on the map
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
