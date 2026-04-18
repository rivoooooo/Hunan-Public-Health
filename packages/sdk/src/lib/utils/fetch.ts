import { ofetch } from "ofetch";
import { API_BASE_URL, DEFAULT_HEADERS_BASE, STORE_KEYS } from "../../constants/index";
import { getStore, hasStore } from "../store/index";
import { cookiesToString, type Cookie } from "./cookie";

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
  });
}

export function initFetch() {
  $ofetch = createEnhancedFetch();
}

// 使用标准 fetch API 来避免 ofetch 的问题
export async function fetchGet(
  url: string,
  options: { headers?: Record<string, string>; redirect?: RequestInit["redirect"] } = {},
): Promise<Response> {
  const { headers = {}, redirect = "manual" } = options;
  
  // 构建完整 URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  // 构建请求配置
  const config: RequestInit = {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS_BASE,
      ...headers,
    },
    redirect,
  };
  
  // 添加 cookies（如果有）
  if (hasStore()) {
    const store = getStore();
    const cookies: Cookie[] = (await store.get(STORE_KEYS.COOKIES)) || [];
    if (cookies.length > 0) {
      const cookieString = cookiesToString(cookies);
      (config.headers as Record<string, string>).Cookie = cookieString;
    }
  }
  
  return fetch(fullUrl, config);
}

export async function fetchPost(
  url: string,
  options: { headers?: Record<string, string>; redirect?: RequestInit["redirect"] } = {},
): Promise<Response> {
  const { headers = {}, redirect = "manual" } = options;
  
  // 构建完整 URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  // 构建请求配置
  const config: RequestInit = {
    method: "POST",
    headers: {
      ...DEFAULT_HEADERS_BASE,
      ...headers,
    },
    redirect,
  };
  
  // 添加 cookies（如果有）
  if (hasStore()) {
    const store = getStore();
    const cookies: Cookie[] = (await store.get(STORE_KEYS.COOKIES)) || [];
    if (cookies.length > 0) {
      const cookieString = cookiesToString(cookies);
      (config.headers as Record<string, string>).Cookie = cookieString;
    }
  }
  
  return fetch(fullUrl, config);
}

export { $ofetch };
