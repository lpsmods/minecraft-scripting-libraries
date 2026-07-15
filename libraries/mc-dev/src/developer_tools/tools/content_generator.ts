import { BlockInventoryComponent, BlockPermutation, ItemStack, ItemTypes, Player, Vector3 } from "@minecraft/server";
import { DevTool } from "./base";
import { AdvancedTooltipsTool } from "./advanced_tooltips";
import {
  ActionForm,
  ActionFormHandler,
  Identifier,
  ModalForm,
  ModalFormHandler,
  ModalFormOnSubmit,
} from "@lpsmods/mc-common";
import { WorldUtils } from "@lpsmods/mc-utils";

class ContentGeneratorTool extends DevTool {
  static readonly toolId = "content_generator";

  constructor() {
    super(ContentGeneratorTool.toolId, {
      name: "Content Generator",
      description: "Generate contents by namespace.\n",
    });
  }

  private generateChests(player: Player, items: ItemStack[]): void {
    const doubleChestSize = 54;
    const sortedItems = [...items]
      .sort((a, b) => a.typeId.localeCompare(b.typeId))
      .map((item) => this.applyAdvancedTooltips(item.clone()));
    const chestCount = Math.ceil(sortedItems.length / doubleChestSize);
    const origin = {
      x: Math.floor(player.location.x),
      y: Math.floor(player.location.y),
      z: Math.floor(player.location.z) + 2,
    };
    const chestPermutation = BlockPermutation.resolve("minecraft:chest", {
      "minecraft:cardinal_direction": "north",
    });

    for (let chestIndex = 0; chestIndex < chestCount; chestIndex++) {
      const x = origin.x + (chestIndex % 4) * 3;
      const z = origin.z + Math.floor(chestIndex / 4) * 2;
      const left = { x, y: origin.y, z };
      const right = { x: x + 1, y: origin.y, z };

      this.clearChestArea(player, left);
      player.dimension.setBlockPermutation(left, chestPermutation);
      player.dimension.setBlockPermutation(right, chestPermutation);

      const chestItems = sortedItems.slice(chestIndex * doubleChestSize, (chestIndex + 1) * doubleChestSize);
      this.fillChest(player, left, right, chestItems);
    }
  }

  private clearChestArea(player: Player, left: Vector3): void {
    this.removeItemEntities(player, left);

    for (let x = left.x - 1; x <= left.x + 2; x++) {
      for (let y = left.y; y <= left.y + 2; y++) {
        for (let z = left.z - 1; z <= left.z + 1; z++) {
          player.dimension.setBlockType({ x, y, z }, "minecraft:air");
        }
      }
    }

    this.removeItemEntities(player, left);
  }

  private removeItemEntities(player: Player, left: Vector3): void {
    const min = { x: left.x - 1, y: left.y, z: left.z - 1 };
    const max = { x: left.x + 2, y: left.y + 2, z: left.z + 1 };
    const center = {
      x: (min.x + max.x) / 2,
      y: (min.y + max.y) / 2,
      z: (min.z + max.z) / 2,
    };

    for (const entity of player.dimension.getEntities({ type: "item", location: center, maxDistance: 4 })) {
      const location = entity.location;
      if (
        location.x >= min.x &&
        location.x <= max.x + 1 &&
        location.y >= min.y &&
        location.y <= max.y + 1 &&
        location.z >= min.z &&
        location.z <= max.z + 1
      ) {
        entity.remove();
      }
    }
  }

  private applyAdvancedTooltips(item: ItemStack): ItemStack {
    const tool = DevTool.all.get(AdvancedTooltipsTool.toolId);
    if (!(tool instanceof AdvancedTooltipsTool) || !tool.isEnabled) return item;
    return tool.apply(item);
  }

  private fillChest(player: Player, left: Vector3, right: Vector3, items: ItemStack[]): void {
    const leftContainer = this.getInventoryContainer(player, left);
    if (leftContainer && leftContainer.size >= items.length) {
      items.forEach((item, slot) => leftContainer.setItem(slot, item));
      return;
    }

    const containers = [leftContainer, this.getInventoryContainer(player, right)].filter((container) => container !== undefined);
    let itemIndex = 0;
    for (const container of containers) {
      for (let slot = 0; slot < container.size && itemIndex < items.length; slot++) {
        container.setItem(slot, items[itemIndex]);
        itemIndex++;
      }
    }
  }

  private getInventoryContainer(player: Player, location: Vector3) {
    const block = player.dimension.getBlock(location);
    const inventory = block?.getComponent("inventory") as BlockInventoryComponent | undefined;
    return inventory?.container;
  }

  private logItems(items: ItemStack[]): void {
    const itemsByNamespace = new Map<string, string[]>();
    for (const item of items) {
      const namespace = Identifier.parse(item.typeId).namespace;
      const ids = itemsByNamespace.get(namespace) ?? [];
      ids.push(item.typeId);
      itemsByNamespace.set(namespace, ids);
    }

    for (const namespace of [...itemsByNamespace.keys()].sort()) {
      const itemIds = itemsByNamespace.get(namespace) ?? [];
      console.log(`${namespace} items:\n${itemIds.sort().map((id) => `- ${id}`).join("\n")}`);
    }
  }

  private itemGenerator(player: Player, namespaces: string[]): void {
    const namespaceSet = new Set(namespaces);
    const items: ItemStack[] = ItemTypes.getAll()
      .filter((type) => namespaceSet.has(Identifier.parse(type.id).namespace))
      .map((type) => new ItemStack(type.id));
    this.logItems(items);
    this.generateChests(player, items);
  }

  private namespacePicker(player: Player, cb: (event: ModalFormOnSubmit) => void): void {
    const form: ModalForm = {
      title: "Namespace Picker",
      submitLabel: "Generate",
      options: {},
      onSubmit: cb,
    };
    const namespaces = WorldUtils.getAllNamespaces().filter((n) => n !== "lpsm_dev");
    for (const namespace of namespaces) {
      form.options[namespace] = { label: `Include '${namespace}' content.`, type: "toggle", value: true };
    }
    new ModalFormHandler(form).show(player);
  }

  show(player: Player): void {
    this.namespacePicker(player, (event) => {
      const namespaces = Object.entries(event.formResult)
        .filter(([, enabled]) => enabled)
        .map(([namespace]) => namespace);
      const form: ActionForm = {
        title: this.options.name,
        body: this.options.description,
        buttons: [
          {
            label: "Items",
            onClick: () => {
              this.itemGenerator(player, namespaces);
            },
          },
        ],
      };
      new ActionFormHandler(form).show(player);
    });
  }
}

// Initialize
new ContentGeneratorTool();
