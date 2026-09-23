import { describe, it, expect } from "vitest";
import { parseMeetupDateTime } from "../lib/meetupParser";

describe("parseMeetupDateTime", () => {
  it("parses single line date and time with range", () => {
    const md = `
# BTU Tech Hub Meetup - 25

**BTU Tech Hub**

**Sunday, June 07** ,  **2:00 PM - 5:00 PM** **IKMZ - BTU Cottbus-Senftenberg** Cottbus, Brandenburg
    `;
    const res = parseMeetupDateTime(md);
    expect(res).not.toBeNull();
    if (res) {
      expect(res.start.getMonth()).toBe(5); // June is 5 (0-indexed)
      expect(res.start.getDate()).toBe(7);
      expect(res.start.getHours()).toBe(14); // 2:00 PM
      expect(res.start.getMinutes()).toBe(0);
      expect(res.end.getHours()).toBe(17); // 5:00 PM
      expect(res.end.getMinutes()).toBe(0);
    }
  });

  it("parses multi-line date and time", () => {
    const md = `
# BTU Tech Hub Meetup - 5

**BTU Tech Hub**

**Saturday, Nov 8, 2025**  
**10:00 AM**  
**IKMZ - BTU Cottbus-Senftenberg**  
Cottbus, Brandenburg
    `;
    const res = parseMeetupDateTime(md);
    expect(res).not.toBeNull();
    if (res) {
      expect(res.start.getFullYear()).toBe(2025);
      expect(res.start.getMonth()).toBe(10); // Nov is 10 (0-indexed)
      expect(res.start.getDate()).toBe(8);
      expect(res.start.getHours()).toBe(10); // 10:00 AM
      expect(res.start.getMinutes()).toBe(0);
    }
  });

  it("returns null when no date pattern matches", () => {
    const md = `
# No Date Meetup
    `;
    const res = parseMeetupDateTime(md);
    expect(res).toBeNull();
  });
});
