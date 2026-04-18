import { ofetch, type FetchOptions } from "ofetch";
import { API_BASE_URL, DEFAULT_HEADERS_BASE } from "../../constants/index";

const $ofetch = ofetch.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS_BASE,
});

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
