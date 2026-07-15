import {
  FeatureHandler,
  FeaturePlaceEvent,
  StructureTemplate,
  CustomFeature,
  FacingDirection,
  WeightedRandomFeature,
  ExtendedFeature,
  CustomFeatureRule,
} from "@lpsmods/mc-utils";

// FEATURE

class MyCustomFeature extends CustomFeature {
  static typeId = "lpsmods:my_feature";

  constructor() {
    const options = { offset: { x: 0, y: 0, z: 0 }, grounded: true };
    super(options);
  }

  *place(event: FeaturePlaceEvent): Generator<void> {
    event.dimension.setBlockType(event.location, "obsidian");
    this.debug(event);
  }
}

function registerFeatures(reg: FeatureHandler): void {
  reg.addFeature(MyCustomFeature.typeId, new MyCustomFeature());
  var options = {
    offset: { x: 0, y: 0, z: 0 },
    grounded: true,
    // debug: true,
    facing_direction: FacingDirection.Random,
  };
  const fea1 = reg.addFeature("lpsmods:my_structure3", new StructureTemplate("lpsmods:my_structure", options));
  const fea2 = reg.addFeature("lpsmods:my_structure16", new StructureTemplate("lpsmods:my_structure16", options));
  reg.addFeature("lpsmods:extended_structure", new ExtendedFeature("lpsmods:my_structure16"));
  reg.addFeature("lpsmods:my_structure", new WeightedRandomFeature().addFeature(fea1, 1).addFeature(fea2, 1));
}

function registerFeatureRules(reg: FeatureHandler): void {
  var options = {
    // scatter_chance: 0.5,
    // min_y: 0,
    // max_y: 0,
    biomes: ["plains"],
    blocks: ["air", "grass_block", "dirt", "stone"],
    distribution: {
      x: 1, // 0 16
      z: 1, // 0 16
    },
  };

  reg.addFeatureRule("lpsmods:my_structure_rule", new CustomFeatureRule("lpsmods:my_structure16", options));
}
function setup() {
  const handler = new FeatureHandler({ type: "lpsmods:custom_feature" });
  handler.debug = true;
  registerFeatures(handler);
  registerFeatureRules(handler);
}

setup();
