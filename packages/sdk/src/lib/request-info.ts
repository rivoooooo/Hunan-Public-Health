export type RequestHop = {
  hop: number;
  requestUrl: string;
  status: number;
  location: string | null;
  nextUrl: string | null;
};

export type RequestCookie = {
  name: string;
  value: string;
  raw: string;
};

export type RequestInfo = {
  startUrl: string;
  finalUrl: string;
  token: string;
  hops: RequestHop[];
  visitedUrls: string[];
  cookies: RequestCookie[];
};

type RequestInfoOptions = {
  startUrl?: string;
  maxHops?: number;
  headers?: Record<string, string>;
};

const DEFAULT_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  "sec-ch-ua": 'Google Chrome"; v="147", "Not.A/Brand"; v="8", "Chromium"; v="147',
  "Upgrade-Insecure-Requests": "1",
};

export async function getRequestInfo(options: RequestInfoOptions = {}): Promise<RequestInfo> {
  const headers = options.headers ?? DEFAULT_HEADERS;
  const startUrl = options.startUrl ?? "https://ggws.hnhfpc.gov.cn/Index.aspx";
  const maxHops = options.maxHops ?? 10;

  const readSetCookie = (res: Response): string[] => {
    const getSetCookie = (res.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
    if (typeof getSetCookie === "function") return getSetCookie.call(res.headers);
    return (
      res.headers
        .get("set-cookie")
        ?.split(/,(?=\s*[^;,\s]+=)/)
        .map((item: string) => item.trim()) ?? []
    );
  };

  const extractLocation = async (res: Response): Promise<string | null> => {
    const headerLocation = res.headers.get("location");
    if (headerLocation) return headerLocation;

    const body = await res.text();
    const scriptLocationMatch =
      body.match(/window\.location(?:\.href)?\s*=\s*["']([^"']+)["']/i) ??
      body.match(/top\.location(?:\.href)?\s*=\s*["']([^"']+)["']/i);
    const metaRefreshMatch = body.match(
      /<meta[^>]+http-equiv=["']refresh["'][^>]*content=["'][^"']*url=([^"'>\s]+)[^"']*["']/i,
    );

    return scriptLocationMatch?.[1] ?? metaRefreshMatch?.[1] ?? null;
  };

  const visitedUrls: string[] = [];
  const hops: RequestHop[] = [];
  const allSetCookies: string[] = [];

  let currentUrl = startUrl;

  for (let hop = 0; hop < maxHops; hop++) {
    const res = await fetch(currentUrl, {
      method: "GET",
      redirect: "manual",
      headers,
    });

    visitedUrls.push(currentUrl);
    allSetCookies.push(...readSetCookie(res));

    const location = await extractLocation(res);
    const nextUrl = location ? new URL(location, currentUrl).toString() : null;
    hops.push({
      hop,
      requestUrl: currentUrl,
      status: res.status,
      location,
      nextUrl,
    });

    if (!location) break;

    currentUrl = nextUrl ?? currentUrl;
  }

  const token =
    [...visitedUrls]
      .reverse()
      .map((url) => {
        try {
          return new URL(url).searchParams.get("Token");
        } catch {
          return null;
        }
      })
      .find((value) => value && value.length > 0) ?? "";

  const cookies = allSetCookies.reduce<RequestCookie[]>((acc, setCookie) => {
    const pair = setCookie.split(";")[0]?.trim() ?? "";
    if (!pair) return acc;

    const index = pair.indexOf("=");
    if (index <= 0) return acc;

    const name = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    if (!name) return acc;

    acc.push({ name, value, raw: setCookie });
    return acc;
  }, []);

  return {
    startUrl,
    finalUrl: visitedUrls[visitedUrls.length - 1] ?? startUrl,
    token,
    hops,
    visitedUrls,
    cookies,
  };
}
