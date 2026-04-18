import { login, refreshToken, getRequestInfo, crptosEn, crptosTH } from "@hnhfpc/sdk";

const username: string = Bun.env.PLAYGROUND_USERNAME || "";
const password: string = Bun.env.PLAYGROUND_PASSWORD || "";

if (!username || !password) {
  throw new Error("Missing PLAYGROUND_USERNAME or PLAYGROUND_PASSWORD in .env");
}

const token_en_th = {
  en: "FD36A19AC92249C0B1128CB3093BC2AF",
  th: "76645BF7D798473196467F10F6685752989A52C97226438F812AD6AE90E6640C",
};

function getPassrod({ pwd, time }: { pwd: string; time: string }) {
  return crptosEn([pwd, time].join("|"), token_en_th.en);
}

function getLoginUrl({
  username,
  password,
  captcha,
  type,
}: {
  username: string;
  password: string;
  captcha?: string;
  type?: string;
}) {
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

async function testLogin() {
  console.log("=== 测试登录功能 ===");

  // 先获取 cookies
  console.log("获取初始 cookies...");
  const requestInfo = await getRequestInfo();

  // 只保留最新的 cookies（去重，保留最后一个）
  const cookieMap = new Map<string, string>();
  requestInfo.cookies.forEach((cookie) => {
    for (const [name, value] of Object.entries(cookie)) {
      if (name && value) {
        cookieMap.set(name, value);
      }
    }
  });

  let cookies = Array.from(cookieMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  console.log("获取到的 cookies:");
  console.log(cookies);

  // 构建请求头，包含 cookies
  let cookieString = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");

  // 构建包含 Token 的 Referer
  const referer = `https://ggws.hnhfpc.gov.cn/Index.aspx?Token=${requestInfo.token}`;

  // 先访问登录页面获取最新的 cookies
  console.log("\n=== 访问登录页面获取最新 cookies ===");
  try {
    const loginPageRes = await fetch(referer, {
      method: "GET",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        Cookie: cookieString,
        Host: "ggws.hnhfpc.gov.cn",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
        "sec-ch-ua": '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
      },
      redirect: "manual",
    });

    console.log("登录页面状态码:", loginPageRes.status);

    // 读取新的 cookies
    const readSetCookie = (res: Response): string[] => {
      const getSetCookie = (res.headers as Headers & { getSetCookie?: () => string[] })
        .getSetCookie;
      if (typeof getSetCookie === "function") return getSetCookie.call(res.headers);
      return (
        res.headers
          .get("set-cookie")
          ?.split(/,(?=\s*[^;,,\s]+=)/)
          .map((item: string) => item.trim()) ?? []
      );
    };

    const setCookies = readSetCookie(loginPageRes);
    console.log("登录页面返回的新 cookies:", setCookies);

    // 更新 cookies
    setCookies.forEach((setCookie) => {
      const pair = setCookie.split(";").shift()?.trim() ?? "";
      const [name, value] = pair.split("=", 2);
      if (name && value) {
        cookieMap.set(name, value);
      }
    });

    // 重新构建 cookies 和 cookieString
    cookies = Array.from(cookieMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    cookieString = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
    console.log("更新后的 cookies:");
    console.log(cookies);
  } catch (error) {
    console.error("访问登录页面失败:", error);
  }

  const headers = {
    Cookie: cookieString,
    Referer: referer,
  };

  // 测试原始的 GET 请求方式
  console.log("\n=== 测试原始 GET 请求方式 ===");
  const loginUrl = getLoginUrl({ username, password });
  console.log("登录 URL:", loginUrl);
  console.log("使用的 Referer:", referer);

  try {
    const res = await fetch(loginUrl, {
      method: "GET",
      headers: {
        ...headers,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
      },
      redirect: "manual",
    });

    console.log("GET 请求状态码:", res.status);
    console.log("GET 请求响应:", await res.text());
  } catch (error) {
    console.error("GET 请求失败:", error);
  }

  // 测试 POST 请求方式
  console.log("\n=== 测试 POST 请求方式 ===");
  console.log("开始登录...");
  console.log("使用的 cookies:", cookieString);
  console.log("使用的 Referer:", referer);

  const loginResult = await login(
    {
      username,
      password,
    },
    headers,
  );

  console.log("登录结果:");
  console.log(JSON.stringify(loginResult, null, 2));

  if (loginResult.success && loginResult.data) {
    console.log("\n=== 测试刷新 Token 功能 ===");
    console.log("开始刷新 Token...");

    const refreshResult = await refreshToken(loginResult.data.cookies);

    console.log("刷新 Token 结果:");
    console.log(JSON.stringify(refreshResult, null, 2));
  }
}

testLogin().catch((error) => {
  console.error("测试失败:", error);
});
