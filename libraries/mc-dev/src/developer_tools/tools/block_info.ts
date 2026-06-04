import { Block, Player, RawMessage } from "@minecraft/server";
import { Identifier, Settings, TextUtils } from "@lpsmods/mc-common";
import { EntityTickEvent } from "@lpsmods/mc-utils";

import { DevTool } from "./base";

class BlockInfoTool extends DevTool {
  static readonly toolId = "block_info";

  constructor() {
    super(BlockInfoTool.toolId, {
      name: "Block Info",
      description: "Displays the facing block data in the action bar.",
    });
  }

  // Hooks

  buildSettings(settings: Settings): void {
    settings.defineProperty("name", {
      type: "boolean",
      value: true,
      title: "Display name",
    });
    settings.defineProperty("identifier", {
      type: "boolean",
      value: true,
      title: "Display identifier",
    });
    settings.defineProperty("dimension", {
      type: "boolean",
      value: true,
      title: "Display dimension",
    });
    settings.defineProperty("tool", {
      type: "boolean",
      value: true,
      title: "Display tool",
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
    settings.defineProperty("tags", {
      type: "boolean",
      value: true,
      title: "Display tags",
    });
    settings.defineProperty("states", {
      type: "boolean",
      value: true,
      title: "Display states",
    });
  }

  private renderStateValue(value: string): string {
    if (value === "x" || value === "false") return `§c${value}§r`;
    if (value === "y" || value === "true") return `§a${value}§r`;
    if (value === "z") return `§9${value}§r`;
    return `§7${value}§r`;
  }

  private render(block: Block, player: Player): void {
    let texts: RawMessage[] = [];
    const { x, y, z } = block.location;

    if (this.store.get("name")) {
      texts.push({
        rawtext: [{ text: "Name: §7" }, { translate: block.localizationKey }, { text: "§r" }],
      });
    }

    if (this.store.get("identifier")) {
      texts.push({ text: `ID: §7${block.typeId}§r` });
    }

    if (this.store.get("tool")) {
      let tools = [];
      // Type
      if (block.hasTag("minecraft:is_pickaxe_item_destructible")) tools.push("Pickaxe");
      if (block.hasTag("minecraft:is_axe_item_destructible")) tools.push("Axe");
      if (block.hasTag("minecraft:is_shovel_item_destructible")) tools.push("Shovel");
      if (block.hasTag("minecraft:is_hoe_item_destructible")) tools.push("Hoe");
      if (block.hasTag("minecraft:is_shears_item_destructible")) tools.push("Shears");
      if (block.hasTag("minecraft:is_sword_item_destructible")) tools.push("Sword");
      // Tier
      if (block.hasTag("minecraft:stone_tier_destructible")) tools = tools.map((x) => `Stone ${x}`);
      if (block.hasTag("minecraft:iron_tier_destructible")) tools = tools.map((x) => `Iron ${x}`);
      if (block.hasTag("minecraft:diamond_tier_destructible")) tools = tools.map((x) => `Diamond ${x}`);
      if (tools.length !== 0) texts.push({ text: `Tool: §7${tools.join(" ")}§r` });
    }

    if (this.store.get("dimension")) {
      const dimId = Identifier.parse(block.dimension.id).path;
      texts.push({ text: `Dimension: §7${TextUtils.smartTitleCase(dimId)}§r` });
    }

    if (this.store.get("position")) {
      const text = `Position: ${this.store.get("position_coloring") ? `§c${x}§7, §a${y}§7, §9${z}§r` : `§7${x}, ${y}, ${z}§r`}`;
      texts.push({ text });
    }

    if (this.store.get("tags")) {
      const tags = block.getTags().map((x) => `§7${x}§r`);
      if (tags.length !== 0) texts.push({ text: `Tags:\n ${tags.join("\n ")}` });
    }

    if (this.store.get("states")) {
      const states = Object.entries(block.permutation.getAllStates())
        .map((v) => `${v[0]}: ${this.renderStateValue(v[1].toString())}`)
        .join("\n ");
      if (states.length !== 0) texts.push({ text: `States:\n ${states}` });
    }

    const extras = texts.flatMap((v, i) => (i === 0 ? [v] : [{ text: "\n" }, v]));
    player.onScreenDisplay.setActionBar({
      rawtext: [{ text: "§lBlock Data§r\n" }, ...extras],
    });
  }

  // EVENTS

  onTick(event: EntityTickEvent): void {
    if (!(event.entity instanceof Player)) return;
    const ray = event.entity.getBlockFromViewDirection({ maxDistance: 7 });
    if (!ray?.block) return;
    this.render(ray.block, event.entity);
  }
}

// Initialize
new BlockInfoTool();
