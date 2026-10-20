import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { testRunwareConnection } from "../../src/server/providers/runware";
import { testOpenRouterConnection, fetchFreeOpenRouterModels } from "../../src/server/providers/openrouter";

describe("Provider Clients & Error Mapping", () => {
  const originalEnv = process.env.PROVIDER_MODE;

  beforeEach(() => {
    process.env.PROVIDER_MODE = "mock";
  });

  afterEach(() => {
    process.env.PROVIDER_MODE = originalEnv;
  });

  describe("Runware Test Connection", () => {
    it("detects valid key in mock mode", async () => {
      const res = await testRunwareConnection("mock_runware_key_valid_1234");
      expect(res.success).toBe(true);
      expect(res.status).toBe("connected");
      expect(res.cost).toBeDefined();
    });

    it("maps invalid key to invalid_key status", async () => {
      const res = await testRunwareConnection("mock_invalid_key");
      expect(res.success).toBe(false);
      expect(res.status).toBe("invalid_key");
    });

    it("maps exhausted balance to no_credit status", async () => {
      const res = await testRunwareConnection("mock_nocredit_key");
      expect(res.success).toBe(false);
      expect(res.status).toBe("no_credit");
    });

    it("handles empty key gracefully", async () => {
      const res = await testRunwareConnection("");
      expect(res.success).toBe(false);
      expect(res.status).toBe("invalid_key");
    });
  });

  describe("OpenRouter Test Connection", () => {
    it("detects valid key in mock mode", async () => {
      const res = await testOpenRouterConnection("mock_openrouter_key_valid_5678");
      expect(res.success).toBe(true);
      expect(res.status).toBe("connected");
    });

    it("maps rate limits to rate_limited status", async () => {
      const res = await testOpenRouterConnection("mock_ratelimit_key");
      expect(res.success).toBe(false);
      expect(res.status).toBe("rate_limited");
    });

    it("returns free models list with nonzero context lengths", async () => {
      const models = await fetchFreeOpenRouterModels();
      expect(models.length).toBeGreaterThan(0);
      expect(models[0].id).toContain(":free");
      expect(models[0].context_length).toBeGreaterThan(0);
    });
  });
});
