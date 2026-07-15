import { TextDisplayHandler } from "@lpsmods/mc-utils";

class TextDisplay extends TextDisplayHandler {
  constructor() {
    super({ type: "lpsmods:text_display" });
  }
}

export default () => {
  new TextDisplay();
};
