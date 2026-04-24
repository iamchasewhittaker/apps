import { describe, it, expect } from "vitest";
import { fingerprint } from "../fingerprint";

describe("fingerprint", () => {
  it("is deterministic for the same ids", () => {
    expect(fingerprint(["a", "b"])).toBe(fingerprint(["a", "b"]));
  });

  it("is order-independent", () => {
    expect(fingerprint(["b", "a"])).toBe(fingerprint(["a", "b"]));
  });

  it("produces different results for different inputs", () => {
    expect(fingerprint(["a"])).not.toBe(fingerprint(["b"]));
  });

  it("returns a 64-char hex string (sha256)", () => {
    expect(fingerprint(["x"])).toMatch(/^[0-9a-f]{64}$/);
  });
});
