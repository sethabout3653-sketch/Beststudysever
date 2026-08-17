// Embedded high-fidelity vector icons as SVG data URIs and official CDN URLs for cloaking

export const FROSTED_ICON_SVG = `data:image/svg+xml,${encodeURIComponent(
  `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="16" fill="#0f172a"/>
  <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="15.25" stroke="#1e293b" stroke-width="1.5"/>
  <g stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="32,18 52,26 32,34 12,26" fill="none"/>
    <path d="M20,29.5 L20,38 C20,44 44,44 44,38 L44,29.5" fill="none"/>
    <path d="M32,26 L45,34 L45,41" stroke-width="2.5" fill="none"/>
  </g>
  <circle cx="32" cy="26" r="2.5" fill="#ffffff"/>
</svg>
`.trim(),
)}`;

export const CLASSROOM_FAVICON = "https://ssl.gstatic.com/classroom/favicon.png";
export const DRIVE_FAVICON =
  "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png";
export const DOCS_FAVICON =
  "https://ssl.gstatic.com/images/branding/product/1x/docs_2020q4_32dp.png";
export const SLIDES_FAVICON =
  "https://ssl.gstatic.com/images/branding/product/1x/slides_2020q4_32dp.png";
export const GOOGLE_FAVICON = "https://www.google.com/favicon.ico";
export const CANVAS_FAVICON = "https://www.google.com/s2/favicons?domain=instructure.com&sz=128";
export const SCHOOLOGY_FAVICON = "https://www.google.com/s2/favicons?domain=schoology.com&sz=128";
export const CLEVER_FAVICON = "https://www.google.com/s2/favicons?domain=clever.com&sz=128";
export const EDPUZZLE_FAVICON = "https://www.google.com/s2/favicons?domain=edpuzzle.com&sz=128";
export const DESMOS_FAVICON = "https://www.google.com/s2/favicons?domain=desmos.com&sz=128";
export const KHAN_FAVICON = "https://www.google.com/s2/favicons?domain=khanacademy.org&sz=128";

/**
 * Returns a high-res real favicon URL for any domain or full URL using Google's Favicon CDN
 */
export function getFaviconUrl(target: string): string {
  if (!target) return FROSTED_ICON_SVG;
  try {
    let hostname = target.trim();
    if (hostname.startsWith("http://") || hostname.startsWith("https://")) {
      hostname = new URL(hostname).hostname;
    } else if (hostname.includes("/")) {
      hostname = hostname.split("/")[0];
    }
    hostname = hostname.replace(/^www\./, "").toLowerCase();
    if (!hostname || hostname === "localhost" || hostname.startsWith("frosted:")) {
      return FROSTED_ICON_SVG;
    }
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`;
  } catch {
    return FROSTED_ICON_SVG;
  }
}
