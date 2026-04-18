import { crptosEn, crptosTH } from "../crypto/index";
import {
  readSetCookie,
  fetchGet,
  fetchPost,
  parseSetCookies,
  mergeCookies,
  type Cookie,
} from "../utils/index";
import { getStore, hasStore } from "../store/index";
import { STORE_KEYS } from "../../constants/index";
import {
  LOGIN_HANDLER_URL,
  LOGIN_HEADERS_BASE,
  REFRESH_TOKEN_HEADERS_BASE,
  FORM_NOTICE_URL,
  TOKEN_EN_TH,
} from "../../constants/index";

export type LoginParams = {
  username: string;
  password: string;
  captcha?: string;
  type?: string;
};

export type LoginResult = {
  success: boolean;
  message: string;
  data?: {
    token: string;
    cookies: Cookie[];
  };
};

function getPassrod({ pwd, time }: { pwd: string; time: string }) {
  return crptosEn([pwd, time].join("|"), TOKEN_EN_TH.en);
}

function getLoginUrl({ username, password, captcha, type }: LoginParams) {
  const time = new Date().getTime().toString();
  const pwd = getPassrod({
    pwd: password,
    time,
  });
  const sign = crptosTH(`${pwd}${TOKEN_EN_TH.th}`);
  const _URL_ = new URL(LOGIN_HANDLER_URL);
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
    ...LOGIN_HEADERS_BASE,
    ...headers,
  };

  try {
    const res = await fetchPost(loginUrl, { headers: defaultHeaders });

    const setCookies = readSetCookie(res);
    let cookies = parseSetCookies(setCookies);

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

            const result = {
              success: true,
              message: data.msg || "登录成功",
              data: {
                token: data.token || "",
                cookies,
              },
            };

            // 自动保存到 store
            if (hasStore()) {
              const store = getStore();
              await store.set(STORE_KEYS.TOKEN, result.data.token);
              await store.set(STORE_KEYS.COOKIES, result.data.cookies);
              await store.set(STORE_KEYS.USERNAME, params.username);
            }

            return result;
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

          const result = {
            success: true,
            message: data.message,
            data: {
              token: data.token || "",
              cookies,
            },
          };

          // 自动保存到 store
          if (hasStore()) {
            const store = getStore();
            await store.set(STORE_KEYS.TOKEN, result.data.token);
            await store.set(STORE_KEYS.COOKIES, result.data.cookies);
            await store.set(STORE_KEYS.USERNAME, params.username);
          }

          return result;
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
  cookies?: Cookie[],
  headers?: Record<string, string>,
): Promise<LoginResult> {
  let useCookies = cookies;

  // 如果没有提供 cookies，从 store 读取
  if (!useCookies && hasStore()) {
    const store = getStore();
    const storedCookies = await store.get(STORE_KEYS.COOKIES);
    useCookies = storedCookies || undefined;
  }

  if (!useCookies || useCookies.length === 0) {
    return {
      success: false,
      message: "没有可用的 cookies",
    };
  }

  const cookieString = useCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");

  const defaultHeaders: Record<string, string> = {
    ...REFRESH_TOKEN_HEADERS_BASE,
    Cookie: cookieString,
    ...headers,
  };

  try {
    // 访问通知页面，触发 cookie 自动刷新
    const refreshUrl = FORM_NOTICE_URL;
    const res = await fetchGet(refreshUrl, { headers: defaultHeaders });

    // 读取 cookies
    const setCookies = readSetCookie(res);
    const newCookies = parseSetCookies(setCookies);
    const mergedCookies = mergeCookies(useCookies, newCookies);

    // 服务器会自动更新 cookies，只要有新的 set-cookie 就认为成功
    if (setCookies.length > 0 || res.status === 200) {
      const result = {
        success: true,
        message: setCookies.length > 0 ? "Cookies 刷新成功" : "访问成功，Cookies 已更新",
        data: {
          token: "",
          cookies: mergedCookies,
        },
      };

      // 自动保存到 store
      if (hasStore()) {
        const store = getStore();
        await store.set(STORE_KEYS.COOKIES, result.data.cookies);
      }

      return result;
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
