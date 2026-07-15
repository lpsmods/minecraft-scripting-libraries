import { ItemComponentRegistry } from "@minecraft/server";
import {
  HoeComponent,
  ToolComponent,
  ShovelComponent,
  AxeComponent,
  FlintAndSteelComponent,
  WritableBookComponent,
} from "@lpsmods/mc-utils";

export default (reg: ItemComponentRegistry) => {
  reg.registerCustomComponent(WritableBookComponent.componentId, new WritableBookComponent());
  reg.registerCustomComponent(AxeComponent.componentId, new AxeComponent());
  reg.registerCustomComponent(HoeComponent.componentId, new HoeComponent());
  reg.registerCustomComponent(ShovelComponent.componentId, new ShovelComponent());
  reg.registerCustomComponent(FlintAndSteelComponent.componentId, new FlintAndSteelComponent());
  reg.registerCustomComponent(ToolComponent.componentId, new ToolComponent());
};
