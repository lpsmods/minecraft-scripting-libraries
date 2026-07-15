import { shearableBlocks } from "@lpsmods/mc-utils";

export default () => {
  shearableBlocks.register("cobblestone", { block: "stone", onConvert: () => console.log("shearable") });
};
