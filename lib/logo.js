// LinkedIn's own logo files aren't publicly available, so logos are each
// organisation's website icon, fetched from Google's favicon service by the
// domain stored with the organisation.
const FAVICON_SERVICE = "https://www.google.com/s2/favicons";

export function logoUrl(domain) {
  return `${FAVICON_SERVICE}?domain=${encodeURIComponent(domain)}&sz=128`;
}

// The favicon service answers with a generic 16px globe when it has no icon for
// a site, so a service logo that loads at 16px or less is treated as missing.
export const GENERIC_ICON_MAX_WIDTH = 16;

export function isServiceLogo(logo) {
  return Boolean(logo?.startsWith(FAVICON_SERVICE));
}

// Logos filled in automatically (a service URL, or the generated monogram) as
// opposed to a picture the user uploaded.
export function isAutoLogo(logo) {
  return !logo || logo.startsWith(FAVICON_SERVICE) || logo.startsWith("data:image/svg+xml");
}

function fold(text) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

export function findOrganization(options, name) {
  const wanted = fold(name);
  if (!wanted) return undefined;
  return options.find((option) =>
    [option.name, ...option.aliases].some((candidate) => fold(candidate) === wanted)
  );
}

// The logo an entry should be saved with: an uploaded picture always wins;
// otherwise the matching organisation's logo, or none for a custom name.
export function resolveLogo(options, name, currentLogo) {
  if (currentLogo && !isAutoLogo(currentLogo)) return currentLogo;
  const match = findOrganization(options, name);
  return match ? logoUrl(match.domain) : null;
}

// The logo to show for a saved entry. Entries made before the organisation
// lists existed (or typed by hand) have none, or a generated monogram, so look
// the name up again; an uploaded picture is always kept.
export function displayLogo(options, name, logo) {
  if (logo && !isAutoLogo(logo)) return logo;
  const match = findOrganization(options, name);
  return match ? logoUrl(match.domain) : logo;
}
