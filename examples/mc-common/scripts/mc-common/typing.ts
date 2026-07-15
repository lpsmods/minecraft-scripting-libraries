import {
  Block,
  BlockPermutation,
  BlockType,
  BlockTypes,
  BlockVolume,
  ContainerSlot,
  Dimension,
  DimensionType,
  DimensionTypes,
  EffectType,
  EffectTypes,
  EnchantmentType,
  EnchantmentTypes,
  Entity,
  EntityType,
  EntityTypes,
  ItemStack,
  ItemType,
  ItemTypes,
  Player,
  Vector3,
  world,
  World,
} from "@minecraft/server";
import { isNumber } from "./utils";

export type PropertyValue = string | number | boolean | Vector3 | undefined;

export type JsonSafe = string | number | boolean | { [key: string]: any };

/**
 * Objects that have dynamic property methods.
 */
export type DynamicObject = World | Entity | ItemStack | ContainerSlot;

type TypeObject = { type: string; value: JsonSafe } | string | number | boolean | undefined;

export interface TypeSerializer<T> {
  toJson?: (value: T) => JsonSafe;
  fromJson?: (value: JsonSafe) => T | undefined;
  toString?: (value: T, joiner: string) => string[];
  fromString?: (parts: string[], joiner: string) => T | undefined;
}

export class Typing {
  private static types = new Map<string, TypeSerializer<any>>();

  static defineType<T>(obj: { name: string }, descriptor: TypeSerializer<T>): void {
    const k = obj.name;
    this.types.set(k, descriptor);
  }

  static defineSimple(obj: { name: string }) {
    Typing.defineType<JsonSafe>(obj, {
      toJson: (value) => value,
      fromJson: (value) => value,
      toString: (value) => [JSON.stringify(value)],
      fromString: (parts) => JSON.parse(parts[0]),
    });
  }

  static defineRef(obj: { name: string }, ref: { name: string }) {
    Typing.defineType<JsonSafe>(obj, {
      toJson: (value) => {
        const type = this.types.get(ref.name);
        if (!type || !type.toJson) return {};
        return type.toJson(value);
      },
      fromJson: (value) => {
        const type = this.types.get(ref.name);
        if (!type || !type.fromJson) return;
        return type.fromJson(value);
      },
      toString: (value, joiner) => {
        const type = this.types.get(ref.name);
        if (!type || !type.toString) return [];
        return type.toString(value, joiner);
      },
      fromString: (value, joiner) => {
        const type = this.types.get(ref.name);
        if (!type || !type.fromString) return;
        return type.fromString(value, joiner);
      },
    });
  }

  /**
   * Object to JSON object.
   * @param {any} value
   * @returns {TypeObject}
   */
  static toJson(value: any): TypeObject {
    if (value === undefined) return undefined;
    const def = ["string", "number", "boolean"];
    if (def.includes(typeof value)) return value;
    const k = value.constructor.name;
    const type = Typing.types.get(k);
    if (!type || !type.toJson) throw new TypeError(`Do not know how to serialize ${k}`);
    return { type: k, value: type.toJson(value) };
  }

  /**
   * JSON object to Object
   * @param {TypeObject} value
   * @returns {any}
   */
  static fromJson(value: TypeObject): any {
    if (value === undefined) return undefined;
    if (typeof value !== "object") return value;
    const k = value.type;
    if (!k) return value;
    const type = Typing.types.get(k);
    if (!type || !type.fromJson) throw new TypeError(`Do not know how to deserialize ${k}`);
    return type.fromJson(value.value);
  }

  /**
   * Object to string.
   * @param {any} value
   * @returns {string}
   */
  static toString(value: any, joiner: string = ","): string {
    if (value === undefined) return "undefined";
    const def = ["string", "number", "boolean"];
    if (def.includes(typeof value)) return value.toString().replace(joiner, "%2C");
    const k = value.constructor.name;
    const type = Typing.types.get(k);
    if (!type || !type.toString) throw new TypeError(`Do not know how to serialize ${k}`);
    return [k, ...type.toString(value, joiner)].join(joiner);
  }

  /**
   * string to Object
   * @param {string} value
   * @returns {any}
   */
  static fromString(value: string, joiner: string = ","): any {
    if (value === "undefined") return undefined;
    if (typeof value !== "string") return value;
    const parts = value.split(joiner);
    if (parts.length < 2) return value.replace("%2C", joiner);
    const k = parts[0];
    const type = Typing.types.get(k);
    if (isNumber(value)) return +value;
    if (!type || !type.fromString) throw new TypeError(`Do not know how to deserialize ${k}`);
    return type.fromString(parts.slice(1), joiner);
  }
}

// @minecraft types

Typing.defineType<BlockPermutation>(BlockPermutation, {
  toJson: (value) => {
    return { blockName: value.type.id, states: value.getAllStates() };
  },
  fromJson: (value) => {
    if (typeof value !== "object") return;
    return BlockPermutation.resolve(value.blockName, value.states);
  },
  toString: (value) => [value.type.id, JSON.stringify(value.getAllStates())],
  fromString: (parts) => BlockPermutation.resolve(parts[0], JSON.parse(parts[1])),
});

Typing.defineType<BlockType>(BlockType, {
  toJson: (value) => {
    return value.id;
  },
  fromJson: (value) => {
    return BlockTypes.get(value.toString());
  },
  toString: (value) => [value.id],
  fromString: (parts) => BlockTypes.get(parts[0]),
});

Typing.defineType<ItemType>(ItemType, {
  toJson: (value) => {
    return value.id;
  },
  fromJson: (value) => {
    return ItemTypes.get(value.toString());
  },
  toString: (value) => [value.id],
  fromString: (parts) => ItemTypes.get(parts[0]),
});

Typing.defineType<EntityType>(EntityType, {
  toJson: (value) => {
    return value.id;
  },
  fromJson: (value) => {
    return EntityTypes.get(value.toString());
  },
  toString: (value) => [value.id],
  fromString: (parts) => EntityTypes.get(parts[0]),
});

Typing.defineType<EnchantmentType>(EnchantmentType, {
  toJson: (value) => {
    return value.id;
  },
  fromJson: (value) => {
    return EnchantmentTypes.get(value.toString());
  },
  toString: (value) => [value.id],
  fromString: (parts) => EnchantmentTypes.get(parts[0]),
});

Typing.defineType<EffectType>(EffectType, {
  toJson: (value) => {
    return value.getName();
  },
  fromJson: (value) => {
    return EffectTypes.get(value.toString());
  },
  toString: (value) => [value.getName()],
  fromString: (parts) => EffectTypes.get(parts[0]),
});

Typing.defineType<DimensionType>(DimensionType, {
  toJson: (value) => {
    return value.typeId;
  },
  fromJson: (value) => {
    return DimensionTypes.get(value.toString());
  },
  toString: (value) => [value.typeId],
  fromString: (parts) => DimensionTypes.get(parts[0]),
});

Typing.defineType<Dimension>(Dimension, {
  toJson: (value) => {
    return value.id;
  },
  fromJson: (value) => {
    return world.getDimension(value.toString());
  },
  toString: (value) => [value.id],
  fromString: (parts) => world.getDimension(parts[0]),
});

Typing.defineType<Block>(Block, {
  toJson: (value) => {
    return { dimension: value.dimension.id, ...value.location };
  },
  fromJson: (value) => {
    if (typeof value !== "object") return;
    return world.getDimension(value.dimension).getBlock({ x: value.x, y: value.y, z: value.z });
  },
  toString: (value) =>
    [value.dimension.id, value.location.x, value.location.y, value.location.z].map((part) => part.toString()),
  fromString: (parts) => world.getDimension(parts[0]).getBlock({ x: +parts[1], y: +parts[2], z: +parts[3] }),
});

Typing.defineType<Entity>(Entity, {
  toJson: (value) => {
    return value.id;
  },
  fromJson: (value) => {
    return world.getEntity(value.toString());
  },
  toString: (value) => [value.id],
  fromString: (parts) => world.getEntity(parts[0]),
});

Typing.defineType<BlockVolume>(BlockVolume, {
  toJson: (value) => {
    return { from: value.from, to: value.to };
  },
  fromJson: (value) => {
    if (typeof value !== "object") return;
    return new BlockVolume(value.from, value.to);
  },
  toString: (value) =>
    [value.from.x, value.from.y, value.from.z, value.to.x, value.to.y, value.to.z].map((part) => part.toString()),
  fromString: (parts) =>
    new BlockVolume({ x: +parts[0], y: +parts[1], z: +parts[2] }, { x: +parts[3], y: +parts[4], z: +parts[5] }),
});

// TS types

Typing.defineType<RegExp>(RegExp, {
  toJson: (value) => {
    return { pattern: value.source, flags: value.flags };
  },
  fromJson: (value) => {
    if (typeof value !== "object") return;
    return new RegExp(value.pattern, value.flags);
  },
  toString: (value) => [value.source, value.flags],
  fromString: (parts) => new RegExp(parts[0], parts[1]),
});

Typing.defineType<Date>(Date, {
  toJson: (value) => {
    return value.getTime();
  },
  fromJson: (value) => {
    return new Date(value as number);
  },
  toString: (value) => [value.getTime().toString()],
  fromString: (parts) => new Date(+parts[0]),
});

Typing.defineType<BigInt>(BigInt, {
  toJson: (value) => {
    return Number(value);
  },
  fromJson: (value) => {
    return BigInt(value as number);
  },
  toString: (value) => [value.toString()],
  fromString: (parts) => BigInt(+parts[0]),
});

Typing.defineType<Error>(Error, {
  toJson: (value) => {
    return { message: value.message, name: value.name, stack: value.stack };
  },
  fromJson: (value) => {
    if (typeof value !== "object") return;
    return new Error(value.message);
  },
  toString: (value) => [value.message, value.name, value.stack || ""],
  fromString: (parts) => new Error(parts[0]),
});

// Nested types

Typing.defineType<Array<any>>(Array, {
  toJson: (value) => {
    return [...value].map(Typing.toJson);
  },
  fromJson: (value) => {
    if (!Array.isArray(value)) return;
    return value.map(Typing.fromJson);
  },
  toString: (value) => [...value].map((part) => Typing.toString(part)),
  fromString: (parts) => parts.map((part) => Typing.fromString(part)),
});
Typing.defineType<Map<any, any>>(Map, {
  toJson: (value) => {
    const result: JsonSafe = {};
    for (const [k, v] of value.entries()) {
      result[k] = Typing.toJson(v);
    }
    return result;
  },
  fromJson: (value) => {
    const result: any = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = Typing.fromJson(v);
    }
    return result;
  },
  toString: (value) => [Typing.toString(value)],
  fromString: (parts) => Typing.fromString(parts[0]),
});
Typing.defineType<object>(Object, {
  toJson: (value) => {
    const result: JsonSafe = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = Typing.toJson(v);
    }
    return result;
  },
  fromJson: (value) => {
    const result: any = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = Typing.fromJson(v);
    }
    return result;
  },
  toString: (value) => {
    const result: JsonSafe = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = Typing.toString(v);
    }
    return [JSON.stringify(result)];
  },
  fromString: (parts, joiner) => {
    const result: any = {};
    const data = JSON.parse(parts.join(joiner));
    for (const [k, v] of Object.entries(data)) {
      result[k] = Typing.fromString(v as string);
    }
    return result;
  },
});

// Reference types

Typing.defineRef(Player, Entity);
// Typing.defineRef(WeakMap, Map);
// Typing.defineRef(Set, Array);
// Typing.defineRef(WeakSet, Array);
// Typing.defineRef(Uint8Array, Array);

// export class Hasher {
//   static parseVec3(value: string): Vector3 {
//     if (!value) return { x: 0, y: 0, z: 0 };
//     const points = value.split(",");
//     const x = +points[0];
//     const y = +points[1];
//     const z = +points[2];
//     return { x, y, z };
//   }

//   static parseVec2(value: string): Vector2 {
//     if (!value) return { x: 0, y: 0 };
//     const points = value.split(",");
//     const x = +points[0];
//     const y = +points[1];
//     return { x, y };
//   }

//   static parseVecXZ(value: string): VectorXZ {
//     if (!value) return { x: 0, z: 0 };
//     const points = value.split(",");
//     const x = +points[0];
//     const z = +points[1];
//     return { x, z };
//   }

//   static parseBlock(value: string): Block | undefined {
//     if (!value) return undefined;
//     const points = value.split(",");
//     let dim = points[0];
//     let location = this.parseVec3(points.slice(1, 4).join(","));
//     if (!location) return undefined;
//     return world.getDimension(dim).getBlock(location);
//   }

//   static stringify(value: Vector3 | Vector2 | VectorXZ | Container | Block | undefined): string | undefined {
//     if (!value) return value;
//     const t = Typing.get(value);
//     switch (t) {
//       case TypingTypes.Container:
//         return this.hashContainer(value as Container);
//       case TypingTypes.Block:
//         return this.hashBlock(value as Block);
//       case TypingTypes.VectorXZ:
//         return this.hashVecXZ(value as VectorXZ);
//       case TypingTypes.Vector3:
//         return this.hashVec3(value as Vector3);
//       case TypingTypes.Vector2:
//         return this.hashVec2(value as Vector2);
//       default:
//         throw new Error(`Unknown type "${t}"`);
//     }
//   }

//   static hashVecXZ(pos: VectorXZ): string {
//     return `${pos.x},${pos.z}`;
//   }

//   static hashVec3(pos: Vector3): string {
//     return `${pos.x},${pos.y},${pos.z}`;
//   }

//   static hashVec2(pos: Vector2): string {
//     return `${pos.x},${pos.y}`;
//   }

//   static hashContainer(container: Container): string {
//     const contents = [];
//     for (let i = 0; i < container.size; i++) {
//       const item = container.getItem(i);
//       contents.push(item ? `${item.typeId}:${item.amount}` : "");
//     }
//     return contents.join("|");
//   }

//   static hashBlock(block?: Block): string {
//     if (!block) return "air";
//     return `${block.dimension.id},${this.hashVec3(block.location)},${block.typeId}`;
//   }
// }
