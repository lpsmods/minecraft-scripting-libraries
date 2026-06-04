import { AddonUtils } from "../utils";
import { BlockBaseComponent } from "./base";

/**
 * Custom component that implements support check behavior.
 */
export class SupportCheckComponent extends BlockBaseComponent {
  static readonly componentId = AddonUtils.makeId("stairs");
}
