export * from "./lib";
import { setStore, createDefaultStore, type Store } from "./lib/store/index";
import { initFetch } from "./lib/utils/fetch";

interface SDKOptions {
  store?: Store;
}

export function initSDK(options: SDKOptions = {}) {
  const store = options.store || createDefaultStore();
  setStore(store);
  initFetch();
}
