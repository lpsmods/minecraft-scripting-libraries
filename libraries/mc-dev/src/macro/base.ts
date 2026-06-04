import { Player, system, world } from "@minecraft/server";
import { MacroIntent, MacroIntentData } from "./intents";
import {
  ActionButton,
  ActionForm,
  ActionFormHandler,
  DataUtils,
  ModalForm,
  ModalFormHandler,
} from "@lpsmods/mc-common";

export interface MacroData {
  id: number;
  name: string;
  intent: MacroIntentData;
}

export class Macros {
  static getAll(): MacroData[] {
    const defaultValue = [
      { id: 1, name: "Macro 1", intent: { type: "run_command", command: "say Macro 1" } },
      { id: 2, name: "Macro 2", intent: { type: "toggle_game_mode" } },
      { id: 3, name: "Macro 3", intent: { type: "run_command", command: "say Macro 3" } },
      { id: 4, name: "Macro 4", intent: { type: "run_command", command: "say Macro 4" } },
      { id: 5, name: "Macro 5", intent: { type: "run_command", command: "say Macro 5" } },
      { id: 6, name: "Macro 6", intent: { type: "run_command", command: "say Macro 6" } },
      { id: 7, name: "Macro 7", intent: { type: "run_command", command: "say Macro 7" } },
      { id: 8, name: "Macro 8", intent: { type: "run_command", command: "say Macro 8" } },
      { id: 9, name: "Macro 9", intent: { type: "run_command", command: "say Macro 9" } },
      { id: 10, name: "Macro 10", intent: { type: "run_command", command: "say Macro 10" } },
    ];
    return DataUtils.getDynamicProperty(world, "macros", defaultValue);
  }

  static saveMacro(macro: MacroData): void {
    const macros = this.getAll().filter((m) => m.id === macro.id);
    macros.push(macro);
    DataUtils.setDynamicProperty(world, "macros", macros);
  }

  static get(id: number): MacroData | undefined {
    return this.getAll().find((macro) => macro.id == id);
  }

  static show(player: Player, title?: string, body?: string): void {
    const form: ActionForm = {
      title: title,
      body: body,
      buttons: [],
    };
    for (let i = 1; i <= 10; i++) {
      const btn: ActionButton = {
        label: `Macro ${i}`,
        onClick() {
          Macros.showMacro(i, player);
        },
      };
      if (form.buttons) form.buttons.push(btn);
    }
    new ActionFormHandler(form).show(player);
  }

  static showMacro(macroId: number, player: Player): void {
    const data = this.get(macroId);
    if (!data) throw new Error(`Unknown macro ${macroId}`);
    // const actions =[...MacroIntent.all.values()].map((x) => x.options?.name ?? x.id);
    const actions: Record<string, string> = {};
    for (const [k, v] of MacroIntent.all.entries()) {
      actions[k] = v.options?.name ?? k;
    }
    const form: ModalForm = {
      title: data.name,
      options: {
        _: { type: "label", text: `Macro bound to §l/macro${macroId}§r command.` },
        name: { type: "text", label: "Name", value: data.name },
        action: {
          type: "dropdown",
          label: "Action",
          values: actions,
          value: data.intent?.type ?? "run_command",
        },
        command: {
          type: "text",
          label: "Command",
          value: data.intent?.command ?? "",
        },
      },
      onSubmit(event) {
        const macro: MacroData = {
          id: macroId,
          name: event.formResult.name as string,
          intent: {
            type: (event.formResult.action as string) ?? "run_command",
            command: event.formResult.command as string,
          },
        };
        Macros.saveMacro(macro);
        player.sendMessage("Saved!");
      },
    };
    new ModalFormHandler(form).show(player);
  }

  static execute(macroId: number, player: Player): void {
    const data = this.get(macroId);
    if (!data) return player.sendMessage(`Unknown macro ${macroId}`);
    const intent = MacroIntent.all.get(data.intent.type);
    if (!intent) return player.sendMessage(`Unknown action ${data.intent.type}`);
    system.run(() => {
      intent.execute(player, data.intent);
    });
  }
}
