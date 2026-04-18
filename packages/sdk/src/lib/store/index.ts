import type { StoreKey } from "../../constants/store";

export interface Store {
  get<T = any>(key: StoreKey): Promise<T | null>;
  set<T = any>(key: StoreKey, value: T): Promise<void>;
  delete(key: StoreKey): Promise<void>;
  clear(): Promise<void>;
}

let globalStore: Store | null = null;

export function setStore(store: Store) {
  globalStore = store;
}

export function getStore(): Store {
  if (!globalStore) {
    throw new Error("Store not initialized. Call setStore() first.");
  }
  return globalStore;
}

export function hasStore(): boolean {
  return globalStore !== null;
}

export class MemoryStore implements Store {
  private data = new Map<string, any>();

  async get<T = any>(key: StoreKey): Promise<T | null> {
    return this.data.get(key) ?? null;
  }

  async set<T = any>(key: StoreKey, value: T): Promise<void> {
    this.data.set(key, value);
  }

  async delete(key: StoreKey): Promise<void> {
    this.data.delete(key);
  }

  async clear(): Promise<void> {
    this.data.clear();
  }
}

export class LocalStorageStore implements Store {
  async get<T = any>(key: StoreKey): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  async set<T = any>(key: StoreKey, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async delete(key: StoreKey): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sdk:")) {
        localStorage.removeItem(key);
      }
    });
  }
}

export function createDefaultStore(): Store {
  if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
    return new LocalStorageStore();
  }
  return new MemoryStore();
}
