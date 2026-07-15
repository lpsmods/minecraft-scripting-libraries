import { describe, expect, it } from "vitest";
import { renderController, renderControllers } from "@lpsmods/mc-build";

describe("render controller builder", () => {
  it("create a valid render controller", () => {
    const result = renderControllers("render.controller.example", renderController().build()).build();
    expect(result).toEqual({
      format_version: "1.8.0",
      render_controllers: {
        "render.controller.example": {},
      },
    });
  });
});
