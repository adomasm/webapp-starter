import { afterEach, describe, expect, it, vi } from "vitest";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { supabaseAuth } from "./jwt-auth";

afterEach(() => vi.unstubAllEnvs());

describe("Supabase shared-secret authentication", () => {
  it("accepts HS256 and rejects tokens signed with another algorithm", async () => {
    const secret = "test-only-supabase-secret-with-at-least-32-bytes";
    vi.stubEnv("SUPABASE_JWT_SECRET", secret);
    const app = new Hono();
    app.use("/*", supabaseAuth());
    app.get("/", (c) => c.text("authenticated"));
    const payload = { sub: "test-user", exp: Math.floor(Date.now() / 1000) + 60 };
    for (const [algorithm, status] of [["HS256", 200], ["HS384", 401]] as const) {
      const token = await sign(payload, secret, algorithm);
      const response = await app.request("/", { headers: { Authorization: `Bearer ${token}` } });
      expect(response.status).toBe(status);
    }
    expect((await app.request("/")).status).toBe(401);
  });
});
