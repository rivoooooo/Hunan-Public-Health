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
