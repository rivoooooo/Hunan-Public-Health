export const API_BASE_URL = "https://ggws.hnhfpc.gov.cn";
export const LOGIN_HANDLER_URL = API_BASE_URL + "/ashx/LoginHandler.ashx";
export const INDEX_URL = API_BASE_URL + "/Index.aspx";
export const FORM_MAIN_URL = API_BASE_URL + "/FormMain.aspx";
export const FORM_NOTICE_URL = API_BASE_URL + "/FormNotice.aspx?LeiXing=2&PAGEINDEX=1";

export const DEFAULT_HEADERS_BASE = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
};

export const LOGIN_HEADERS_BASE = {
  Accept: "application/json, text/javascript, */*; q=0.01",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "zh-CN,zh;q=0.9",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  "Content-Length": "0",
  Host: "ggws.hnhfpc.gov.cn",
  Origin: "https://ggws.hnhfpc.gov.cn",
  Pragma: "no-cache",
  Referer: INDEX_URL,
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "X-Requested-With": "XMLHttpRequest",
  "sec-ch-ua": '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  ...DEFAULT_HEADERS_BASE,
};

export const REFRESH_TOKEN_HEADERS_BASE = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "zh-CN,zh;q=0.9",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  Host: "ggws.hnhfpc.gov.cn",
  Pragma: "no-cache",
  Referer: FORM_MAIN_URL,
  "Sec-Fetch-Dest": "iframe",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Upgrade-Insecure-Requests": "1",
  "sec-ch-ua": '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  ...DEFAULT_HEADERS_BASE,
};

export const TOKEN_EN_TH = {
  en: "FD36A19AC92249C0B1128CB3093BC2AF",
  th: "76645BF7D798473196467F10F6685752989A52C97226438F812AD6AE90E6640C",
};
