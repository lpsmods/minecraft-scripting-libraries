import { BlockComponentTickEvent, CustomComponentParameters, EntityQueryOptions } from "@minecraft/server";
import { AddonUtils } from "../utils";

// TODO: Needs testing in-game.
export interface EntitySensorOptions {
  block?: string;
  filters?: EntityQueryOptions[];
  radius?: number;
}

export class EntitySensorComponent {
  static readonly componentId = AddonUtils.makeId("entity_sensor");
  constructor() {
    this.onTick = this.onTick.bind(this);
  }

  // EVENTS

  onTick(event: BlockComponentTickEvent, args: CustomComponentParameters): void {
    const options = args.params as EntitySensorOptions;
    const filters = options?.filters ?? [];
    for (const filter of filters) {
      filter.maxDistance = options.radius ?? 7;
      filter.location = event.block.location;
      const entities = event.dimension.getEntities(filter);
      if (entities.length > 0) {
        if (options.block) event.block.setType(options.block);
      }
    }
  }
}
