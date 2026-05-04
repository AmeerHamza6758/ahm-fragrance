const FALLBACK_IMAGE = "/Images/best-1.svg";

const normalizePath = (value) =>
  String(value).replace(/\\/g, "/").replace(/^publics?\//, "");

const getApiBaseUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  return raw.replace(/\/+$/, "");
};

export function buildProductImageUrl(pathOrUrl) {
  if (!pathOrUrl) return FALLBACK_IMAGE;
  if (typeof pathOrUrl !== "string") return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const normalized = normalizePath(pathOrUrl);
  return `${getApiBaseUrl()}/${normalized}`;
}

export { FALLBACK_IMAGE };
