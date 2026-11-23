// Dates are free text ("Jan 2022", "juni 2025", "2019"), so durations are
// best-effort: anything without a 4-digit year is skipped.
const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, maj: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, okt: 9, nov: 10, dec: 11,
};

function parseMonth(text) {
  const year = text?.match(/\b(\d{4})\b/);
  if (!year) return null;
  const word = text.toLowerCase().match(/[a-zåäö]{3,}/);
  const month = word ? MONTHS[word[0].slice(0, 3)] : undefined;
  return Number(year[1]) * 12 + (month ?? 0);
}

function nowMonth() {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
}

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
