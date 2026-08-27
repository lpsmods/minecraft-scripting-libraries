import { AddOn, animations, block, entity, item } from "@lpsmods/mc-build";

export function buildPacks(bpPath: string, rpPath: string, projectNamespace: string): void {
  const addon = AddOn.open({
    behaviorPack: bpPath,
    resourcePack: rpPath,
  });

  // Create 100 blocks.
  for (let i = 0; i < 100; i++) {
    addon.behaviorPack.addBlock(
      block(`${projectNamespace}:example_block_${i}`)
        .menuCategory("construction")
        .displayName(`Example Block ${i}`)
        .build(),
    );
  }

  // Create 100 items.
  for (let i = 0; i < 100; i++) {
    addon.behaviorPack.addItem(
      item(`${projectNamespace}:example_${i}`).menuCategory("items").displayName(`Example ${i}`).build(),
    );
  }

  // Create 100 entities.
  for (let i = 0; i < 100; i++) {
    addon.behaviorPack.addEntity(entity(`${projectNamespace}:example_${i}`).build());
  }

  // Create 100 animations.
  for (let i = 0; i < 100; i++) {
    addon.resourcePack.addAnimation(`example_${i}.animation.json`, animations().build());
  }

  addon.emit(
    {
      behaviorPack: bpPath,
      resourcePack: rpPath,
    },
    { clean: false },
  );
}
