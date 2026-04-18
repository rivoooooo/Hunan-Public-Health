import { crptosEn, crptosTH } from "./crypto";

type LoginParams = {
  username: string;
  password: string;
  captcha?: string;
  type?: string;
};

type LoginResult = {
  success: boolean;
  message: string;
  data?: {
    token: string;
    cookies: Array<{ name: string; value: string; raw: string }>;
  };
};

const token_en_th = {
  en: "FD36A19AC92249C0B1128CB3093BC2AF",
  th: "76645BF7D798473196467F10F6685752989A52C97226438F812AD6AE90E6640C",
};

function getPassrod({ pwd, time }: { pwd: string; time: string }) {
  return crptosEn([pwd, time].join("|"), token_en_th.en);
}

function readSetCookie(res: Response): string[] {
  const getSetCookie = (res.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  if (typeof getSetCookie === "function") return getSetCookie.call(res.headers);
  return (
    res.headers
      .get("set-cookie")
      ?.split(/,(?=\s*[^;,,\s]+=)/)
      .map((item: string) => item.trim()) ?? []
  );
}

function getLoginUrl({ username, password, captcha, type }: LoginParams) {
  const time = new Date().getTime().toString();
  const pwd = getPassrod({
    pwd: password,
    time,
  });
  const sign = crptosTH(`${pwd}${token_en_th.th}`);
  const _URL_ = new URL("https://ggws.hnhfpc.gov.cn/ashx/LoginHandler.ashx");
  _URL_.searchParams.set("action", "LOGIN");
  _URL_.searchParams.set("YONGHUMING", username);
  _URL_.searchParams.set("MIMA", pwd);
  _URL_.searchParams.set("SIGN", sign);
  _URL_.searchParams.set("t", time);
  _URL_.searchParams.set("YANZHENGMA", captcha ?? "");
  _URL_.searchParams.set("TYPE", type ?? "1");
  return _URL_.toString();
}

export async function login(
  params: LoginParams,
  headers?: Record<string, string>,
): Promise<LoginResult> {
  const loginUrl = getLoginUrl(params);

  const defaultHeaders: Record<string, string> = {
    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Length": "0",
    Host: "ggws.hnhfpc.gov.cn",
    Origin: "https://ggws.hnhfpc.gov.cn",
    Pragma: "no-cache",
    Referer: "https://ggws.hnhfpc.gov.cn/Index.aspx",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua": '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    ...headers,
  };

  try {
    const res = await fetch(loginUrl, {
      method: "POST",
      headers: defaultHeaders,
      redirect: "manual",
    });

    const setCookies = readSetCookie(res);
    let cookies = setCookies.map((setCookie) => {
      const pair = setCookie.split(";").shift()?.trim() ?? "";
      const [name, value] = pair.split("=", 2);
      return {
        name: (name ?? "").trim(),
        value: (value ?? "").trim(),
        raw: setCookie,
      };
    });

    const responseBody = await res.text();

    if (res.status === 200) {
      try {
        const data = JSON.parse(responseBody);

        // 处理响应格式
        if (data.opType !== undefined) {
          if (data.opType === 0) {
            // 登录成功，添加用户名 cookie
            cookies.push({
              name: "username_yljgxm",
              value: params.username,
              raw: `username_yljgxm=${params.username}`,
            });

            return {
              success: true,
              message: data.msg || "登录成功",
              data: {
                token: data.token || "",
                cookies,
              },
            };
          } else {
            // 登录失败
            return {
              success: false,
              message: data.msg || "登录失败",
            };
          }
        } else if (data.success) {
          // 另一种成功响应格式，添加用户名 cookie
          cookies.push({
            name: "username_yljgxm",
            value: params.username,
            raw: `username_yljgxm=${params.username}`,
          });

          return {
            success: true,
            message: data.message,
            data: {
              token: data.token || "",
              cookies,
            },
          };
        } else {
          // 其他失败情况
          return {
            success: false,
            message: data.message || "登录失败",
          };
        }
      } catch (error) {
        console.error("登录响应解析失败:", error);
        return {
          success: false,
          message: `登录响应解析失败: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
    } else {
      return {
        success: false,
        message: `登录请求失败，状态码：${res.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `登录请求异常：${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function refreshToken(
  cookies: Array<{ name: string; value: string }>,
  headers?: Record<string, string>,
): Promise<LoginResult> {
  const cookieString = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");

  const defaultHeaders: Record<string, string> = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    Cookie: cookieString,
    Host: "ggws.hnhfpc.gov.cn",
    Pragma: "no-cache",
    Referer: "https://ggws.hnhfpc.gov.cn/FormMain.aspx",
    "Sec-Fetch-Dest": "iframe",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    ...headers,
  };

  try {
    // 访问通知页面，触发 cookie 自动刷新
    const refreshUrl = "https://ggws.hnhfpc.gov.cn/FormNotice.aspx?LeiXing=2&PAGEINDEX=1";
    const res = await fetch(refreshUrl, {
      method: "GET",
      headers: defaultHeaders,
      redirect: "manual",
    });

    // 读取 cookies
    const setCookies = readSetCookie(res);

    // 处理 cookies
    const cookieMap = new Map<string, string>();
    // 先添加原始 cookies
    cookies.forEach((cookie) => {
      cookieMap.set(cookie.name, cookie.value);
    });
    // 再添加新的 cookies
    setCookies.forEach((setCookie) => {
      const pair = setCookie.split(";").shift()?.trim() ?? "";
      const [name, value] = pair.split("=", 2);
      if (name && value) {
        cookieMap.set(name, value);
      }
    });

    const newCookies = Array.from(cookieMap.entries()).map(([name, value]) => {
      const raw = setCookies.find((cookie) => cookie.startsWith(`${name}=`)) || `${name}=${value}`;
      return {
        name,
        value,
        raw,
      };
    });

    // 服务器会自动更新 cookies，只要有新的 set-cookie 就认为成功
    if (setCookies.length > 0 || res.status === 200) {
      return {
        success: true,
        message: setCookies.length > 0 ? "Cookies 刷新成功" : "访问成功，Cookies 已更新",
        data: {
          token: "",
          cookies: newCookies,
        },
      };
    }

    return {
      success: false,
      message: "刷新失败",
    };
  } catch (error) {
    return {
      success: false,
      message: `Token 刷新异常：${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
