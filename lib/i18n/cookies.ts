"use client";

export function setCookie(name: string, value: string, days = 365) {
  const maxAge = days * 24 * 60 * 60;
  const cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;

  if (typeof document !== "undefined") {
    // biome-ignore lint/suspicious/noDocumentCookie: Standard way to set cookies client-side
    document.cookie = cookie;
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) {
      return value || null;
    }
  }
  return null;
}

export function deleteCookie(name: string) {
  setCookie(name, "", -1);
}
