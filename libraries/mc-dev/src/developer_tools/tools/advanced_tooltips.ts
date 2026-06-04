import { ItemStack, Player, PlayerInventoryItemChangeAfterEvent, world } from "@minecraft/server";

import { DevTool } from "./base";
import { Settings } from "@lpsmods/mc-common";
import { should } from "vitest";

class AdvancedTooltipsTool extends DevTool {
  static readonly toolId = "advanced_tooltips";

  constructor() {
    super(AdvancedTooltipsTool.toolId, {
      name: "Advanced Tooltips",
      description: "Displays advanced lore into items.",
    });
  }

  buildSettings(settings: Settings): void {
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
  }

  private shouldUpdate(itemStack: ItemStack): boolean {
    return true;
  }

  private getLore(itemStack: ItemStack): string[] {
    const lore: string[] = [];

    const durability = itemStack.getComponent("durability");
    if (durability && this.store.get("durability")) {
      lore.push(`§r§8${durability.damage} / ${durability.maxDurability}§r`);
    }

    if (this.store.get("identifier")) {
      lore.push(`§r§8${itemStack.typeId}§r`);
    }

    return lore;
  }

  private onInventoryChange(event: PlayerInventoryItemChangeAfterEvent): void {
    if (!this.isEnabled || !event.itemStack) return;
    if (!this.shouldUpdate(event.itemStack)) return;
    event.itemStack.setLore(this.getLore(event.itemStack));
    const inv = event.player.getComponent("inventory")?.container;
    if (!inv) return;
    inv.setItem(event.slot, event.itemStack);
  }

  private update(player: Player): void {
    const inv = player.getComponent("inventory")?.container;
    if (!inv) return;
    for (let slot = 0; slot < inv.size; slot++) {
      const itemStack = inv.getItem(slot);
      if (!itemStack || !this.shouldUpdate(itemStack)) continue;
      itemStack.setLore(this.getLore(itemStack));
      inv.setItem(slot, itemStack);
    }
  }

  // EVENTS

  onLoad(): void {
    world.afterEvents.playerInventoryItemChange.subscribe(this.onInventoryChange.bind(this));
  }

  onEnable(player?: Player): void {
    if (player) this.update(player);
  }
}

// Initialize
new AdvancedTooltipsTool();
