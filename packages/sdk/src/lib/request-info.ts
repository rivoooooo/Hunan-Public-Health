import { readSetCookie } from "./utils/index";
import { API_BASE_URL, DEFAULT_HEADERS_BASE } from "../constants/index";

type RequestInfoOptions = {
  startUrl?: string;
  maxHops?: number;
  headers?: Record<string, string>;
};

export type RequestInfoResult = {
  token: string;
  cookies: Record<string, string>[];
  cookieRaw: string;
  _raw: {
    url: string;
    cookies: string[];
  }[];
};

export async function getRequestInfo(options: RequestInfoOptions = {}): Promise<RequestInfoResult> {
  const headers = options.headers ?? {
    ...DEFAULT_HEADERS_BASE,
    "sec-ch-ua": 'Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147',
    "Upgrade-Insecure-Requests": "1",
  };
  const startUrl = options.startUrl ?? API_BASE_URL;
  const maxHops = options.maxHops ?? 10;

  const extractLocation = async (res: Response): Promise<string | null> => {
    const headerLocation = res.headers.get("location");
    if (headerLocation) return headerLocation;

    try {
      // 克隆 response 以避免 body 被多次读取
      const clonedRes = res.clone();
      const body = await clonedRes.text();
      const scriptLocationMatch =
        body.match(/window\.location(?:\.href)?\s*=\s*["']([^"']+)["']/i) ??
        body.match(/top\.location(?:\.href)?\s*=\s*["']([^"']+)["']/i);
      const metaRefreshMatch = body.match(
        /<meta[^>]+http-equiv=["']refresh["'][^>]*content=["'][^"']*url=([^"'>\s]+)[^"']*["']/i,
      );

      return scriptLocationMatch?.[1] ?? metaRefreshMatch?.[1] ?? null;
    } catch (error) {
      console.warn("读取响应体失败:", error);
      return null;
    }
  };

  const rawData: { url: string; cookies: string[] }[] = [];
  let lastToken: string = "";
  const lastCookiesMap = new Map<string, string>();

  let currentUrl = startUrl;

  // 原始 fetch 函数，避免 ofetch 拦截器影响
  const rawFetch = async (url: string, options: any) => {
    const response = await fetch(url, options);
    // 克隆响应以允许多次读取
    return response;
  };

  for (let hop = 0; hop < maxHops; hop++) {
    const res = await rawFetch(currentUrl, { 
      method: 'GET',
      headers,
      redirect: 'manual' 
    });

    const setCookies = readSetCookie(res);
    rawData.push({ url: currentUrl, cookies: setCookies });

    // 收集 cookies，只保留每个 cookie 名的最后一个值
    for (const setCookie of setCookies) {
      const pair = setCookie.split(";")[0]?.trim() ?? "";
      const index = pair.indexOf("=");
      if (index > 0) {
        const name = pair.slice(0, index).trim();
        const value = pair.slice(index + 1).trim();
        lastCookiesMap.set(name, value);
      }
    }

    // 检查是否有 token
    try {
      const urlObj = new URL(currentUrl);
      const token = urlObj.searchParams.get("Token");
      if (token && token.length > 0) {
        lastToken = token;
      }
    } catch {
      // 解析 URL 错误时继续
    }

    const location = await extractLocation(res);
    const nextUrl = location ? new URL(location, currentUrl).toString() : null;

    // 检查是否满足停止条件
    let shouldStop = false;
    try {
      const urlObj = new URL(currentUrl);
      const pathname = urlObj.pathname;
      const baseUrlObj = new URL(startUrl);
      const baseHost = baseUrlObj.host;

      // 检查是否是 baseurl + Index.aspx
      if (pathname === "/Index.aspx" && urlObj.host === baseHost) {
        // 检查是否有 Token 参数并且有值
        const token = urlObj.searchParams.get("Token");
        if (token && token.length > 0) {
          // 检查是否采集到了 ASP.NET_SessionId 和 csrf_token
          if (lastCookiesMap.has("ASP.NET_SessionId") && lastCookiesMap.has("csrf_token")) {
            shouldStop = true;
          }
        }
      }
    } catch {
      // 解析 URL 错误时继续
    }

    if (!location || shouldStop) break;

    currentUrl = nextUrl ?? currentUrl;
  }

  // 构建 cookies 数组
  const cookiesArray: Record<string, string>[] = [];
  lastCookiesMap.forEach((value, key) => {
    const cookieObj: Record<string, string> = {};
    cookieObj[key] = value;
    cookiesArray.push(cookieObj);
  });

  // 构建 cookieRaw 字符串
  const cookieRaw = Array.from(lastCookiesMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");

  return {
    token: lastToken,
    cookies: cookiesArray,
    cookieRaw,
    _raw: rawData,
  };
}
