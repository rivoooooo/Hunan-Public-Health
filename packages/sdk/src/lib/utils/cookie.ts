export interface Cookie {
  name: string;
  value: string;
  raw: string;
}

export function readSetCookie(res: Response): string[] {
  const getSetCookie = (res.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  if (typeof getSetCookie === "function") return getSetCookie.call(res.headers);
  return (
    res.headers
      .get("set-cookie")
      ?.split(/,(?=\s*[^;,,\s]+=)/)
      .map((item: string) => item.trim()) ?? []
  );
}

export function parseSetCookies(setCookies: string[]): Cookie[] {
  return setCookies.map((setCookie) => {
    const pair = setCookie.split(";").shift()?.trim() ?? "";
    const [name, value] = pair.split("=", 2);
    return {
      name: (name ?? "").trim(),
      value: (value ?? "").trim(),
      raw: setCookie,
    };
  });
}

export function mergeCookies(existing: Cookie[], newCookies: Cookie[]): Cookie[] {
  const cookieMap = new Map<string, Cookie>();
  existing.forEach((cookie) => cookieMap.set(cookie.name, cookie));
  newCookies.forEach((cookie) => cookieMap.set(cookie.name, cookie));
  return Array.from(cookieMap.values());
}

export function cookiesToString(cookies: Cookie[]): string {
  return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}
