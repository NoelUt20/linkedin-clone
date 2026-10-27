const WORDS = [
  "strategy", "growth", "team", "design", "market", "customer", "roadmap", "insight",
  "quarterly", "results", "platform", "research", "impact", "process", "product",
  "launch", "metrics", "analysis", "framework", "vision", "delivery", "scale",
  "experience", "workflow", "revenue", "partners", "objectives", "review", "data",
  "the", "and", "of", "for", "with", "to", "our", "a", "in", "across", "new",
];

function pick() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function sentence(min, max) {
  const length = min + Math.floor(Math.random() * (max - min + 1));
  const words = Array.from({ length }, pick);
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(" ");
}

// Random filler for the fake PDF thumbnails — a heading plus a few paragraphs.
// Generated once when a document is created and stored with it, so the
// preview stays the same across reloads.
export function generatePlaceholderDocument() {
  return {
    heading: sentence(2, 4),
    paragraphs: Array.from({ length: 4 }, () => `${sentence(12, 20)}. ${sentence(10, 16)}.`),
    pageCount: 2 + Math.floor(Math.random() * 22),
  };
}
