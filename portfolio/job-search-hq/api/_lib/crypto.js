// AES-256-GCM helpers for encrypting Gmail refresh tokens at rest in Supabase.
// Server-only — never bundled into the browser.
//
// Format on disk: base64( iv[12] || ciphertext || authTag[16] )
// Key is read from GMAIL_TOKEN_ENC_KEY (32-byte key, base64-encoded).

const { createCipheriv, createDecipheriv, randomBytes } = require("node:crypto");

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getKey() {
  const raw = (process.env.GMAIL_TOKEN_ENC_KEY || "").trim();
  if (!raw) throw new Error("GMAIL_TOKEN_ENC_KEY missing");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error(`GMAIL_TOKEN_ENC_KEY must be 32 bytes when base64-decoded; got ${key.length}`);
  }
  return key;
}

function encrypt(plaintext) {
  if (typeof plaintext !== "string" || !plaintext) {
    throw new Error("encrypt: plaintext required");
  }
  const key = getKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, enc, tag]).toString("base64");
}

function decrypt(payload) {
  if (typeof payload !== "string" || !payload) {
    throw new Error("decrypt: payload required");
  }
  const buf = Buffer.from(payload, "base64");
  if (buf.length < IV_LEN + TAG_LEN + 1) {
    throw new Error("decrypt: payload too short");
  }
  const key = getKey();
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(buf.length - TAG_LEN);
  const enc = buf.subarray(IV_LEN, buf.length - TAG_LEN);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
}

module.exports = { encrypt, decrypt };
