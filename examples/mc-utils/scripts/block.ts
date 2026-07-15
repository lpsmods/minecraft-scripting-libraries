import {
  BlockComponentPlayerInteractEvent,
  BlockComponentRegistry,
  BlockComponentTickEvent,
  CustomComponentParameters,
  ItemStack,
  Player,
} from "@minecraft/server";

import {
  // BatteryBlockComponent,
  // BarrelComponent,
  // BedComponent,
  // BlockEntityComponent,
  // ChiseledBookshelfComponent,
  // LadderComponent,
  // ScaffoldingComponent,
  BlockBaseComponent,
  EntityEnterBlockEvent,
  EntityLeaveBlockEvent,
  NeighborUpdateEvent,
  PlayerUtils,
} from "@lpsmods/mc-utils";

class BaseBlock extends BlockBaseComponent {
  static readonly componentId = "lpsmods:base_block";

  constructor() {
    super();
    this.onTick = this.onTick.bind(this);
    this.onPlayerInteract = this.onPlayerInteract.bind(this);
  }

  onTick(event: BlockComponentTickEvent, args: CustomComponentParameters): void {
    this.baseTick(event, args);
  }

  onPlayerInteract(event: BlockComponentPlayerInteractEvent, args: CustomComponentParameters): void {
    if (!event.player) return;
    const armorSet = {
      head: new ItemStack("netherite_helmet"),
      chest: new ItemStack("netherite_chestplate"),
      legs: new ItemStack("netherite_leggings"),
      feet: new ItemStack("netherite_boots"),
    };
    PlayerUtils.applyArmor(event.player, armorSet);
    this.after(
      event.block,
      (e) => {
        if (!event.player) return;
        event.player.sendMessage("AFTER!");
        const above = e.block.above();
        if (!above) return;
        above.setType("bedrock");
      },
      20,
    );
  }

  onEnter(event: EntityEnterBlockEvent, args: CustomComponentParameters): void {
    if (event.sameType) return;
    if (!(event.entity instanceof Player)) return;
    event.entity.sendMessage("ENTER BLOCK");
  }

  onLeave(event: EntityLeaveBlockEvent, args: CustomComponentParameters): void {
    if (event.sameType) return;
    if (!(event.entity instanceof Player)) return;
    event.entity.sendMessage("LEAVE BLOCK");
  }

  onNeighborUpdate(event: NeighborUpdateEvent, args: CustomComponentParameters): void {
    event.sourceBlock.setType("glass");
  }
}

class EnergyCable {
  static readonly componentId = "lpsmods:energy_cable";
  constructor() {}
}

class SolarPanel {
  static readonly componentId = "lpsmods:solar_panel";
  constructor() {}
}

export function registerBlocks(reg: BlockComponentRegistry): void {
  // lpsmods
  reg.registerCustomComponent(BaseBlock.componentId, new BaseBlock());
  reg.registerCustomComponent(EnergyCable.componentId, new EnergyCable());
  reg.registerCustomComponent(SolarPanel.componentId, new SolarPanel());
}
