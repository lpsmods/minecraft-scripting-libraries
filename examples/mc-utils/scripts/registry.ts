import { oxidizableBlocks, strippableBlocks, waxableBlocks } from "@lpsmods/mc-utils";
import { makeId } from "./utils";

oxidizableBlocks.register(makeId("copper_bulb"), { block: makeId("exposed_copper_bulb") });
oxidizableBlocks.register(makeId("exposed_copper_bulb"), { block: makeId("weathered_copper_bulb") });
oxidizableBlocks.register(makeId("weathered_copper_bulb"), { block: makeId("oxidized_copper_bulb") });

waxableBlocks.register(makeId("copper_bulb"), { block: makeId("waxed_copper_bulb") });
waxableBlocks.register(makeId("exposed_copper_bulb"), { block: makeId("waxed_exposed_copper_bulb") });
waxableBlocks.register(makeId("weathered_copper_bulb"), { block: makeId("waxed_weathered_copper_bulb") });
waxableBlocks.register(makeId("oxidized_copper_bulb"), { block: makeId("waxed_oxidized_copper_bulb") });

strippableBlocks.register(makeId("log"), { block: makeId("stripped_log") });
