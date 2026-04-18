export type ByteArray = number[];

function assertByte(value: number): number {
  return value & 0xff;
}

function normalizeHex(input: string): string {
  return input.trim();
}

function nibbleToHex(nibble: number): string {
  return nibble.toString(16).toUpperCase();
}

function hexCharToNibble(char: string): number {
  const code = char.charCodeAt(0);
  if (code >= 0x30 && code <= 0x39) return code - 0x30;
  if (code >= 0x41 && code <= 0x46) return code - 0x41 + 10;
  if (code >= 0x61 && code <= 0x66) return code - 0x61 + 10;
  return -1;
}

function bytesToBase64(bytes: Uint8Array): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let output = "";

  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i] ?? 0;
    const b2 = bytes[i + 1] ?? 0;
    const b3 = bytes[i + 2] ?? 0;

    const triple = (b1 << 16) | (b2 << 8) | b3;

    output += alphabet[(triple >> 18) & 0x3f];
    output += alphabet[(triple >> 12) & 0x3f];
    output += i + 1 < bytes.length ? alphabet[(triple >> 6) & 0x3f] : "=";
    output += i + 2 < bytes.length ? alphabet[triple & 0x3f] : "=";
  }

  return output;
}

export class Hex {
  static encode(bytes: ByteArray, offset: number, length: number): string {
    const start = Math.max(0, offset);
    const end = Math.min(bytes.length, start + Math.max(0, length));

    let hex = "";
    for (let i = start; i < end; i++) {
      const value = assertByte(bytes[i] ?? 0);
      hex += nibbleToHex((value >> 4) & 0x0f);
      hex += nibbleToHex(value & 0x0f);
    }

    return hex;
  }

  static decode(hex: string | null | undefined): ByteArray | null {
    if (!hex) return null;

    const normalized = normalizeHex(hex);
    if (normalized.length === 0 || normalized.length % 2 !== 0) return null;

    const output: ByteArray = [];
    for (let i = 0; i < normalized.length; i += 2) {
      const high = hexCharToNibble(normalized[i] ?? "");
      const low = hexCharToNibble(normalized[i + 1] ?? "");
      if (high < 0 || low < 0) return null;

      output.push((high << 4) | low);
    }

    return output;
  }

  static utf8StrToHex(input: string): string {
    const bytes = this.utf8StrToBytes(input);
    return this.encode(bytes, 0, bytes.length);
  }

  static utf8StrToBytes(input: string): ByteArray {
    const encoded = encodeURIComponent(input);
    const binary = unescape(encoded);
    const output: ByteArray = [];

    for (let i = 0; i < binary.length; i++) {
      output.push(binary.charCodeAt(i));
    }

    return output;
  }

  static hexToUtf8Str(hex: string): string {
    const bytes = this.decode(hex);
    if (!bytes) {
      throw new Error("Invalid hex input");
    }

    return this.bytesToUtf8Str(bytes);
  }

  static bytesToUtf8Str(bytes: ByteArray): string {
    let binary = "";
    for (const value of bytes) {
      binary += String.fromCharCode(assertByte(value));
    }
    return decodeURIComponent(escape(binary));
  }

  static toCharCodeArray(input: string): ByteArray {
    return Array.from(input).map((char) => char.charCodeAt(0));
  }

  static arrayBufferToBase64(buffer: ArrayBuffer): string {
    return bytesToBase64(new Uint8Array(buffer));
  }
}
