import { ofetch, type FetchOptions } from "ofetch";
import { API_BASE_URL, DEFAULT_HEADERS_BASE, STORE_KEYS } from "../../constants/index";
import { getStore, hasStore } from "../store/index";
import {
  readSetCookie,
  parseSetCookies,
  mergeCookies,
  cookiesToString,
  type Cookie,
} from "./cookie";

let $ofetch = ofetch.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS_BASE,
});

function createEnhancedFetch() {
  return ofetch.create({
    baseURL: API_BASE_URL,
    headers: DEFAULT_HEADERS_BASE,
    async onRequest({ options }) {
      if (!hasStore()) return;

      const store = getStore();
      const cookies: Cookie[] = (await store.get(STORE_KEYS.COOKIES)) || [];

      if (cookies.length > 0) {
        const cookieString = cookiesToString(cookies);
        const headers = new Headers(options.headers as any);
        headers.set("Cookie", cookieString);
        options.headers = headers;
      }
    },
    async onResponse({ response }) {
      if (!hasStore()) return;

      const store = getStore();
      const setCookieStrings = readSetCookie(response as unknown as Response);

      if (setCookieStrings.length > 0) {
        const newCookies = parseSetCookies(setCookieStrings);
        const existingCookies: Cookie[] = (await store.get(STORE_KEYS.COOKIES)) || [];
        const mergedCookies = mergeCookies(existingCookies, newCookies);
        await store.set(STORE_KEYS.COOKIES, mergedCookies);
      }
    },
  });
}

export function initFetch() {
  $ofetch = createEnhancedFetch();
}

export async function fetchGet(
  url: string,
  options: { headers?: Record<string, string>; redirect?: RequestInit["redirect"] } = {},
): Promise<Response> {
  const { headers = {}, redirect = "manual" } = options;
  return $ofetch.raw(url, {
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
  return $ofetch.raw(url, {
    method: "POST",
    headers,
    redirect,
  });
}

export { $ofetch };
