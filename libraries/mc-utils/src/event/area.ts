import { Dimension, Entity, world } from "@minecraft/server";
import { EventSignal } from "@lpsmods/mc-common";

import { AreaDetector } from "../area_detector";

/**
 * Event payload for area callbacks.
 */
export abstract class AreaEvent {
  readonly entity: Entity;
  readonly dimension: Dimension;
  readonly area: AreaDetector;

  constructor(entity: Entity, area: AreaDetector) {
    this.entity = entity;
    this.area = area;
    this.dimension = world.getDimension(area.dimensionId);
  }
}

/**
 * Event payload for area enter callbacks.
 */
export class AreaEnterEvent extends AreaEvent {}
/**
 * Event payload for area leave callbacks.
 */
export class AreaLeaveEvent extends AreaEvent {}
/**
 * Event payload for area tick callbacks.
 */
export class AreaTickEvent extends AreaEvent {}

/**
 * Event signal for subscribing to area enter events.
 */
export class AreaEnterEventSignal extends EventSignal<AreaEnterEvent> {}
/**
 * Event signal for subscribing to area leave events.
 */
export class AreaLeaveEventSignal extends EventSignal<AreaLeaveEvent> {}
/**
 * Event signal for subscribing to area tick events.
 */
export class AreaTickEventSignal extends EventSignal<AreaTickEvent> {}

/**
 * Custom area events.
 */
export abstract class AreaEvents {
  private constructor() {}

  /**
   * This event fires when a entity enters the area.
   * @eventProperty
   */
  static readonly entityEnter = new AreaEnterEventSignal();

  /**
   * This event fires when a entity leaves the area.
   * @eventProperty
   */
  static readonly entityLeave = new AreaLeaveEventSignal();

  /**
   * This event fires every tick a entity is in the area.
   * @eventProperty
   */
  static readonly entityTick = new AreaTickEventSignal();

  static get size(): number {
    return this.entityEnter.size + this.entityLeave.size + this.entityTick.size;
  }
}
