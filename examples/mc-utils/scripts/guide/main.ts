import { blocks } from "./blocks.js";
import { items } from "./items.js";
import { changelog } from "./changelog.js";
import { Pages } from "@lpsmods/mc-common";

export const pages: Pages = {
  ...blocks,
  ...items,
  ...changelog,
  home: {
    title: "mcutils Guide Book",
    body: "The main page.",
    buttons: [
      // "mcutils:search",
      "lpsmods:example",
      { label: "#blocks", pageId: "blocks" },
      { label: "#items", pageId: "items" },
      { label: "#changelogs", pageId: "changes" },
      "mcutils:host_settings",
      "mcutils:player_settings",
    ],
  },
};
