import type { ByteArray } from "./hex";

export function arrayCopy(
  source: ByteArray,
  sourceStart: number,
  target: ByteArray,
  targetStart: number,
  length: number,
): void {
  for (let i = 0; i < length; i++) {
    target[targetStart + i] = source[sourceStart + i] ?? 0;
  }
}

export function longToByte(value: number): ByteArray {
  return [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff];
}

export function intToByte(value: number): ByteArray {
  return longToByte(value);
}

export function intArrayToByteArray(values: number[]): ByteArray {
  const output: ByteArray = Array.from({ length: values.length * 4 }, () => 0);
  for (let i = 0; i < values.length; i++) {
    const bytes = intToByte(values[i] ?? 0);
    arrayCopy(bytes, 0, output, i * 4, 4);
  }
  return output;
}

export function byteToInt(bytes: ByteArray, offset = 0): number {
  const b0 = bytes[offset] ?? 0;
  const b1 = bytes[offset + 1] ?? 0;
  const b2 = bytes[offset + 2] ?? 0;
  const b3 = bytes[offset + 3] ?? 0;
  return ((b0 & 0xff) << 24) | ((b1 & 0xff) << 16) | ((b2 & 0xff) << 8) | (b3 & 0xff);
}

export function byteArrayToIntArray(bytes: ByteArray): number[] {
  const intCount = Math.floor(bytes.length / 4);
  const output = Array.from({ length: intCount }, () => 0);
  for (let i = 0; i < intCount; i++) {
    output[i] = byteToInt(bytes, i * 4);
  }
  return output;
}
