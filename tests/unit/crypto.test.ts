import { describe, it, expect } from "vitest";
import { encrypt, decrypt, maskApiKey } from "../../src/server/crypto/encryption";

describe("AES-256-GCM Encryption Utility", () => {
  it("should encrypt and successfully decrypt arbitrary strings", () => {
    const secretKey = "rw_live_9988223344aabbccddeeff";
    const encrypted = encrypt(secretKey);

    expect(encrypted).not.toBe(secretKey);
    expect(encrypted.split(":")).toHaveLength(3); // iv:tag:ciphertext

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(secretKey);
  });

  it("should fail decryption if auth tag or ciphertext is tampered", () => {
    const secretKey = "sk-or-v1-my-secret-key-123456";
    const encrypted = encrypt(secretKey);
    const [iv, tag, cipher] = encrypted.split(":");

    // Alter ciphertext
    const tamperedCipher = cipher.slice(0, -2) + "ff";
    expect(() => decrypt(`${iv}:${tag}:${tamperedCipher}`)).toThrow();

    // Alter auth tag
    const tamperedTag = tag.slice(0, -2) + "00";
    expect(() => decrypt(`${iv}:${tamperedTag}:${cipher}`)).toThrow();
  });

  it("should mask API keys properly displaying only the last 4 characters", () => {
    expect(maskApiKey("rw_abc12345678xyz9999")).toBe("••••••••9999");
    expect(maskApiKey("sk-or-v1-abcdef1234")).toBe("••••••••1234");
    expect(maskApiKey("abcd")).toBe("••••••••");
    expect(maskApiKey("")).toBe("");
    expect(maskApiKey(null)).toBe("");
  });
});
