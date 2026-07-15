import { describe, expect, it } from "vitest";
import { defineTrading, tradeTable } from "@lpsmods/mc-build";

describe("trading builder", () => {
  it("creates and defines a trading table", () => {
    const result = tradeTable()
      .set("tiers", [{ trades: [] }])
      .build();

    expect(result).toEqual({
      tiers: [{ trades: [] }],
    });
    expect(defineTrading(result)).toBe(result);
  });
});
