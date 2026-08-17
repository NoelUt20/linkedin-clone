const COLORS = [
  "#0a66c2",
  "#057642",
  "#b24020",
  "#7a2e8e",
  "#8f5849",
  "#00838f",
  "#5b4fc4",
  "#c0392b",
  "#2c5f2d",
  "#1f6feb",
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name) {
  const letters = name
    .split(/\s+/)
    .map((word) => word.match(/[A-Za-z]/)?.[0])
    .filter(Boolean);
  return (letters.slice(0, 2).join("") || "?").toUpperCase();
}

export function generateMonogramDataUrl(name) {
  const initials = getInitials(name);
  const color = COLORS[hashString(name) % COLORS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="${color}"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="38" fill="#ffffff" font-weight="600">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
