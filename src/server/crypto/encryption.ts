import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits for GCM

function getMasterKey(): Buffer {
  const envKey = process.env.APP_ENCRYPTION_KEY;
  if (!envKey) {
    // Default deterministic fallback for development if not provided
    return crypto.scryptSync("pinforge-dev-secret-salt-2026", "pinforge-salt", 32);
  }

  if (envKey.length === 64) {
    return Buffer.from(envKey, "hex");
  }

  return crypto.scryptSync(envKey, "pinforge-salt", 32);
}

/**
 * Encrypts a plaintext string (e.g. API key) using AES-256-GCM.
 * Output format: "iv:authTag:ciphertext" (all hex)
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return "";
  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an encrypted string previously formatted with encrypt().
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return "";
  const parts = encryptedText.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted text format. Expected iv:authTag:ciphertext.");
  }

  const [ivHex, authTagHex, cipherHex] = parts;
  const key = getMasterKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(cipherHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Masks an API key for safe UI display (e.g. ••••••••1234).
 */
export function maskApiKey(key: string | null | undefined): string {
  if (!key) return "";
  const trimmed = key.trim();
  if (trimmed.length <= 4) return "••••••••";
  const suffix = trimmed.slice(-4);
  return `••••••••${suffix}`;
}
