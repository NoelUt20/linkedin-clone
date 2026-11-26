import { nowMonth, parseMonth } from "@/lib/dates";

// LinkedIn counts both end months, so Jun 2025 – Nov 2026 is "1 yr 6 mos".
function formatMonths(months) {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rest) parts.push(`${rest} mo${rest > 1 ? "s" : ""}`);
  return parts.join(" ");
}

// `entries` are { startDate, endDate, current }; the span runs from the
// earliest start to the latest end (or today, if any is current).
export function formatSpan(entries) {
  const starts = entries.map((e) => parseMonth(e.startDate)).filter((m) => m !== null);
  const ends = entries.map((e) => (e.current ? nowMonth() : parseMonth(e.endDate)));
  if (!starts.length || ends.some((m) => m === null)) return "";
  const months = Math.max(...ends) - Math.min(...starts) + 1;
  return months > 0 ? formatMonths(months) : "";
}
