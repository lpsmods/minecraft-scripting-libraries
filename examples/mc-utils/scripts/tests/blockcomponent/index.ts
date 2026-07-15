import { BlockComponentRegistry } from "@minecraft/server";

import {
  BushComponent,
  CakeComponent,
  CandleCakeComponent,
  CauldronComponent,
  ConcretePowderComponent,
  CopperBulbComponent,
  CoralComponent,
  CropComponent,
  FarmlandComponent,
  HeightComponent,
  RedstoneLampComponent,
  SaplingComponent,
  SlabComponent,
  StairsComponent,
  VerticalSlabComponent,
  LeavesComponent,
  WallComponent,
  FenceGateComponent,
  CandleComponent,
  ButtonComponent,
  PressurePlateComponent,
  SittableComponent,
  TimeDetectorComponent,
  FrostedIceComponent,
  SpongeComponent,
  FlowerBedComponent,
  PowderSnowComponent,
  MultiblockComponent,
  CrossCollisionComponent,
  FertilizableComponent,
  FallingBlockComponent,
  ToggleableComponent,
  LavaCauldronComponent,
  LayeredCauldronComponent,
  DebugBlockComponent,
  ViscosityComponent,
  TileEntityComponent,
  FoodBlockComponent,
} from "@lpsmods/mc-utils";

export default (reg: BlockComponentRegistry) => {
  reg.registerCustomComponent(FoodBlockComponent.componentId, new FoodBlockComponent());
  reg.registerCustomComponent(TileEntityComponent.componentId, new TileEntityComponent());
  reg.registerCustomComponent(ViscosityComponent.componentId, new ViscosityComponent());
  reg.registerCustomComponent(DebugBlockComponent.componentId, new DebugBlockComponent());
  reg.registerCustomComponent(ToggleableComponent.componentId, new ToggleableComponent());
  reg.registerCustomComponent(FallingBlockComponent.componentId, new FallingBlockComponent());
  reg.registerCustomComponent(MultiblockComponent.componentId, new MultiblockComponent());
  reg.registerCustomComponent(FertilizableComponent.componentId, new FertilizableComponent());
  reg.registerCustomComponent(BushComponent.componentId, new BushComponent());
  reg.registerCustomComponent(CakeComponent.componentId, new CakeComponent());
  reg.registerCustomComponent(CandleCakeComponent.componentId, new CandleCakeComponent());
  reg.registerCustomComponent(CauldronComponent.componentId, new CauldronComponent());
  reg.registerCustomComponent(LayeredCauldronComponent.componentId, new LayeredCauldronComponent());
  reg.registerCustomComponent(LavaCauldronComponent.componentId, new LavaCauldronComponent());
  reg.registerCustomComponent(ConcretePowderComponent.componentId, new ConcretePowderComponent());
  reg.registerCustomComponent(CopperBulbComponent.componentId, new CopperBulbComponent());
  reg.registerCustomComponent(CoralComponent.componentId, new CoralComponent());
  reg.registerCustomComponent(CropComponent.componentId, new CropComponent());
  reg.registerCustomComponent(FarmlandComponent.componentId, new FarmlandComponent());
  reg.registerCustomComponent(HeightComponent.componentId, new HeightComponent());
  reg.registerCustomComponent(RedstoneLampComponent.componentId, new RedstoneLampComponent());
  reg.registerCustomComponent(SaplingComponent.componentId, new SaplingComponent());
  reg.registerCustomComponent(SlabComponent.componentId, new SlabComponent());
  reg.registerCustomComponent(StairsComponent.componentId, new StairsComponent());
  reg.registerCustomComponent(LeavesComponent.componentId, new LeavesComponent());
  reg.registerCustomComponent(VerticalSlabComponent.componentId, new VerticalSlabComponent());
  reg.registerCustomComponent(WallComponent.componentId, new WallComponent());
  reg.registerCustomComponent(CrossCollisionComponent.componentId, new CrossCollisionComponent());
  reg.registerCustomComponent(FenceGateComponent.componentId, new FenceGateComponent());
  reg.registerCustomComponent(CandleComponent.componentId, new CandleComponent());
  reg.registerCustomComponent(ButtonComponent.componentId, new ButtonComponent());
  reg.registerCustomComponent(PressurePlateComponent.componentId, new PressurePlateComponent());
  // reg.registerCustomComponent(LeverComponent.componentId, new LeverComponent());
  reg.registerCustomComponent(TimeDetectorComponent.componentId, new TimeDetectorComponent());
  reg.registerCustomComponent(SittableComponent.componentId, new SittableComponent());
  reg.registerCustomComponent(FrostedIceComponent.componentId, new FrostedIceComponent());
  reg.registerCustomComponent(SpongeComponent.componentId, new SpongeComponent());
  reg.registerCustomComponent(FlowerBedComponent.componentId, new FlowerBedComponent());
  reg.registerCustomComponent(PowderSnowComponent.componentId, new PowderSnowComponent());
};
