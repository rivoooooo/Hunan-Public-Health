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

export async function fetchGet(
  url: string,
  options: { headers?: Record<string, string>; redirect?: RequestInit["redirect"] } = {},
): Promise<Response> {
  const { headers = {}, redirect = "manual" } = options;
  return fetch(url, {
    method: "GET",
    headers,
    redirect,
  });
}

export async function fetchPost(
  url: string,
  options: { headers?: Record<string, string>; redirect?: RequestInit["redirect"] } = {},
): Promise<Response> {
  const { headers = {}, redirect = "manual" } = options;
  return fetch(url, {
    method: "POST",
    headers,
    redirect,
  });
}
