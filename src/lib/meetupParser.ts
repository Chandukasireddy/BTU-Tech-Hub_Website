export function parseMeetupDateTime(markdown: string): { start: Date; end: Date } | null {
  const lines = markdown.split(/\r?\n/);

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let dateLineIdx = -1;
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const line = lines[i];
    if (weekdays.some((day) => line.includes(day))) {
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
    january: 0,
    jan: 0,
    february: 1,
    feb: 1,
    march: 2,
    mar: 2,
    april: 3,
    apr: 3,
    may: 4,
    june: 5,
    jun: 5,
    july: 6,
    jul: 6,
    august: 7,
    aug: 7,
    september: 8,
    sep: 8,
    sept: 8,
    october: 9,
    oct: 9,
    november: 10,
    nov: 10,
    december: 11,
    dec: 11,
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
    const parts = timeStr.split("-").map((p) => p.trim());
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

