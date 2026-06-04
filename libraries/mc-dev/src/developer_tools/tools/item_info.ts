import { EquipmentSlot, ItemStack, Player, RawMessage } from "@minecraft/server";
import { Settings } from "@lpsmods/mc-common";
import { EntityTickEvent } from "@lpsmods/mc-utils";

import { DevTool } from "./base";

class ItemInfoTool extends DevTool {
  static readonly toolId = "item_info";

  constructor() {
    super(ItemInfoTool.toolId, {
      name: "Item Info",
      description: "Displays held item data in the action bar.",
    });
  }

  private render(player: Player, itemStack: ItemStack): void {
    let texts: RawMessage[] = [];

    if (this.store.get("name")) {
      texts.push({
        rawtext: [{ text: `Name: §7` }, { translate: itemStack.localizationKey }, { text: "§r" }],
      });
    }
    if (this.store.get("identifier")) {
      texts.push({ text: `ID: §7${itemStack.typeId}§r` });
    }

    let durability;
    if (this.store.get("durability") && (durability = itemStack.getComponent("durability"))) {
      texts.push({
        text: `Durability: §7${durability.damage} / ${durability.maxDurability}§r`,
      });
    }

    let food;
    if (this.store.get("food") && (food = itemStack.getComponent("food"))) {
      texts.push({ text: `Nutrition: §7${food.nutrition}§r` });
      texts.push({
        text: `Saturation Modifier: §7${food.saturationModifier.toFixed(2)}§r`,
      });
      if (food.usingConvertsTo) texts.push({ text: `Converts to: §7${food.usingConvertsTo}§r` });
    }

    if (this.store.get("property_size")) {
      const b = itemStack.getDynamicPropertyTotalByteCount() / 1000000;
      texts.push({ text: `Property Size: §7${b} MB§r` });
    }

    if (this.store.get("property_size")) {
      const c = itemStack.getDynamicPropertyIds().length;
      texts.push({ text: `Property Count: §7${c}§r` });
    }

    if (this.store.get("tags")) {
      const tags = itemStack.getTags().map((x) => `§7${x}§r`);
      if (tags.length !== 0) texts.push({ text: `Tags:\n ${tags.join("\n ")}` });
    }

    const extras = texts.flatMap((v, i) => (i === 0 ? [v] : [{ text: "\n" }, v]));
    player.onScreenDisplay.setActionBar({
      rawtext: [{ text: "§lItem Data§r\n" }, ...extras],
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
    settings.defineProperty("durability", {
      type: "boolean",
      value: true,
      title: "Display durability",
    });
    settings.defineProperty("food", {
      type: "boolean",
      value: true,
      title: "Display food",
    });
    settings.defineProperty("tags", {
      type: "boolean",
      value: true,
      title: "Display tags",
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

  // EVENTS

  onTick(event: EntityTickEvent): void {
    if (!(event.entity instanceof Player)) return;
    const equ = event.entity.getComponent("equippable");
    if (!equ) return;
    let itemStack = equ.getEquipment(EquipmentSlot.Mainhand);
    if (!itemStack) {
      itemStack = equ.getEquipment(EquipmentSlot.Offhand);
      if (!itemStack) return;
    }
    this.render(event.entity, itemStack);
  }
}

// Initialize
new ItemInfoTool();
