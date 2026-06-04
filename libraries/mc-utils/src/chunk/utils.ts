import { Block, Dimension, Entity, Vector3, VectorXZ, world } from "@minecraft/server";

import { Chunk } from "./base";

/**
 * Utility helpers for chunk.
 */
export class ChunkUtils {
  /**
   * Whether to gzip chunk data before saving it to dynamic properties.
   *
   * This can reduce the size of the data by a lot, but it also increases the time it takes to save and load chunks.
   */
  static gzip: boolean = false;

  /**
   * Converts a block pos to a chunk pos.
   * @param {Vector3} location
   * @returns {VectorXZ}
   */
  static pos(location: Vector3): VectorXZ {
    return {
      x: Math.floor(location.x / 16),
      z: Math.floor(location.z / 16),
    };
  }

  /**
   * Get the chunk from a position in the world.
   * @param {Dimension} dimension
   * @param {Vector3} location
   * @returns {Chunk}
   */
  static fromPos(dimension: Dimension, location: Vector3): Chunk {
    const pos = this.pos(location);
    return new Chunk(dimension, pos);
  }

  /**
   * Get the chunk the block is in.
   * @param {Block} block
   * @returns {Chunk}
   */
  static fromBlock(block: Block): Chunk {
    return this.fromPos(block.dimension, block.location);
  }

  /**
   * Get the chunk the entity is in.
   * @param {Entity} entity
   * @returns {Chunk}
   */
  static fromEntity(entity: Entity): Chunk {
    return this.fromPos(entity.dimension, entity.location);
  }

  /**
   * Create a string representation of a chunk
   * @returns {string}
   */
  static toString(chunk: Chunk): string {
    return `${chunk.dimension.id},${chunk.x},${chunk.z}`;
  }

  /**
   * Gets a CHunk from the string representation produced by ChunkUtils.toString.
   */
  static fromString(str: string): Chunk {
    const points = str.split(",");
    let dim = points[0];
    const x = +points[1];
    const z = +points[2];
    return new Chunk(world.getDimension(dim), { x, z });
  }

  // TODO: Remove these in next release.
  /**
   * @deprecated Use fromEntity instead.
   */
  static entity2Pos = this.fromEntity;

  /**
   * @deprecated Use fromPos instead.
   */
  static pos2Chunk = this.fromPos;

  /**
   * @deprecated Use fromBlock instead.
   */
  static block2Pos = this.fromBlock;
}
