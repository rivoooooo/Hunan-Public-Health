import { initSDK, completeLogin, refreshToken, getStore, STORE_KEYS } from "@hnhfpc/sdk";

const username: string = Bun.env.PLAYGROUND_USERNAME || "";
const password: string = Bun.env.PLAYGROUND_PASSWORD || "";

if (!username || !password) {
  throw new Error("Missing PLAYGROUND_USERNAME or PLAYGROUND_PASSWORD in .env");
}

// 初始化 SDK
initSDK();

async function testLogin() {
  console.log("=== 测试登录功能 ===\n");

  // 测试一站式登录
  console.log("使用 completeLogin 一站式登录...");
  const loginResult = await completeLogin({ username, password });
  console.log("登录结果:");
  console.log(JSON.stringify(loginResult, null, 2));

  if (loginResult.success && loginResult.data) {
    console.log("\n=== 测试刷新 Token 功能 ===");
    console.log("从 store 读取 cookies 刷新...");
    const refreshResult = await refreshToken();

    console.log("刷新结果:");
    console.log(JSON.stringify(refreshResult, null, 2));

    console.log("\n=== 验证 store 数据 ===");
    const store = getStore();
    const token = await store.get(STORE_KEYS.TOKEN);
    const cookies = await store.get(STORE_KEYS.COOKIES);
    const storedUsername = await store.get(STORE_KEYS.USERNAME);
    console.log("Token:", token);
    console.log("Username:", storedUsername);
    console.log("Cookies count:", cookies?.length ?? 0);
  }
}

testLogin().catch((error) => {
  console.error("测试失败:", error);
});
