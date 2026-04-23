import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

export const KEY_VERSION = 1;

const ALG = "aes-256-gcm";
const IV_BYTES = 12;
const KEY_BYTES = 32;

export type Encrypted = {
  iv: string;
  ciphertext: string;
  tag: string;
};

function getKey(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("TOKEN_ENCRYPTION_KEY is not set");
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== KEY_BYTES) {
    throw new Error(
      `TOKEN_ENCRYPTION_KEY must decode to ${KEY_BYTES} bytes (got ${key.length})`
    );
  }
  return key;
}

export function encrypt(plaintext: string): Encrypted {
  const key = getKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALG, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("base64"),
    ciphertext: enc.toString("base64"),
    tag: tag.toString("base64"),
  };
}

export function decrypt(enc: Encrypted): string {
  const key = getKey();
  const iv = Buffer.from(enc.iv, "base64");
  const ciphertext = Buffer.from(enc.ciphertext, "base64");
  const tag = Buffer.from(enc.tag, "base64");
  const decipher = createDecipheriv(ALG, key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plain.toString("utf8");
}

export function maskToken(token: string): string {
  const last = token.slice(-4);
  return `\u2022\u2022\u2022\u2022\u2022${last}`;
}

export function keysEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}
