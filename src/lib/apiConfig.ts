/**
 * TERRALIGN 2.0 — API Configuration & Base URL Resolver
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * In production with a dedicated Render backend, NEXT_PUBLIC_API_URL points to
 * the deployed Render service (e.g. https://terralign-backend.onrender.com).
 * In local development or unified Vercel mode, it falls back to same-origin relative URLs.
 */

export function getApiUrl(path: string): string {
  const baseUrl = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
