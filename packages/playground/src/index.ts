import { crptosEn, crptosTH } from "@hnhfpc/sdk";

type LoginParams = {
  username: string;
  password: string;
  captcha?: string;
  type?: string;
};

const token_en_th = {
  en: "FD36A19AC92249C0B1128CB3093BC2AF",
  th: "76645BF7D798473196467F10F6685752989A52C97226438F812AD6AE90E6640C",
};

function getPassrod({ pwd, time }: { pwd: string; time: string }) {
  return crptosEn([pwd, time].join("|"), token_en_th.en);
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

const username = Bun.env.PLAYGROUND_USERNAME;
const password = Bun.env.PLAYGROUND_PASSWORD;

if (!username || !password) {
  throw new Error("Missing PLAYGROUND_USERNAME or PLAYGROUND_PASSWORD in .env");
}

console.log(
  getLoginUrl({
    username,
    password,
  }),
);
