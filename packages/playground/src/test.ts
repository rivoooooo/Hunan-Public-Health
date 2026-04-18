import { getRequestInfo } from "@hnhfpc/sdk";

const info = await getRequestInfo();
console.log(JSON.stringify(info, null, 2));
