import { tillableBlocks } from "@lpsmods/mc-utils";

export default () => {
  tillableBlocks.register("stone", { block: "cobblestone", onConvert: () => console.log("tillable") });
};
