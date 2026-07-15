import { ItemStack, Player, PlayerInventoryItemChangeAfterEvent, world } from "@minecraft/server";

import { DevTool } from "./base";
import { Settings } from "@lpsmods/mc-common";

export class AdvancedTooltipsTool extends DevTool {
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

  private needsLore(itemStack: ItemStack): boolean {
    const currentLore = itemStack.getLore();
    const nextLore = this.getLore(itemStack);
    if (nextLore.length === 0) return false;
    if (currentLore.length < nextLore.length) return true;

    const start = currentLore.length - nextLore.length;
    return nextLore.some((line, index) => currentLore[start + index] !== line);
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

  apply(itemStack: ItemStack): ItemStack {
    if (!this.needsLore(itemStack)) return itemStack;
    itemStack.setLore([...itemStack.getLore(), ...this.getLore(itemStack)]);
    return itemStack;
  }

  private onInventoryChange(event: PlayerInventoryItemChangeAfterEvent): void {
    if (!this.isEnabled || !event.itemStack) return;
    if (!this.needsLore(event.itemStack)) return;
    const inv = event.player.getComponent("inventory")?.container;
    if (!inv) return;
    inv.setItem(event.slot, this.apply(event.itemStack));
  }

  private update(player: Player): void {
    const inv = player.getComponent("inventory")?.container;
    if (!inv) return;
    for (let slot = 0; slot < inv.size; slot++) {
      const itemStack = inv.getItem(slot);
      if (!itemStack || !this.needsLore(itemStack)) continue;
      inv.setItem(slot, this.apply(itemStack));
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
