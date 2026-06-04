import { DevTool } from "./base";

class DebugModeTool extends DevTool {
  static readonly toolId = "debug_mode";

  constructor() {
    super(DebugModeTool.toolId, {
      name: "Debug Mode",
      description: "Displays debug information.",
    });
  }
}

// Initialize
new DebugModeTool();
