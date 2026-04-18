import { Hex, type ByteArray } from "./hex";
import { llmdnfff, llmdnth } from "./llmdnfff";

type Sm3Like = {
  update(input: ByteArray, offset: number, length: number): void;
  doFinal(): ByteArray;
};

type Sm4Like = {
  encrypt_ecb(key: ByteArray, plainBytes: ByteArray): ByteArray | null;
  decrypt_ecb(key: ByteArray, cipherBytes: ByteArray): ByteArray | null;
};

const Sm3Ctor = llmdnth as unknown as new () => Sm3Like;
const Sm4Ctor = llmdnfff as unknown as new () => Sm4Like;

function ensureResult(result: ByteArray | null, message: string): ByteArray {
  if (!result) {
    throw new Error(message);
  }
  return result;
}

export function paramsAsciiSort(
  params: Record<string, string | number | boolean>,
  appSecret: string,
): string {
  const pairs = Object.keys(params)
    .sort()
    .map((key) => `${key}=${String(params[key])}`);

  return `${pairs.join("&")}&app_secret=${appSecret}`;
}

export function crptosTH(input: string): string {
  const inputBytes = Hex.utf8StrToBytes(input);
  const sm3 = new Sm3Ctor();

  sm3.update(inputBytes, 0, inputBytes.length);
  const digestBytes = sm3.doFinal();

  return Hex.encode(digestBytes, 0, digestBytes.length);
}

export function crptosEn(plainText: string, keyText: string): string {
  const plainHex = Hex.utf8StrToHex(plainText).toUpperCase();
  const plainBytes = Hex.utf8StrToBytes(plainHex);
  const keyBytes = Hex.utf8StrToBytes(keyText);

  const sm4 = new Sm4Ctor();
  const encrypted = ensureResult(sm4.encrypt_ecb(keyBytes, plainBytes), "SM4 ECB encrypt failed");

  return Hex.encode(encrypted, 0, encrypted.length);
}

export function crptosDe(cipherHex: string, keyText: string): string {
  const cipherBytes = Hex.decode(cipherHex);
  if (!cipherBytes) {
    throw new Error("Invalid cipher hex string");
  }

  const keyBytes = Hex.utf8StrToBytes(keyText);
  const sm4 = new Sm4Ctor();
  const decrypted = ensureResult(sm4.decrypt_ecb(keyBytes, cipherBytes), "SM4 ECB decrypt failed");

  return Hex.hexToUtf8Str(Hex.bytesToUtf8Str(decrypted));
}
