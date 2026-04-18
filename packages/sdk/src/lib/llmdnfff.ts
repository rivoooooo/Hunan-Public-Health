import {
  arrayCopy,
  byteArrayToIntArray,
  byteToInt,
  intArrayToByteArray,
  intToByte,
  longToByte,
} from "./byte-utils";
import type { ByteArray } from "./hex";

export { arrayCopy, byteArrayToIntArray, byteToInt, intArrayToByteArray, intToByte, longToByte };

function rotateLeft32(value: number, shift: number): number {
  const normalized = shift & 31;
  return ((value << normalized) | (value >>> (32 - normalized))) >>> 0;
}

function toUint32(value: number): number {
  return value >>> 0;
}

const SM3_IV: number[] = [
  0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600, 0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e,
];

const SM3_TJ: number[] = Array.from({ length: 64 }, (_, i) => (i <= 15 ? 0x79cc4519 : 0x7a879d8a));

const SM4_SBOX: number[] = [
  0xd6, 0x90, 0xe9, 0xfe, 0xcc, 0xe1, 0x3d, 0xb7, 0x16, 0xb6, 0x14, 0xc2, 0x28, 0xfb, 0x2c, 0x05,
  0x2b, 0x67, 0x9a, 0x76, 0x2a, 0xbe, 0x04, 0xc3, 0xaa, 0x44, 0x13, 0x26, 0x49, 0x86, 0x06, 0x99,
  0x9c, 0x42, 0x50, 0xf4, 0x91, 0xef, 0x98, 0x7a, 0x33, 0x54, 0x0b, 0x43, 0xed, 0xcf, 0xac, 0x62,
  0xe4, 0xb3, 0x1c, 0xa9, 0xc9, 0x08, 0xe8, 0x95, 0x80, 0xdf, 0x94, 0xfa, 0x75, 0x8f, 0x3f, 0xa6,
  0x47, 0x07, 0xa7, 0xfc, 0xf3, 0x73, 0x17, 0xba, 0x83, 0x59, 0x3c, 0x19, 0xe6, 0x85, 0x4f, 0xa8,
  0x68, 0x6b, 0x81, 0xb2, 0x71, 0x64, 0xda, 0x8b, 0xf8, 0xeb, 0x0f, 0x4b, 0x70, 0x56, 0x9d, 0x35,
  0x1e, 0x24, 0x0e, 0x5e, 0x63, 0x58, 0xd1, 0xa2, 0x25, 0x22, 0x7c, 0x3b, 0x01, 0x21, 0x78, 0x87,
  0xd4, 0x00, 0x46, 0x57, 0x9f, 0xd3, 0x27, 0x52, 0x4c, 0x36, 0x02, 0xe7, 0xa0, 0xc4, 0xc8, 0x9e,
  0xea, 0xbf, 0x8a, 0xd2, 0x40, 0xc7, 0x38, 0xb5, 0xa3, 0xf7, 0xf2, 0xce, 0xf9, 0x61, 0x15, 0xa1,
  0xe0, 0xae, 0x5d, 0xa4, 0x9b, 0x34, 0x1a, 0x55, 0xad, 0x93, 0x32, 0x30, 0xf5, 0x8c, 0xb1, 0xe3,
  0x1d, 0xf6, 0xe2, 0x2e, 0x82, 0x66, 0xca, 0x60, 0xc0, 0x29, 0x23, 0xab, 0x0d, 0x53, 0x4e, 0x6f,
  0xd5, 0xdb, 0x37, 0x45, 0xde, 0xfd, 0x8e, 0x2f, 0x03, 0xff, 0x6a, 0x72, 0x6d, 0x6c, 0x5b, 0x51,
  0x8d, 0x1b, 0xaf, 0x92, 0xbb, 0xdd, 0xbc, 0x7f, 0x11, 0xd9, 0x5c, 0x41, 0x1f, 0x10, 0x5a, 0xd8,
  0x0a, 0xc1, 0x31, 0x88, 0xa5, 0xcd, 0x7b, 0xbd, 0x2d, 0x74, 0xd0, 0x12, 0xb8, 0xe5, 0xb4, 0xb0,
  0x89, 0x69, 0x97, 0x4a, 0x0c, 0x96, 0x77, 0x7e, 0x65, 0xb9, 0xf1, 0x09, 0xc5, 0x6e, 0xc6, 0x84,
  0x18, 0xf0, 0x7d, 0xec, 0x3a, 0xdc, 0x4d, 0x20, 0x79, 0xee, 0x5f, 0x3e, 0xd7, 0xcb, 0x39, 0x48,
];

const SM4_FK: number[] = [0xa3b1bac6, 0x56aa3350, 0x677d9197, 0xb27022dc];

const SM4_CK: number[] = [
  0x00070e15, 0x1c232a31, 0x383f464d, 0x545b6269, 0x70777e85, 0x8c939aa1, 0xa8afb6bd, 0xc4cbd2d9,
  0xe0e7eef5, 0xfc030a11, 0x181f262d, 0x343b4249, 0x50575e65, 0x6c737a81, 0x888f969d, 0xa4abb2b9,
  0xc0c7ced5, 0xdce3eaf1, 0xf8ff060d, 0x141b2229, 0x30373e45, 0x4c535a61, 0x686f767d, 0x848b9299,
  0xa0a7aeb5, 0xbcc3cad1, 0xd8dfe6ed, 0xf4fb0209, 0x10171e25, 0x2c333a41, 0x484f565d, 0x646b7279,
];

export class llmdnth {
  private iv: number[] = [...SM3_IV];
  private readonly blockByteLength = 64;
  private dataBuffer: ByteArray = [];
  private totalLength = 0;

  ffj(x: number, y: number, z: number, index: number): number {
    return index <= 15 ? toUint32(x ^ y ^ z) : toUint32((x & y) | (x & z) | (y & z));
  }

  ggj(x: number, y: number, z: number, index: number): number {
    return index <= 15 ? toUint32(x ^ y ^ z) : toUint32((x & y) | (~x & z));
  }

  p0(value: number): number {
    return toUint32(value ^ rotateLeft32(value, 9) ^ rotateLeft32(value, 17));
  }

  p1(value: number): number {
    return toUint32(value ^ rotateLeft32(value, 15) ^ rotateLeft32(value, 23));
  }

  cycleLeft(value: number, shift: number): number {
    return rotateLeft32(value, shift);
  }

  padding(input: ByteArray): ByteArray {
    const bitLength = BigInt(this.totalLength * 8);
    const padded = [...input, 0x80];

    while ((padded.length + 8) % this.blockByteLength !== 0) {
      padded.push(0x00);
    }

    for (let i = 7; i >= 0; i--) {
      const byte = Number((bitLength >> BigInt(i * 8)) & 0xffn);
      padded.push(byte);
    }

    return padded;
  }

  iterate(blockWords: number[]): void {
    for (let offset = 0; offset < blockWords.length; offset += 16) {
      const block = blockWords.slice(offset, offset + 16);
      this.iv = this.cf(this.iv, block);
    }
  }

  expand(block: number[]): [number[], number[]] {
    const w = Array.from({ length: 68 }, () => 0);
    const wPrime = Array.from({ length: 64 }, () => 0);

    for (let i = 0; i < 16; i++) {
      w[i] = toUint32(block[i] ?? 0);
    }

    for (let i = 16; i < 68; i++) {
      const x = toUint32((w[i - 16] ?? 0) ^ (w[i - 9] ?? 0) ^ rotateLeft32(w[i - 3] ?? 0, 15));
      w[i] = toUint32(this.p1(x) ^ rotateLeft32(w[i - 13] ?? 0, 7) ^ (w[i - 6] ?? 0));
    }

    for (let i = 0; i < 64; i++) {
      wPrime[i] = toUint32((w[i] ?? 0) ^ (w[i + 4] ?? 0));
    }

    return [w, wPrime];
  }

  cf(v: number[], b: number[]): number[] {
    let a = v[0] ?? 0;
    let b0 = v[1] ?? 0;
    let c = v[2] ?? 0;
    let d = v[3] ?? 0;
    let e = v[4] ?? 0;
    let f = v[5] ?? 0;
    let g = v[6] ?? 0;
    let h = v[7] ?? 0;

    const [w, wPrime] = this.expand(b);

    for (let j = 0; j < 64; j++) {
      const ss1 = rotateLeft32(
        toUint32(toUint32(rotateLeft32(a, 12) + e) + rotateLeft32(SM3_TJ[j] ?? 0, j)),
        7,
      );
      const ss2 = toUint32(ss1 ^ rotateLeft32(a, 12));
      const tt1 = toUint32(toUint32(toUint32(this.ffj(a, b0, c, j) + d) + ss2) + (wPrime[j] ?? 0));
      const tt2 = toUint32(toUint32(toUint32(this.ggj(e, f, g, j) + h) + ss1) + (w[j] ?? 0));

      d = c;
      c = rotateLeft32(b0, 9);
      b0 = a;
      a = tt1;
      h = g;
      g = rotateLeft32(f, 19);
      f = e;
      e = this.p0(tt2);
    }

    return [
      toUint32((v[0] ?? 0) ^ a),
      toUint32((v[1] ?? 0) ^ b0),
      toUint32((v[2] ?? 0) ^ c),
      toUint32((v[3] ?? 0) ^ d),
      toUint32((v[4] ?? 0) ^ e),
      toUint32((v[5] ?? 0) ^ f),
      toUint32((v[6] ?? 0) ^ g),
      toUint32((v[7] ?? 0) ^ h),
    ];
  }

  digest(): ByteArray {
    return intArrayToByteArray(this.iv);
  }

  update(input: ByteArray, offset: number, length: number): void {
    if (length <= 0) return;

    const chunk = input.slice(offset, offset + length);
    this.totalLength += chunk.length;
    this.dataBuffer.push(...chunk);

    while (this.dataBuffer.length >= this.blockByteLength) {
      const blockBytes = this.dataBuffer.slice(0, this.blockByteLength);
      this.dataBuffer = this.dataBuffer.slice(this.blockByteLength);
      this.iterate(byteArrayToIntArray(blockBytes));
    }
  }

  doFinal(): ByteArray {
    const padded = this.padding(this.dataBuffer);
    this.iterate(byteArrayToIntArray(padded));

    const output = this.digest();

    this.iv = [...SM3_IV];
    this.dataBuffer = [];
    this.totalLength = 0;

    return output;
  }
}

export class llmdnfff {
  private readonly sbox = SM4_SBOX;
  private readonly fk = SM4_FK;
  private readonly ck = SM4_CK;

  expandKey(keyBytes: ByteArray): number[] | null {
    if (!keyBytes || keyBytes.length % 16 !== 0) return null;

    const keyWords = byteArrayToIntArray(keyBytes.slice(0, 16));
    const keyBuffer = Array.from({ length: 36 }, () => 0);
    const roundKeys = Array.from({ length: 32 }, () => 0);

    keyBuffer[0] = toUint32((keyWords[0] ?? 0) ^ (this.fk[0] ?? 0));
    keyBuffer[1] = toUint32((keyWords[1] ?? 0) ^ (this.fk[1] ?? 0));
    keyBuffer[2] = toUint32((keyWords[2] ?? 0) ^ (this.fk[2] ?? 0));
    keyBuffer[3] = toUint32((keyWords[3] ?? 0) ^ (this.fk[3] ?? 0));

    for (let i = 0; i < 32; i++) {
      const mixed = toUint32(
        (keyBuffer[i + 1] ?? 0) ^
          (keyBuffer[i + 2] ?? 0) ^
          (keyBuffer[i + 3] ?? 0) ^
          (this.ck[i] ?? 0),
      );
      keyBuffer[i + 4] = toUint32((keyBuffer[i] ?? 0) ^ this.T1(mixed));
      roundKeys[i] = keyBuffer[i + 4] ?? 0;
    }

    return roundKeys;
  }

  T1(value: number): number {
    const bytes = intToByte(value);
    const substituted: ByteArray = [
      this.sbox[bytes[0] ?? 0] ?? 0,
      this.sbox[bytes[1] ?? 0] ?? 0,
      this.sbox[bytes[2] ?? 0] ?? 0,
      this.sbox[bytes[3] ?? 0] ?? 0,
    ];
    const b = byteToInt(substituted, 0);
    return toUint32(b ^ rotateLeft32(b, 13) ^ rotateLeft32(b, 23));
  }

  one_encrypt(roundKeys: number[], blockBytes: ByteArray): ByteArray {
    const x = Array.from({ length: 36 }, () => 0);
    x[0] = byteToInt(blockBytes, 0);
    x[1] = byteToInt(blockBytes, 4);
    x[2] = byteToInt(blockBytes, 8);
    x[3] = byteToInt(blockBytes, 12);

    for (let i = 0; i < 32; i++) {
      const mixed = toUint32(
        (x[i + 1] ?? 0) ^ (x[i + 2] ?? 0) ^ (x[i + 3] ?? 0) ^ (roundKeys[i] ?? 0),
      );
      x[i + 4] = toUint32((x[i] ?? 0) ^ this.T0(mixed));
    }

    return intArrayToByteArray([x[35] ?? 0, x[34] ?? 0, x[33] ?? 0, x[32] ?? 0]);
  }

  T0(value: number): number {
    const bytes = intToByte(value);
    const substituted: ByteArray = [
      this.sbox[bytes[0] ?? 0] ?? 0,
      this.sbox[bytes[1] ?? 0] ?? 0,
      this.sbox[bytes[2] ?? 0] ?? 0,
      this.sbox[bytes[3] ?? 0] ?? 0,
    ];
    const b = byteToInt(substituted, 0);
    return toUint32(
      b ^ rotateLeft32(b, 2) ^ rotateLeft32(b, 10) ^ rotateLeft32(b, 18) ^ rotateLeft32(b, 24),
    );
  }

  pkcs7padding(data: ByteArray, mode: number): ByteArray | null {
    if (!data) return null;

    if (mode === 1) {
      const remainder = data.length % 16;
      const padLength = remainder === 0 ? 16 : 16 - remainder;
      const padded = [...data];
      for (let i = 0; i < padLength; i++) padded.push(padLength);
      return padded;
    }

    const padLength = data[data.length - 1] ?? 0;
    if (padLength <= 0 || padLength > 16 || padLength > data.length) return null;

    return data.slice(0, data.length - padLength);
  }

  encrypt_ecb(keyBytes: ByteArray, plainBytes: ByteArray): ByteArray | null {
    if (!keyBytes || keyBytes.length % 16 !== 0) return null;
    if (!plainBytes || plainBytes.length <= 0) return null;

    const roundKeys = this.expandKey(keyBytes);
    if (!roundKeys) return null;

    const blockSize = 16;
    const padded = this.pkcs7padding(plainBytes, 1);
    if (!padded) return null;

    const output: ByteArray = [];
    for (let offset = 0; offset < padded.length; offset += blockSize) {
      const block = padded.slice(offset, offset + blockSize);
      const encrypted = this.one_encrypt(roundKeys, block);
      output.push(...encrypted);
    }

    return output;
  }

  decrypt_ecb(keyBytes: ByteArray, cipherBytes: ByteArray): ByteArray | null {
    if (!keyBytes || keyBytes.length % 16 !== 0) return null;
    if (!cipherBytes || cipherBytes.length % 16 !== 0) return null;

    const roundKeys = this.expandKey(keyBytes);
    if (!roundKeys) return null;
    const reversedRoundKeys = [...roundKeys].reverse();

    const blockSize = 16;
    const decrypted: ByteArray = [];
    for (let offset = 0; offset < cipherBytes.length; offset += blockSize) {
      const block = cipherBytes.slice(offset, offset + blockSize);
      const plain = this.one_encrypt(reversedRoundKeys, block);
      decrypted.push(...plain);
    }

    return this.pkcs7padding(decrypted, 0);
  }

  encrypt_cbc(keyBytes: ByteArray, ivBytes: ByteArray, plainBytes: ByteArray): ByteArray | null {
    if (!keyBytes || keyBytes.length % 16 !== 0) return null;
    if (!ivBytes || ivBytes.length % 16 !== 0) return null;
    if (!plainBytes || plainBytes.length <= 0) return null;

    const roundKeys = this.expandKey(keyBytes);
    if (!roundKeys) return null;

    const padded = this.pkcs7padding(plainBytes, 1);
    if (!padded) return null;

    const blockSize = 16;
    const output: ByteArray = [];
    let previous = ivBytes.slice(0, blockSize);

    for (let offset = 0; offset < padded.length; offset += blockSize) {
      const block = padded.slice(offset, offset + blockSize);
      const mixed = block.map((value, i) => toUint32(value ^ (previous[i] ?? 0)) & 0xff);
      const encrypted = this.one_encrypt(roundKeys, mixed);
      output.push(...encrypted);
      previous = encrypted;
    }

    return output;
  }

  decrypt_cbc(keyBytes: ByteArray, ivBytes: ByteArray, cipherBytes: ByteArray): ByteArray | null {
    if (!keyBytes || keyBytes.length % 16 !== 0) return null;
    if (!ivBytes || ivBytes.length % 16 !== 0) return null;
    if (!cipherBytes || cipherBytes.length % 16 !== 0) return null;

    const roundKeys = this.expandKey(keyBytes);
    if (!roundKeys) return null;
    const reversedRoundKeys = [...roundKeys].reverse();

    const blockSize = 16;
    const output: ByteArray = [];
    let previous = ivBytes.slice(0, blockSize);

    for (let offset = 0; offset < cipherBytes.length; offset += blockSize) {
      const block = cipherBytes.slice(offset, offset + blockSize);
      const decryptedBlock = this.one_encrypt(reversedRoundKeys, block);
      const plainBlock = decryptedBlock.map(
        (value, i) => toUint32(value ^ (previous[i] ?? 0)) & 0xff,
      );
      output.push(...plainBlock);
      previous = block;
    }

    return this.pkcs7padding(output, 0);
  }
}
