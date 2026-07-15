import { UnitTestMap, CustomCommandUtils } from "@lpsmods/mc-utils";
import { askInteger, askFloat, askString } from "@lpsmods/mc-common";

export default (units: UnitTestMap) => {
  units.set("askInteger", async (ctx, message) => {
    const player = CustomCommandUtils.getPlayer(ctx);
    const res = await askInteger(player, "askInteger", message ?? "PROMPT");
    // player.sendMessage(res?.toString());
  });
  units.set("askFloat", async (ctx, message) => {
    const player = CustomCommandUtils.getPlayer(ctx);
    const res = await askFloat(player, "askFloat", message ?? "PROMPT");
    console.log(res);
    // player.sendMessage(res?.toString());
  });
  units.set("askString", async (ctx, message) => {
    const player = CustomCommandUtils.getPlayer(ctx);
    const res = await askString(player, "askString", message ?? "PROMPT");
    // player.sendMessage(res?.toString());
    console.log(res);
  });
};
