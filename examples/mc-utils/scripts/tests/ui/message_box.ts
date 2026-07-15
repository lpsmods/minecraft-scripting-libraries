import { UnitTestMap, CustomCommandUtils } from "@lpsmods/mc-utils";
import {
  showInfo,
  showWarning,
  showError,
  askQuestion,
  askOkCancel,
  askRetryCancel,
  askYesNo,
  askYesNoCancel,
} from "@lpsmods/mc-common";

export default (units: UnitTestMap) => {
  units.set("showInfo", async (ctx, message) => {
    const player = CustomCommandUtils.getPlayer(ctx);
    const res = await showInfo(player, undefined, message ?? "showInfo");
    player.sendMessage(res.toString());
  });

  units.set("showWarning", async (ctx, message) => {
    const player = CustomCommandUtils.getPlayer(ctx);
    const res = await showWarning(player, undefined, message ?? "showWarning");
    player.sendMessage(res.toString());
  });

  units.set("showError", async (ctx, message) => {
    const player = CustomCommandUtils.getPlayer(ctx);
    const res = await showError(player, undefined, message ?? "showError");
    player.sendMessage(res.toString());
  });

  units.set("askQuestion", async (ctx, message) => {
    const player = CustomCommandUtils.getPlayer(ctx);
    const res = await askQuestion(player, undefined, message ?? "askQuestion");
    player.sendMessage(res.toString());
  });

  units.set("askOkCancel", async (ctx, message) => {
    const player = CustomCommandUtils.getPlayer(ctx);
    const res = await askOkCancel(player, undefined, message ?? "askOkCancel");
    player.sendMessage(res.toString());
  });

  units.set("askRetryCancel", async (ctx, message) => {
    const player = CustomCommandUtils.getPlayer(ctx);
    const res = await askRetryCancel(player, undefined, message ?? "askRetryCancel");
    player.sendMessage(res.toString());
  });

  units.set("askYesNo", async (ctx, message) => {
    const player = CustomCommandUtils.getPlayer(ctx);
    const res = await askYesNo(player, undefined, message ?? "askYesNo");
    player.sendMessage(res.toString());
  });

  units.set("askYesNoCancel", async (ctx, message) => {
    const player = CustomCommandUtils.getPlayer(ctx);
    const res = await askYesNoCancel(player, undefined, message ?? "askYesNoCancel");
    player.sendMessage(res?.toString() ?? "undefined");
  });
};
