import I18n from "discourse-i18n";

// YOD-659 — shared helpers for the yoDEV Decisions sidebar link and banner.
//
// Decisions ships in two languages: Spanish at `/` and English at `/en`. There
// is no Portuguese edition, so Portuguese readers get the Spanish one — closer
// to them than English. Everything that is not English goes to Spanish.

export function isEnglishLocale() {
  const locale = (I18n.currentLocale() || "").toLowerCase();
  return (
    locale === "en" || locale.startsWith("en_") || locale.startsWith("en-")
  );
}

// Two settings rather than one base URL plus a derived `/en`, so DEV can point
// both at staging-decisions.yodev.dev and so neither URL has to follow a
// convention this component would silently depend on.
export function decisionsUrl() {
  const url = isEnglishLocale()
    ? settings.decisions_url_en
    : settings.decisions_url;
  return (url || "").trim();
}

// Only https URLs are rendered. A typo in an admin setting should produce a
// missing link, not a `javascript:` or protocol-relative one.
export function safeHttpsUrl(raw, hash) {
  if (!raw) {
    return null;
  }
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") {
    return null;
  }
  if (hash) {
    url.hash = hash.replace(/^#/, "");
  }
  return url.toString();
}
