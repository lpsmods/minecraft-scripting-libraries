import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { system, world } from "@minecraft/server";
import { Macros } from "./macro";
import { MacroIntent } from "./macro/intents";

function mockWorldDynamicProperties(): void {
  const properties = new Map<string, any>();
  world.getDynamicProperty = vi.fn((name: string) => properties.get(name));
  world.setDynamicProperty = vi.fn((name: string, value: any) => {
    if (value === undefined) {
      properties.delete(name);
    } else {
      properties.set(name, value);
    }
  });
}

describe("Macros", () => {
  beforeEach(() => {
    mockWorldDynamicProperties();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the ten default macros when none are saved", () => {
    const macros = Macros.getAll();

    expect(macros).toHaveLength(10);
    expect(macros[0]).toEqual({
      id: 1,
      name: "Macro 1",
      intent: { type: "run_command", command: "say Macro 1" },
    });
    expect(macros[1].intent).toEqual({ type: "toggle_game_mode" });
  });

  it("saves one macro without dropping the other macros", () => {
    Macros.saveMacro({
      id: 2,
      name: "Creative toggle",
      intent: { type: "run_command", command: "gamemode creative" },
    });

    const macros = Macros.getAll();

    expect(macros).toHaveLength(10);
    expect(Macros.get(1)?.name).toBe("Macro 1");
    expect(Macros.get(2)).toEqual({
      id: 2,
      name: "Creative toggle",
      intent: { type: "run_command", command: "gamemode creative" },
    });
  });

  it("executes registered macro intents through the system scheduler", () => {
    const execute = vi.fn();
    const run = vi.spyOn(system, "run").mockImplementation((callback) => {
      callback();
      return 1;
    });
    const player = { sendMessage: vi.fn() };
    const intent = { execute, options: { name: "Test Intent" } } as unknown as MacroIntent;
    MacroIntent.all.set("test_intent", intent);
    Macros.saveMacro({ id: 1, name: "Test", intent: { type: "test_intent" } });

    Macros.execute(1, player as any);

    expect(run).toHaveBeenCalledOnce();
    expect(execute).toHaveBeenCalledWith(player, { type: "test_intent" });
    MacroIntent.all.delete("test_intent");
  });

  it("reports unknown macro ids and unknown intent types", () => {
    const player = { sendMessage: vi.fn() };

    Macros.execute(99, player as any);
    Macros.saveMacro({ id: 1, name: "Broken", intent: { type: "missing_intent" } });
    Macros.execute(1, player as any);

    expect(player.sendMessage).toHaveBeenNthCalledWith(1, "Unknown macro 99");
    expect(player.sendMessage).toHaveBeenNthCalledWith(2, "Unknown action missing_intent");
  });
});
