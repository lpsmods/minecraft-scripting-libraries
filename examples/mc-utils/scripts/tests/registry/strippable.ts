import { strippableBlocks } from "@lpsmods/mc-utils";

export default () => {
  strippableBlocks.register("stone", { block: "cobblestone", onConvert: () => console.log("strippable") });
};
