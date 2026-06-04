import { EquipmentSlot, ItemStack, Player, system, world } from "@minecraft/server";
import { EventSignal } from "@lpsmods/mc-common";

import { ItemUtils } from "../item";

/**
 * Event payload for item callbacks.
 */
export abstract class ItemEvent {
  constructor(itemStack: ItemStack) {
    this.itemStack = itemStack;
  }

  readonly itemStack: ItemStack;
}

/**
 * Event payload for player item callbacks.
 */
export abstract class PlayerItemEvent extends ItemEvent {
  constructor(itemStack: ItemStack, player: Player) {
    super(itemStack);
    this.player = player;
  }

  readonly player: Player;
}

/**
 * Options for configuring the item event.
 */
export interface ItemEventOptions {
  /**
   * An item name. Prefix with '#' for item tag or "!" to ignore.
   */
  itemPredicate?: string;
}

/**
 * Event signal for subscribing to item events.
 */
export class ItemEventSignal<T extends ItemEvent> extends EventSignal<T, ItemEventOptions> {
  apply(event: T): void {
    for (const fn of this.listeners) {
      if (fn?.options?.itemPredicate && !ItemUtils.matches(event.itemStack, fn.options.itemPredicate)) continue;
      try {
        fn.callback(event);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

/**
 * Event payload for item hold callbacks.
 */
export class ItemHoldEvent extends PlayerItemEvent {}

/**
 * Event payload for item release hold callbacks.
 */
export class ItemReleaseHoldEvent extends PlayerItemEvent {}

/**
 * Event payload for item hold tick callbacks.
 */
export class ItemHoldTickEvent extends PlayerItemEvent {}

/**
 * Event signal for subscribing to item hold events.
 */
export class ItemHoldEventSignal extends ItemEventSignal<ItemHoldEvent> {}

/**
 * Event signal for subscribing to item release hold events.
 */
export class ItemReleaseHoldEventSignal extends ItemEventSignal<ItemReleaseHoldEvent> {}

/**
 * Event signal for subscribing to item hold tick events.
 */
export class ItemHoldTickEventSignal extends ItemEventSignal<ItemHoldTickEvent> {}

/**
 * Event signal for subscribing to item stripped events.
 */
export class ItemStrippedEventSignal extends EventSignal<PlayerItemEvent> {}

/**
 * Event signal for subscribing to item scraped wax events.
 */
export class ItemScrapedWaxEventSignal extends EventSignal<PlayerItemEvent> {}

/**
 * Event signal for subscribing to item scraped oxidization events.
 */
export class ItemScrapedOxidizationEventSignal extends EventSignal<PlayerItemEvent> {}

/**
 * Custom item events.
 */
export class ItemEvents {
  private constructor() {}
  // /**
  //  * This event fires when a player strips a log.
  //  * @eventProperty
  //  */
  // static readonly playerStripped = new ItemStrippedEventSignal();

  // /**
  //  * This event fires when a player scrapes wax.
  //  * @eventProperty
  //  */
  // static readonly playerScrapedWax = new ItemScrapedWaxEventSignal();

  // /**
  //  * This event fires when a player scrapes oxidization.
  //  * @eventProperty
  //  */
  // static readonly playerScrapedOxidization = new ItemScrapedOxidizationEventSignal();

  /**
   * This event fires when a player holds an item.
   * @eventProperty
   */
  static readonly playerHold = new ItemHoldEventSignal();

  /**
   * This event fires when a player stops holding an item.
   * @eventProperty
   */
  static readonly playerReleaseHold = new ItemReleaseHoldEventSignal();

  /**
   * This event fires every tick the player is holding an item.
   * @eventProperty
   */
  static readonly playerHoldTick = new ItemHoldTickEventSignal();

  static get size(): number {
    return this.playerHold.size + this.playerReleaseHold.size + this.playerHoldTick.size;
  }
}

function init() {
  // TODO: Additionally use inventory changed event.
  world.afterEvents.playerHotbarSelectedSlotChange.subscribe((event) => {
    const container = event.player.getComponent("inventory")?.container;
    if (!container) return;
    const prevItemStack = container.getItem(event.previousSlotSelected);
    if (prevItemStack) {
      ItemEvents.playerReleaseHold.apply(new ItemHoldEvent(prevItemStack, event.player));
    }
    if (!event.itemStack) return;
    ItemEvents.playerHold.apply(new ItemHoldEvent(event.itemStack, event.player));
  });

  system.runInterval(() => {
    if (!ItemEvents.playerHoldTick.size) return;
    for (const player of world.getAllPlayers()) {
      const equ = player.getComponent("equippable");
      const itemStack = equ?.getEquipment(EquipmentSlot.Mainhand);
      if (!itemStack) return;
      ItemEvents.playerHoldTick.apply(new ItemHoldTickEvent(itemStack, player));
    }
  });

  // Axe events
  // world.beforeEvents.itemUse.subscribe((event) => {
  //   const hit = event.source.getBlockFromViewDirection({ maxDistance: 7 });
  //   if (!hit) return;
  //   const block = hit.block;

  //   if (ItemUtils.matches(event.itemStack, "#is_axe")) {
  //     if (block.hasTag("logs")) {
  //       console.warn(block.typeId);
  //     }
  //   }
  // });
  // stripped
  // scrapedWax
  // scrapedOxidization
}

init();
