import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate } from "./format";

describe("Vietnamese display formats", () => {
  it("formats VND without fractional digits", () => {
    expect(formatCurrency(1_500_000)).toMatch(/1\.500\.000/);
  });

  it("formats ISO dates as dd/MM/yyyy", () => {
    expect(formatDate("2026-09-19T00:00:00.000Z")).toBe("19/09/2026");
  });
});
