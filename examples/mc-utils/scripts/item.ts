import { ItemComponentRegistry, ItemUseOnEvent } from "@minecraft/server";
import {
  // BatteryItemComponent,
  ItemBaseComponent,
  GuideBookComponent,
} from "@lpsmods/mc-utils";

import { pages } from "./guide/main";
import { ActionButton, CustomPage, PagedActionFormEvent } from "@lpsmods/mc-common";

class BaseItem extends ItemBaseComponent {
  static readonly componentId = "lpsmods:base_item";

  // onHold(event) {
  //   event.source.sendMessage("HOLD");
  // }
}

class ExampleCustomPage extends CustomPage {
  static readonly pageId = "lpsmods:example";

  getButton(event: PagedActionFormEvent): ActionButton {
    return {
      label: "Example",
      onClick: (clickEvent) => {
        this.show(event);
      },
    };
  }
  show(event: PagedActionFormEvent): void {
    console.warn("CUSTOM PAGE!");
  }
}

export function registerItems(reg: ItemComponentRegistry): void {
  // lpsmods
  reg.registerCustomComponent(BaseItem.componentId, new BaseItem());

  const guide = new GuideBookComponent(pages);
  guide.ui.customPage(ExampleCustomPage.pageId, new ExampleCustomPage());
  reg.registerCustomComponent("lpsmods:info_book", guide);
  GuideBookComponent.setup("lpsmods:guide_book");
}
