/**
 * Generic block functions.
 */

import {
  Block,
  BlockComponentTickEvent,
  BlockPermutation,
  BlockType,
  Direction,
  Entity,
  GameMode,
  Player,
  SpawnEntityOptions,
  Vector3,
} from "@minecraft/server";
import { BlockStateSuperset } from "@minecraft/vanilla-data";
import { Vector3Utils } from "@minecraft/math";
import {
  MathUtils,
  Oxidization,
  Identifier,
  VersionedDataStorage,
  DataStorageOptions,
  DynamicStorage,
} from "@lpsmods/mc-common";

import { CustomTags } from "../registry";
import { DirectionUtils } from "../utils/direction";

/**
 * Allowed values for an exposed direction.
 */
export enum ExposedDirection {
  Above = "above",
  Below = "below",
  Side = "side",
}

/**
 * Options for configuring the spawn entity rotation.
 */
export interface SpawnEntityRotationOptions extends SpawnEntityOptions {
  removeBlock?: boolean;
  useBlockDirection?: boolean;
}

/**
 * Utility helpers for block.
 */
export abstract class BlockUtils {
  /**
   * Spawns an entity from a block.
   * @param {Block} block
   * @param {string} entityId
   * @param {SpawnEntityRotationOptions} options
   * @returns {Entity} Newly created entity at the block location.
   */
  static spawnBlockEntity(block: Block, entityId: string, options: SpawnEntityRotationOptions = {}): Entity {
    if (!options.initialRotation) options.initialRotation = 0;

    // Apply block rotation.
    if (options.useBlockDirection === undefined || options.useBlockDirection) {
      for (const stateName of ["minecraft:cardinal_direction", "minecraft:facing_direction", "minecraft:block_face"]) {
        if (!BlockUtils.hasState(block, stateName)) continue;
        const dir = BlockUtils.getState(block, stateName) as string;
        options.initialRotation += DirectionUtils.toRotation(dir).y;
      }
    }

    // Remove block before spawning.
    if (options.removeBlock) block.setType("air");
    return block.dimension.spawnEntity(entityId, Vector3Utils.add(block.location, { x: 0.5, z: 0.5 }), options);
  }

  /**
   * Changes the block type, but preserves the states.
   * @param {Block} block
   * @param {string} typeId
   * @returns {Block}
   */
  static setType(block: Block, typeId?: string | BlockType, excludeStates?: string[]): void {
    const blockName = typeId instanceof BlockType ? typeId.id : typeId;
    const states = block.permutation.getAllStates();
    for (const state of excludeStates ?? []) {
      delete states[state];
    }
    try {
      block.setPermutation(BlockPermutation.resolve(blockName ?? "air", states));
    } catch (err) {
      block.setType(blockName ?? "air");
    }
  }

  /**
   * Changes the block state value.
   * @param {Block} block
   * @param {string} stateName
   * @param {any} stateValue
   * @returns {Block}
   */
  static setState(block: Block, stateName: keyof BlockStateSuperset | string, stateValue: any): void {
    block.setPermutation(block.permutation.withState(stateName as keyof BlockStateSuperset, stateValue));
  }

  /**
   * Gets a state for the block.
   * @param {Block} block
   * @param {string} stateName
   * @returns {string | number | boolean | undefined}
   */
  static getState(block: Block, stateName: keyof BlockStateSuperset | string): string | number | boolean | undefined {
    return block.permutation.getState(stateName as keyof BlockStateSuperset);
  }

  /**
   * Whether or not the block has the state name.
   * @param {Block} block
   * @param {string} stateName
   * @returns {boolean}
   */
  static hasState(block: Block, stateName: keyof BlockStateSuperset | string): boolean {
    return block.permutation.getState(stateName as keyof BlockStateSuperset) !== undefined;
  }

  /**
   * Increase a number block state.
   * @param block
   * @param stateName
   * @param amount
   */
  static incrementState(block: Block, stateName: keyof BlockStateSuperset | string, amount: number = 1): number {
    const value = (block.permutation.getState(stateName as keyof BlockStateSuperset) as number) + amount;
    BlockUtils.setState(block, stateName, value);
    return value;
  }

  /**
   * Decrease a number block state.
   * @param block
   * @param stateName
   * @param amount
   */
  static decrementState(block: Block, stateName: keyof BlockStateSuperset | string, amount: number = 1): number {
    const value = (block.permutation.getState(stateName as keyof BlockStateSuperset) as number) - amount;
    BlockUtils.setState(block, stateName, value);
    return value;
  }

  /**
   * Toggle a boolean block state.
   * @param block
   * @param stateName
   */
  static toggleState(block: Block, stateName: keyof BlockStateSuperset | string): boolean {
    const value = block.permutation.getState(stateName as keyof BlockStateSuperset) as boolean;
    BlockUtils.setState(block, stateName, !value);
    return !value;
  }

  /**
   * Checks if both blocks have a matching block state.
   * @param {Block} block First block to compare.
   * @param {Block} otherBlock Second block to compare.
   * @param {string} stateName The block property name to compare.
   * @returns {boolean} Whether or no the properties match.
   */
  static matchState(block: Block, otherBlock: Block, stateName: keyof BlockStateSuperset | string): boolean {
    return (
      block.permutation.getState(stateName as keyof BlockStateSuperset) ===
      otherBlock.permutation.getState(stateName as keyof BlockStateSuperset)
    );
  }

  static MAX_CACHE: number = 512;
  static CACHE: { [key: string]: Array<BlockPermutation | undefined> } = {};
  /**
   * Checks if the block has neighbor updates.
   * @param {BlockComponentTickEvent} e
   * @returns {undefined}
   */
  static getNeighborUpdate(e: BlockComponentTickEvent): Direction | undefined {
    var size = Object.keys(BlockUtils.CACHE).length;
    if (size > BlockUtils.MAX_CACHE) {
      BlockUtils.CACHE = {};
    }
    var key = `${e.block.location.x},${e.block.location.y},${e.block.location.z}`;
    const cached = BlockUtils.CACHE[key];
    const perms = [
      e.block.north()?.permutation ?? undefined,
      e.block.south()?.permutation ?? undefined,
      e.block.east()?.permutation ?? undefined,
      e.block.west()?.permutation ?? undefined,
      e.block.above()?.permutation ?? undefined,
      e.block.below()?.permutation ?? undefined,
    ];
    if (!perms) return undefined;
    if (!cached) {
      BlockUtils.CACHE[key] = perms;
      return undefined;
    }
    for (let i = 0; i < perms.length; i++) {
      if (cached[i] != perms[i]) {
        BlockUtils.CACHE[key] = perms;
        return DirectionUtils.fromNumber(i);
      }
    }
    return undefined;
  }

  /**
   * Checks if a given BlockPermutation exists within a specified taxicab distance.
   * @param {Block} origin - The starting location.
   * @param {number} maxDistance - The maximum taxicab distance to check.
   * @param condition - Function to test.
   * @returns {boolean} - True if the block is found within range, false otherwise.
   */
  static isWithinTaxicabDistance(origin: Block, maxDistance: number, condition: (block: Block) => boolean): boolean {
    return (
      MathUtils.taxicabDistance<boolean>(origin, maxDistance, (location) => {
        const blk = origin.dimension.getBlock(location);
        if (blk && condition(blk)) return true;
      }) ?? false
    );
  }

  /**
   * Checks if a given BlockPermutation exists within a specified chebyshev distance.
   * @param {Block} origin - The starting block.
   * @param {number} maxDistance - The maximum chebyshev distance to check.
   * @param condition - Function to test.
   * @returns {boolean} - True if the block is found within range, false otherwise.
   */
  static isWithinChebyshevDistance(origin: Block, maxDistance: number, condition: (block: Block) => boolean): boolean {
    return (
      MathUtils.chebyshevDistance<boolean>(origin, maxDistance, (location) => {
        const blk = origin.dimension.getBlock(location);
        if (blk && condition(blk)) return true;
      }) ?? false
    );
  }

  /**
   * Tests if the block is water or is waterlogged.
   * @param {Block} block
   * @returns {boolean}
   */
  static isWater(block: Block): boolean {
    return block.matches("water");
  }

  /**
   * Breaks this block like if a player has broken it.
   * @param {Block} block
   * @param {Player} player
   * @returns
   */
  static destroy(block: Block, player?: Player): void {
    if (player && player.getGameMode() === GameMode.Creative) return block.setType("air");
    block.dimension.runCommand(`setblock ${block.location.x} ${block.location.y} ${block.location.z} air destroy`);
  }

  /**
   * Guess the oxidized state of the block or block name.
   * @param {Block|string} block
   * @returns {Oxidization}
   */
  static guessOxidization(block: Block | string | BlockType): Oxidization {
    const typeId = Identifier.parse(block);
    const p = typeId.path.toLowerCase();
    if (p.includes("exposed")) return Oxidization.Exposed;
    if (p.includes("weathered")) return Oxidization.Weathered;
    if (p.includes("oxidized")) return Oxidization.Oxidized;
    return Oxidization.Normal;
  }

  /**
   * Filter positions to only those without another block directly above.
   * @param {Vector3[]} positions
   * @returns {Vector3[]}
   */
  static getExposedBlocks(positions: Vector3[], direction: ExposedDirection = ExposedDirection.Above) {
    const posSet = new Set(positions.map((p) => Vector3Utils.toString(p)));

    return positions.filter((p) => {
      if (direction === "above") {
        return !posSet.has(Vector3Utils.toString(Vector3Utils.add(p, { x: 0, y: 1, z: 0 })));
      }
      if (direction === "below") {
        return !posSet.has(Vector3Utils.toString(Vector3Utils.add(p, { x: 0, y: -1, z: 0 })));
      }
      if (direction === "side") {
        const sides = [
          Vector3Utils.toString(Vector3Utils.add(p, { x: 1, y: 0, z: 0 })),
          Vector3Utils.toString(Vector3Utils.add(p, { x: -1, y: 0, z: 0 })),
          Vector3Utils.toString(Vector3Utils.add(p, { x: 0, y: 0, z: 1 })),
          Vector3Utils.toString(Vector3Utils.add(p, { x: 0, y: 0, z: -1 })),
        ];
        return sides.some((sideKey) => !posSet.has(sideKey));
      }
      throw new Error(`Invalid direction: ${direction}`);
    });
  }

  /**
   * Match any block name.
   * @param {Block} block The block to match.
   * @param {string[]} blockPredicates An array of block names. Prefix with '#' for block tag or "!" to ignore.
   * @returns {boolean} Whether or not the block matched any of the block names.
   */
  static matchAny(
    block: Block,
    blockPredicates: string[],
    states?: Record<string, string | number | boolean>,
  ): boolean {
    const blockSet = [...new Set(blockPredicates)];
    return blockSet.some((blockPredicate) => {
      return BlockUtils.matches(block, blockPredicate, states);
    });
  }

  /**
   * Match this block.
   * @param {Block} block The block to match.
   * @param {string} blockPredicate A block name. Prefix with '#' for block tag or "!" to ignore.
   * @returns {boolean}
   */
  static matches(block: Block, blockPredicate: string, states?: Record<string, string | number | boolean>): boolean {
    if (blockPredicate.charAt(0) === "#") {
      const tag = blockPredicate.slice(1);
      return block.hasTag(tag) || CustomTags.blocks.matches(tag, block.typeId);
    }
    if (blockPredicate.charAt(0) === "!") {
      return !BlockUtils.matches(block, blockPredicate.slice(1), states);
    }
    return block.matches(blockPredicate, states);
  }

  /**
   * Whether or not the block is a wall block.
   * @param {Block} block
   * @returns {boolean}
   */
  static isWall(block?: Block): boolean {
    if (!block) return false;
    return block.hasTag("wall") || Identifier.parse(block).path.includes("wall");
  }

  // #region Dynamic Properties

  /**
   * Get the data storage used for the block.
   * @param {Block} block
   * @param {number} formatVersion
   * @param {DataStorageOptions} options
   * @returns {DynamicStorage}
   */
  static getStorage(block: Block, formatVersion?: number, options?: DataStorageOptions): DynamicStorage {
    const k = `${block.dimension.id},${Vector3Utils.toString(block.location)}`;
    return new DynamicStorage(k, formatVersion, options);
  }

  /**
   * @remarks
   * Clears all dynamic properties that have been set on this
   * block.
   *
   */
  static clearDynamicProperties(block: Block): void {
    this.getStorage(block).clearDynamicProperties();
  }

  /**
   * @remarks
   * Returns a property value.
   *
   * @param identifier
   * The property identifier.
   * @returns
   * Returns the value for the property, or undefined if the
   * property has not been set.
   */
  static getDynamicProperty(block: Block, identifier: string): boolean | number | string | Vector3 | undefined {
    return this.getStorage(block).getDynamicProperty(identifier);
  }

  /**
   * @remarks
   * Returns the available set of dynamic property identifiers
   * that have been used on this entity.
   *
   * @returns
   * A string array of the dynamic properties set on this entity.
   */
  static getDynamicPropertyIds(block: Block): string[] {
    return this.getStorage(block).getDynamicPropertyIds();
  }

  /**
   * @remarks
   * Returns the total size, in bytes, of all the dynamic
   * properties that are currently stored for this entity. This
   * includes the size of both the key and the value.  This can
   * be useful for diagnosing performance warning signs - if, for
   * example, an entity has many megabytes of associated dynamic
   * properties, it may be slow to load on various devices.
   *
   */
  static getDynamicPropertyTotalByteCount(block: Block): number {
    return this.getStorage(block).getDynamicPropertyTotalByteCount();
  }

  /**
   * @remarks
   * Sets multiple dynamic properties with specific values.
   *
   * @param values
   * A Record of key value pairs of the dynamic properties to
   * set. If the data value is null, it will remove that property
   * instead.
   * @throws This function can throw errors.
   *
   * {@link minecraftcommon.ArgumentOutOfBoundsError}
   *
   * {@link minecraftcommon.UnsupportedFunctionalityError}
   */
  static setDynamicProperties(
    block: Block,
    values: Record<string, boolean | number | string | Vector3 | undefined>,
  ): void {
    this.getStorage(block).setDynamicProperties(values);
  }

  /**
   * @remarks
   * Sets a specified property to a value.
   *
   * @param identifier
   * The property identifier.
   * @param value
   * Data value of the property to set. If the value is null, it
   * will remove the property instead.
   *
   * {@link minecraftcommon.ArgumentOutOfBoundsError}
   *
   * {@link minecraftcommon.UnsupportedFunctionalityError}
   */
  static setDynamicProperty(block: Block, identifier: string, value?: boolean | number | string | Vector3): void {
    this.getStorage(block).setDynamicProperty(identifier, value);
  }

  // #endregion
}
