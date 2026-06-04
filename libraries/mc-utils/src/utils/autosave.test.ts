import { describe, it } from "vitest";
import { createAutosave } from "./autosave";

describe("Autosave", () => {
  const autoSave = createAutosave((data: string) => {
    console.log("Saved: " + data);
  });

  it("Saves data after delay", () => {
    autoSave("Hello");
    autoSave("Hello w");
    autoSave("Hello world");
  });
});
