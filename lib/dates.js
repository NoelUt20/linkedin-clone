// Dates are stored as "YYYY-MM", which is what <input type="month"> produces.
// Profiles saved before the month pickers hold free text ("Jan 2022",
// "juni 2025", "2019"), so every reader here accepts both.
const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, maj: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, okt: 9, nov: 10, dec: 11,
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ISO_MONTH = /^(\d{4})-(\d{2})$/;

// Months since year 0 (year * 12 + month index), or null without a 4-digit year.
export function parseMonth(text) {
  if (!text) return null;
  const iso = text.match(ISO_MONTH);
  if (iso) return Number(iso[1]) * 12 + Number(iso[2]) - 1;
  const year = text.match(/\b(\d{4})\b/);
  if (!year) return null;
  const word = text.toLowerCase().match(/[a-zåäö]{3,}/);
  const month = word ? MONTHS[word[0].slice(0, 3)] : undefined;
  return Number(year[1]) * 12 + (month ?? 0);
}

export function nowMonth() {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
}

// "2024-01" -> "Jan 2024". Legacy free text is shown as the user wrote it.
export function formatMonthValue(text) {
  if (!text) return "";
  const months = text.match(ISO_MONTH) ? parseMonth(text) : null;
  if (months === null) return text;
  return `${MONTH_NAMES[months % 12]} ${Math.floor(months / 12)}`;
}

// Converts whatever was saved into a value a month input accepts ("" if it
// can't be read), so old entries open pre-filled in the picker.
export function toMonthInput(text) {
  const months = parseMonth(text);
  if (months === null) return "";
  return `${Math.floor(months / 12)}-${String((months % 12) + 1).padStart(2, "0")}`;
}
