import { parseMonth } from "@/lib/dates";

// Newest first, the way LinkedIn lists a profile: by end date (ongoing roles
// on top), then by start date. `range(item)` returns { start, end } in months,
// either of which may be null for an unreadable date; those sink to the
// bottom and keep their existing order.
function compare(range) {
  return (a, b) => {
    const ra = range(a);
    const rb = range(b);
    const endA = ra.end ?? ra.start ?? -Infinity;
    const endB = rb.end ?? rb.start ?? -Infinity;
    if (endA !== endB) return endA < endB ? 1 : -1;
    const startA = ra.start ?? -Infinity;
    const startB = rb.start ?? -Infinity;
    if (startA !== startB) return startA < startB ? 1 : -1;
    return 0;
  };
}

export function sortByDate(items, range) {
  return [...items].sort(compare(range));
}

// Drops `item` into an already-ordered list at its chronological spot, without
// touching the order of the rest. Used while a section is in manual order.
export function insertSorted(items, item, range) {
  const cmp = compare(range);
  const index = items.findIndex((other) => cmp(item, other) < 0);
  return index === -1 ? [...items, item] : [...items.slice(0, index), item, ...items.slice(index)];
}

// Ongoing roles count as ending today, so they sort above everything else.
export const experienceRange = (item) => ({
  start: parseMonth(item.startDate),
  end: item.current ? Infinity : parseMonth(item.endDate),
});

// A study period that ends in the future is still in progress, so it sorts
// above finished ones.
export const educationRange = (item) => ({
  start: parseMonth(item.startYear),
  end: parseMonth(item.endYear),
});

// The order a section is shown in: by date, unless the user set their own.
export function orderEntries(items, range, manual) {
  return manual ? items : sortByDate(items, range);
}
