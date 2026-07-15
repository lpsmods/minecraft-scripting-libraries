import { CustomCommandOrigin } from "@minecraft/server";
import { UnitTestMap } from "@lpsmods/mc-utils";
import { ModalForm, ModalFormOnSubmit, ModalFormHandler } from "@lpsmods/mc-common";

enum Options {
  Option1 = "option1",
  Option2 = "option2",
  Option3 = "option3",
}

const modalForm: ModalForm = {
  title: "TITLE",
  options: {
    text: { type: "text", label: "TEXT" },
    dropdown: {
      type: "dropdown",
      label: "DROPDOWN",
      values: ["OPTION 1", "OPTION 2", "OPTION 3"],
    },
    dropdown2: {
      type: "dropdown",
      label: "DROPDOWN2",
      values: { option1: "Option 1", option2: "Option 2", option3: "Option 3" },
    },
    dropdown3: {
      type: "dropdown",
      label: "DROPDOWN3",
      values: Options,
    },
    slider: { type: "slider", label: "SLIDER" },
    toggle: { type: "toggle", label: "TOGGLE" },
  },
  onSubmit: (event: ModalFormOnSubmit) => {
    console.warn(JSON.stringify(event.formResult));
  },
};

export default (units: UnitTestMap) => {
  const ui = new ModalFormHandler(modalForm);
  units.set("modal_form", (ctx: CustomCommandOrigin) => {
    ui.showAll({ test: "hello, world!" });
  });
};
