import { Player } from "@minecraft/server";

import { PropertyValue } from "./constants";
import { ModalForm, ModalFormHandler } from "./ui";
import { DynamicObject, VersionedDataStorage } from "./data";

export interface SettingDescriptor {
  type: "string" | "number" | "boolean" | "Vector3";
  value?: PropertyValue;
  min?: number;
  max?: number;
  values?: string[];
  title?: string;
  description?: string;
}

export interface SettingsOptions {
  formatVersion?: number;
  object?: DynamicObject;
  gzip?: boolean;
}

export class Settings {
  readonly id: string;
  readonly store: VersionedDataStorage;
  readonly options: SettingsOptions;
  descriptor: Record<string, SettingDescriptor>;

  constructor(id: string, options?: SettingsOptions) {
    this.id = id;
    this.options = options ?? {};
    this.store = new VersionedDataStorage(this.id, this.options.formatVersion ?? 1, {
      object: this.options?.object,
      gzip: this.options?.gzip,
    });
    this.descriptor = {};
  }

  getDescriptor(): Record<string, SettingDescriptor> {
    return this.descriptor;
  }

  defineProperty(name: string, descriptor: SettingDescriptor): void {
    this.descriptor[name] = descriptor;
  }

  get(name: string, fallbackValue?: any): any {
    const prop = this.getDescriptor()[name];
    if (!prop) throw new Error(`${name} is not defined!`);
    return this.store.get(name) ?? fallbackValue ?? prop.value;
  }

  set(name: string, value?: any): void {
    if (this.getDescriptor()[name] === undefined) {
      throw new Error(`${name} is not defined!`);
    }
    return this.store.set(name, value);
  }

  reset(): void {
    for (const k of Object.keys(this.getDescriptor())) {
      this.set(k);
    }
  }

  update(data: { [key: string]: any }): void {
    for (const [k, v] of Object.entries(data)) {
      this.set(k, v);
    }
  }

  show(player: Player, title?: string): void {
    const form: ModalForm = {
      title: title ?? "World Settings",
      options: {},
      onSubmit: (event) => {
        this.update(event.formResult);
      },
    };

    for (const [k, prop] of Object.entries(this.getDescriptor())) {
      const label = prop.title ?? k;
      const tooltip = prop.description;
      switch (prop.type) {
        case "string":
          if (prop.values) {
            form.options[k] = {
              label,
              tooltip,
              type: "dropdown",
              values: prop.values,
              value: this.get(k) as number,
            };
            break;
          }
          form.options[k] = {
            label,
            tooltip,
            type: "text",
            value: this.get(k) as string,
          };
          break;
        case "number":
          form.options[k] = {
            label,
            tooltip,
            type: "slider",
            value: this.get(k) as number,
            min: prop.min,
            max: prop.max,
          };
          break;
        case "boolean":
          form.options[k] = {
            label,
            tooltip,
            type: "toggle",
            value: this.get(k) as boolean,
          };
          break;
        case "Vector3":
          form.options[k] = {
            label,
            tooltip,
            type: "text",
            value: JSON.stringify(this.get(k)) as string,
          };
          break;
        default:
          throw new Error(`Unsupported type ${prop.type}`);
      }
    }

    const ui = new ModalFormHandler(form);
    ui.show(player);
  }
}

export interface PlayerSettingsOptions {
  id?: string;
  formatVersion?: number;
  object?: DynamicObject;
  gzip?: boolean;
}

/**
 * Per player settings.
 */
export class PlayerSettings extends Settings {
  readonly player: Player;
  static descriptor: Record<string, SettingDescriptor> = {};

  constructor(player: Player, options?: PlayerSettingsOptions) {
    super(options?.id ?? "mcutils:settings", options);
    this.player = player;
  }

  getDescriptor(): Record<string, SettingDescriptor> {
    return PlayerSettings.descriptor;
  }

  static defineProperty(name: string, descriptor: SettingDescriptor): void {
    this.descriptor[name] = descriptor;
  }

  show(title?: string): void;
  override show(player: Player, title?: string): void;
  show(arg1?: Player | string, arg2?: string): void {
    if (typeof arg1 === "string" || arg1 === undefined) {
      super.show(this.player, arg2);
    } else {
      super.show(arg1, arg2);
    }
  }
}
