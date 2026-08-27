import { describe, expect, it } from "vitest";
import { renderController, renderControllers, RenderControllerSchema } from "@lpsmods/mc-build";

describe("render controller builder", () => {
  it("validates visibility, geometry, material and texture references", () => {
    const data = { geometry: "Geometry.default", materials: [{ "*": "Material.default" }],
      textures: ["Texture.default"], part_visibility: [{ "*": true }, { wing: "q.is_moving" }] };
    expect(RenderControllerSchema.is(data)).toBe(true);
    expect(RenderControllerSchema.is({ ...data, part_visibility: [{ wing: {} }] })).toBe(false);
    expect(RenderControllerSchema.is({ ...data, textures: [123] })).toBe(false);
  });
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
