import { Player, RawMessage } from "@minecraft/server";
import { Settings } from "@lpsmods/mc-common";
import { DirectionUtils, EntityTickEvent } from "@lpsmods/mc-utils";

import { DevTool } from "./base";

class EntityInfoTool extends DevTool {
  static readonly toolId = "entity_info";

  constructor() {
    super(EntityInfoTool.toolId, {
      name: "Entity Info",
      description: "Displays entity data in the action bar.",
    });
  }

  // Hooks

  buildSettings(settings: Settings): void {
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
      title: "Display dynamic property size",
    });
    settings.defineProperty("property_count", {
      type: "boolean",
      value: true,
      title: "Display dynamic property count",
    });
    settings.defineProperty("health", {
      type: "boolean",
      value: true,
      title: "Display health",
    });
    settings.defineProperty("item", {
      type: "boolean",
      value: true,
      title: "Display item",
    });
    settings.defineProperty("scale", {
      type: "boolean",
      value: true,
      title: "Display scale",
    });
  }

  // TODO: facing direction: [Disabled, Cardinal, Ordinal (SE SW, etc)]
  private render(player: Player) {
    let texts: RawMessage[] = [];

    const entities = player.getEntitiesFromViewDirection({ maxDistance: 100 });
    if (entities.length < 1) return;
    const entity = entities[0].entity;
    if (!entity.isValid) return;

    const { x, y, z } = entity.location;
    const rot = entity.getRotation();

    if (this.store.get("position")) {
      const text = `Position: ${this.store.get("position_coloring") ? `§c${x.toFixed(2)}§7, §a${y.toFixed(2)}§7, §9${z.toFixed(2)}§r` : `§7${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}§r`}`;
      texts.push({ text });
    }
    if (this.store.get("rotation")) {
      const text = `Rotation: ${this.store.get("rotation_coloring") ? `§c${rot.x.toFixed(2)}§7, §a${rot.y.toFixed(2)}§r` : `§7${rot.x.toFixed(2)}, ${rot.y.toFixed(2)}§r`}`;
      texts.push({ text });
    }
    if (this.store.get("facing_direction")) {
      const dir = DirectionUtils.fromRotation(rot);
      texts.push({ text: `Facing Direction: §7${dir}§r` });
    }

    if (this.store.get("property_size")) {
      const b = entity.getDynamicPropertyTotalByteCount() / 1000000;
      texts.push({ text: `Property Size: §7${b} MB§r` });
    }

    if (this.store.get("property_count")) {
      const c = entity.getDynamicPropertyIds().length;
      texts.push({ text: `Property Count: §7${c}§r` });
    }

    const health = entity.getComponent("health");
    if (this.store.get("health") && health) {
      texts.push({ text: `Health: §7${health.currentValue} / ${health.effectiveMax} HP§r` });
    }

    const scale = entity.getComponent("scale");
    if (this.store.get("scale") && scale) {
      texts.push({ text: `Scale: §7${scale.value}§r` });
    }

    const item = entity.getComponent("item");
    if (this.store.get("item") && item) {
      texts.push({ text: `Item: §7${item.itemStack.typeId}§r` });
    }

    const extras = texts.flatMap((v, i) => (i === 0 ? [v] : [{ text: "\n" }, v]));
    player.onScreenDisplay.setActionBar({
      rawtext: [{ text: "§lEntity Data§r\n" }, ...extras],
    });
  }

  // EVENTS

  onTick(event: EntityTickEvent): void {
    if (!(event.entity instanceof Player)) return;
    this.render(event.entity);
  }
}

// Initialize
new EntityInfoTool();
