import { ItemStack, ScoreboardObjective, Block, Player, Entity, world } from "@minecraft/server";
import { describe, it, expect } from "vitest";

// You need to import it
import "./mixins";
import { Chunk } from "@lpsmods/mc-utils";

describe("ItemStack mixin", () => {
  const obj = new ItemStack("paper");
  it("should have startCooldown", () => {
    expect(typeof obj.startCooldown).toBe("function");
  });
  it("should have executeMolang", () => {
    expect(typeof obj.executeMolang).toBe("function");
  });
});
describe("ScoreboardObjective mixin", () => {
  const obj = world.scoreboard.addObjective("kills");
  it("should have tryGetScore", () => {
    expect(typeof obj.tryGetScore).toBe("function");
  });
});
describe("Block mixin", () => {
  const obj = world.getDimension("overworld").getBlock({ x: 0, y: 0, z: 0 });
  if (!obj) throw new Error("Block not found");
  it("should have executeMolang", () => {
    expect(typeof obj.executeMolang).toBe("function");
  });
  it("should have clearDynamicProperties", () => {
    expect(typeof obj.clearDynamicProperties).toBe("function");
  });
  it("should have getDynamicProperty", () => {
    expect(typeof obj.getDynamicProperty).toBe("function");
  });
  it("should have getDynamicPropertyIds", () => {
    expect(typeof obj.getDynamicPropertyIds).toBe("function");
  });
  it("should have getDynamicPropertyTotalByteCount", () => {
    expect(typeof obj.getDynamicPropertyTotalByteCount).toBe("function");
  });
  it("should have setDynamicProperty", () => {
    expect(typeof obj.setDynamicProperty).toBe("function");
  });
  it("should have getState", () => {
    expect(typeof obj.getState).toBe("function");
  });
  it("should have setState", () => {
    expect(typeof obj.setState).toBe("function");
  });
  it("should have incrementState", () => {
    expect(typeof obj.incrementState).toBe("function");
  });
  it("should have decrementState", () => {
    expect(typeof obj.decrementState).toBe("function");
  });
  // it("should have chunk", () => {
  //   expect(obj.chunk instanceof Chunk).toBe(true);
  // });
});
describe("Player mixin", () => {
  const obj = world.getPlayers()[0];
  it("should have applyArmor", () => {
    expect(typeof obj.applyArmor).toBe("function");
  });
});
describe("Entity mixin", () => {
  const obj = world.getEntity("0");
  if (!obj) throw new Error("Entity not found");
  it("should have executeMolang", () => {
    expect(typeof obj.executeMolang).toBe("function");
  });
  it("should have isMoving", () => {
    expect(typeof obj.isMoving).toBe("boolean");
  });
  // it("should have chunk", () => {
  //   expect(obj.chunk instanceof Chunk).toBe(true);
  // });
});
describe("String mixin", () => {
  const obj = "hello world";
  it("should have toSmartTitleCase", () => {
    expect(typeof obj.toSmartTitleCase).toBe("function");
  });
  it("should have toTitleCase", () => {
    expect(typeof obj.toTitleCase).toBe("function");
  });
  it("should have toCamelCase", () => {
    expect(typeof obj.toCamelCase).toBe("function");
  });
  it("should have toParamCase", () => {
    expect(typeof obj.toParamCase).toBe("function");
  });
  it("should have toPascalCase", () => {
    expect(typeof obj.toPascalCase).toBe("function");
  });
  it("should have toSnakeCase", () => {
    expect(typeof obj.toSnakeCase).toBe("function");
  });
  it("should have truncate", () => {
    expect(typeof obj.truncate).toBe("function");
  });
  it("should have reverse", () => {
    expect(typeof obj.reverse).toBe("function");
  });
});
