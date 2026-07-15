import { flattenableBlocks } from "@lpsmods/mc-utils";

export default () => {
  flattenableBlocks.register("stone", { block: "cobblestone", onConvert: () => console.log("flatten") });
};
