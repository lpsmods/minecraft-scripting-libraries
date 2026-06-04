import { Player, RawMessage } from "@minecraft/server";
import { Settings, Identifier, TextUtils } from "@lpsmods/mc-common";
import { DirectionUtils, EntityTickEvent } from "@lpsmods/mc-utils";

import { DevTool } from "./base";

class PlayerInfoTool extends DevTool {
  static readonly toolId = "player_info";

  constructor() {
    super(PlayerInfoTool.toolId, {
      name: "Player Info",
      description: "Displays player data in the action bar.",
    });
  }

  // Hooks

  buildSettings(settings: Settings): void {
    settings.defineProperty("dimension", {
      type: "boolean",
      value: true,
      title: "Display dimension",
    });
    settings.defineProperty("biome", {
      type: "boolean",
      value: true,
      title: "Display biome name",
    });
    settings.defineProperty("position", {
      type: "boolean",
      value: true,
      title: "Display position",
    });
    settings.defineProperty("position_coloring", {
      type: "boolean",
      value: true,
      title: "Use coloring for position",
      description: "Enabled: §cX§7, §aY§7, §9Z§r\nDisabled: §7X, Y, Z§r",
    });
    settings.defineProperty("rotation", {
      type: "boolean",
      value: true,
      title: "Display rotation",
    });
    settings.defineProperty("rotation_coloring", {
      type: "boolean",
      value: true,
      title: "Use coloring for rotation",
      description: "Enabled: §cX§7, §aZ§r\nDisabled: §7X, Z§r",
    });
    settings.defineProperty("facing_direction", {
      type: "boolean",
      value: true,
      title: "Display facing direction",
    });
    settings.defineProperty("property_size", {
      type: "boolean",
      value: true,
      title: "Display property size",
    });
    settings.defineProperty("property_count", {
      type: "boolean",
      value: true,
      title: "Display property count",
    });
  }

  // TODO: facing direction: [Disabled, Cardinal, Ordinal (SE SW, etc)]
  private render(player: Player) {
    let texts: RawMessage[] = [];
    const dim = player.dimension;
    const { x, y, z } = player.location;
    const rot = player.getRotation();

    if (this.store.get("dimension")) {
      const dimId = Identifier.parse(dim.id).path;
      texts.push({ text: `Dimension: §7${TextUtils.smartTitleCase(dimId)}§r` });
    }
    if (this.store.get("biome")) {
      const b = dim.getBiome({ x, y, z }).id.replace("minecraft:", "");
      texts.push({ text: `Biome: §7${TextUtils.smartTitleCase(b)}§r` });
    }
    if (this.store.get("position")) {
      const text = `Position: ${this.store.get("position_coloring") ? `§c${x.toFixed(2)}§7, §a${y.toFixed(2)}§7, §9${z.toFixed(2)}§r` : `§7${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}§r`}`;
      texts.push({ text });
    }
    if (this.store.get("rotation")) {
      const text = `Rotation: ${this.store.get("rotation_coloring") ? `§c${rot.x.toFixed(2)}§7, §a${rot.y.toFixed(2)}§r` : `§7${rot.x.toFixed(2)}, ${rot.y.toFixed(2)}§r`}`;
      texts.push({ text });
    }
    if (this.store.get("facing_direction")) {
      const dir = DirectionUtils.rot2dir(rot);
      texts.push({ text: `Facing Direction: §7${dir}§r` });
    }

    if (this.store.get("property_size")) {
      const b = player.getDynamicPropertyTotalByteCount() / 1000000;
      texts.push({ text: `Property Size: §7${b} MB§r` });
    }

    if (this.store.get("property_count")) {
      const c = player.getDynamicPropertyIds().length;
      texts.push({ text: `Property Count: §7${c}§r` });
    }

    // Properties count.

    const extras = texts.flatMap((v, i) => (i === 0 ? [v] : [{ text: "\n" }, v]));
    player.onScreenDisplay.setActionBar({
      rawtext: [{ text: "§lPlayer Data§r\n" }, ...extras],
    });
  }

  // EVENTS

  onTick(event: EntityTickEvent): void {
    if (!(event.entity instanceof Player)) return;
    this.render(event.entity);
  }
}

// Initialize
new PlayerInfoTool();
