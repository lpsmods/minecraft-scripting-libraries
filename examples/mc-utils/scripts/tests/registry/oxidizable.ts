import { oxidizableBlocks } from "@lpsmods/mc-utils";

export default () => {
  oxidizableBlocks.register("cobblestone", { block: "smooth_stone", onConvert: () => console.log("oxidizable") });
};
