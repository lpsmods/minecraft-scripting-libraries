import { CustomCommandOrigin } from "@minecraft/server";
import { UnitTestMap } from "@lpsmods/mc-utils";
import { ActionForm, ActionFormEvent, ActionFormHandler } from "@lpsmods/mc-common";

const actionForm: ActionForm = {
  title: "TITLE",
  body: "BODY",
  buttons: [
    {
      label: "LABEL 1",
      icon: "textures/items/paper.png",
      onClick: (event: ActionFormEvent) => {
        console.warn("CLICK 1");
      },
    },
    {
      label: "LABEL 2",
      icon: "textures/items/iron_pickaxe.png",
      onClick: (event: ActionFormEvent) => {
        console.warn("CLICK 2");
      },
    },
  ],
};

export default (units: UnitTestMap) => {
  const ui = new ActionFormHandler(actionForm);
  units.set("action_form", (ctx: CustomCommandOrigin) => {
    ui.showAll({ test: "hello, world!" });
  });
};
