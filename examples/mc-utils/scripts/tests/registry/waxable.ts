import { waxableBlocks } from "@lpsmods/mc-utils";

export default () => {
  waxableBlocks.register("stone", { block: "yellow_concrete", onConvert: () => console.log("waxable") });
};
