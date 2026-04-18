export const STORE_KEYS = {
  COOKIES: "sdk:cookies",
  TOKEN: "sdk:token",
  USERNAME: "sdk:username",
} as const;

export type StoreKey = (typeof STORE_KEYS)[keyof typeof STORE_KEYS];
