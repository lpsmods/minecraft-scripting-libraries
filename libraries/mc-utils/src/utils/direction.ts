/**
 * Generic direction functions.
 */

import { Direction, Vector2, Vector3 } from "@minecraft/server";
import {
  VECTOR2_ZERO,
  VECTOR3_DOWN,
  VECTOR3_EAST,
  VECTOR3_NORTH,
  VECTOR3_SOUTH,
  VECTOR3_UP,
  VECTOR3_WEST,
  VECTOR3_ZERO,
} from "@minecraft/math";

export abstract class DirectionUtils {
  /**
   * Converts a {@link Vector2} rotation to facing direction.
   * @param {Vector2} rotation
   * @returns {Direction}
   */
  static fromRotation(rotation: Vector2): Direction {
    const { x: pitch, y: yaw } = rotation;
    if (pitch <= -45) return Direction.Up;
    if (pitch >= 45) return Direction.Down;
    const norm = (((yaw % 360) + 540) % 360) - 180;
    if (norm >= -45 && norm < 45) return Direction.South;
    if (norm >= 45 && norm < 135) return Direction.West;
    if (norm >= -135 && norm < -45) return Direction.East;
    return Direction.North;
  }
  /**
   * @deprecated Use fromRotation instead.
   */
  static rot2dir = DirectionUtils.fromRotation;

  /**
   * Like `fromRotation` but ignores vertical pitch. Always returns a horizontal direction.
   * @param {Vector2} rotation
   * @returns {Direction}
   */
  static fromHorizontalRotation(rotation: Vector2): Direction {
    const { y: yaw } = rotation;
    const norm = (((yaw % 360) + 540) % 360) - 180;
    if (norm >= -45 && norm < 45) return Direction.South;
    if (norm >= 45 && norm < 135) return Direction.West;
    if (norm >= -135 && norm < -45) return Direction.East;
    return Direction.North;
  }

  /**
   * Converts a number to a direction.
   * @param {number} num
   * @returns {Direction}
   */
  static fromNumber(num: number): Direction {
    switch (num) {
      case 0:
        return Direction.North;
      case 1:
        return Direction.South;
      case 2:
        return Direction.East;
      case 3:
        return Direction.West;
      case 4:
        return Direction.Up;
      case 5:
        return Direction.Down;
      default:
        return Direction.North;
    }
  }

  /**
   * Converts a weirdo direction number to a direction.
   * @param {number} num
   * @returns {Direction}
   */
  static fromWeirdo(num: number): Direction {
    switch (num) {
      case 0:
        return Direction.East;
      case 1:
        return Direction.West;
      case 2:
        return Direction.South;
      case 3:
        return Direction.North;
      default:
        return Direction.North;
    }
  }

  /**
   * Rotates the Y direction counterclockwise to the left.
   * @param {string} dir
   * @returns {Direction}
   */
  static rotateYLeft(dir: string | undefined): Direction | string {
    return this.opposite(this.rotateYRight(dir));
  }

  /**
   * @deprecated Use rotateYLeft instead.
   */
  static rotateYCounterclockwise = DirectionUtils.rotateYLeft;

  /**
   * Rotates the Y direction clockwise to the right.
   * @param {string} dir
   * @returns {Direction}
   */
  static rotateYRight(dir: string | undefined): Direction {
    if (!dir) {
      return Direction.North;
    }
    if (typeof dir == "number") dir = DirectionUtils.fromNumber(dir);
    switch (dir.toLowerCase()) {
      case "north":
        return Direction.East;
      case "east":
        return Direction.South;
      case "south":
        return Direction.West;
      case "west":
        return Direction.North;
      default:
        return Direction.North;
    }
  }

  /**
   * @deprecated Use rotateYRight instead.
   */
  static rotateY = DirectionUtils.rotateYRight;

  /**
   * Returns the primary cardinal direction from one location to another.
   * @param {Vector3} origin
   * @param {Vector3} target
   * @returns {Direction|undefined}
   */
  static directionTo(origin: Vector3, target: Vector3): Direction | undefined {
    const dx = target.x - origin.x;
    const dy = target.y - origin.y;
    const dz = target.z - origin.z;
    if (dx === 0 && dy === 0 && dz === 0) return undefined;
    if (Math.abs(dx) >= Math.abs(dy) && Math.abs(dx) >= Math.abs(dz)) {
      return dx > 0 ? Direction.West : Direction.East;
    } else if (Math.abs(dz) >= Math.abs(dx) && Math.abs(dz) >= Math.abs(dy)) {
      return dz > 0 ? Direction.North : Direction.South;
    } else {
      return dy > 0 ? Direction.Down : Direction.Up;
    }
  }

  /**
   * @deprecated Use getDirectionTo instead.
   */
  static relDir = DirectionUtils.directionTo;

  /**
   * Returns the primary cardinal direction from one location to another,
   * ignoring vertical (up/down) differences.
   * @param {Vector3} origin
   * @param {Vector3} target
   * @returns {Direction|undefined}
   */
  static horizontalDirectionTo(origin: Vector3, target: Vector3): Direction | undefined {
    const dx = target.x - origin.x;
    const dz = target.z - origin.z;
    if (dx === 0 && dz === 0) return undefined;
    if (Math.abs(dx) >= Math.abs(dz)) {
      return dx > 0 ? Direction.West : Direction.East;
    }
    return dz > 0 ? Direction.North : Direction.South;
  }

  /**
   * Get the opposite direction.
   * @param {string|number} dir
   * @returns {Direction}
   */
  static opposite(dir: string | number | undefined): Direction | string {
    if (!dir) {
      return Direction.North;
    }
    if (typeof dir === "number") dir = DirectionUtils.fromNumber(dir);
    switch (dir.toLowerCase()) {
      case "north":
        return Direction.South;
      case "south":
        return Direction.North;
      case "east":
        return Direction.West;
      case "west":
        return Direction.East;
      case "top":
        return "bottom";
      case "up":
      case "above":
        return Direction.Down;
      case "bottom":
        return "top";
      case "down":
      case "below":
        return Direction.Up;
      default:
        return Direction.North;
    }
  }

  /**
   * @deprecated Use opposite instead.
   */
  static getOpposite = DirectionUtils.opposite;

  /**
   * Convert direction to an axis.
   * @param {string} direction
   * @returns {string}
   */
  static toAxis(direction: string | undefined): string {
    if (!direction) {
      return "x";
    }
    if (typeof direction == "number") direction = DirectionUtils.fromNumber(direction);
    switch (direction.toLowerCase()) {
      case "north":
      case "south":
        return "x";
      case "east":
      case "west":
        return "z";
      case "up":
      case "down":
      case "top":
      case "bottom":
        return "y";
      default:
        return "x";
    }
  }

  /**
   * Convert a direction to offset location.
   * @param {string|number} direction
   * @returns {Vector3}
   */
  static toOffset(direction: string | number | undefined): Vector3 {
    if (!direction) {
      return { x: 0, y: 0, z: -1 };
    }
    if (typeof direction == "number") direction = DirectionUtils.fromNumber(direction);
    // https://github.com/Mojang/minecraft-scripting-libraries/issues/124
    switch (direction.toLowerCase()) {
      case "north":
        return VECTOR3_SOUTH;
      case "south":
        return VECTOR3_NORTH;
      case "east":
        return VECTOR3_EAST;
      case "west":
        return VECTOR3_WEST;
      case "top":
      case "above":
      case "up":
        return VECTOR3_UP;
      case "bottom":
      case "below":
      case "down":
        return VECTOR3_DOWN;
      default:
        return VECTOR3_ZERO;
    }
  }

  /**
   * Convert a direction to rotation. (in degrees)
   * @param {string|number} direction
   * @returns {Vector2}
   */
  static toRotation(direction: string | number | undefined): Vector2 {
    if (!direction) {
      return VECTOR2_ZERO;
    }
    if (typeof direction == "number") direction = DirectionUtils.fromNumber(direction);
    switch (direction.toLowerCase()) {
      case "north":
        return { x: 0, y: 180 };
      case "south":
        return VECTOR2_ZERO;
      case "east":
        return { x: 0, y: -90 };
      case "west":
        return { x: 0, y: 90 };
      case "above":
      case "up":
        return { x: -90, y: 0 };
      case "below":
      case "down":
        return { x: 90, y: 0 };
      default:
        return VECTOR2_ZERO;
    }
  }

  /**
   * Returns world offset vector from a local (^ ^ ^) offset and direction
   * @param local Local offset in ^ ^ ^ space
   * @param direction Cardinal direction (north, south, east, west)
   * @returns Offset in world space
   */
  static offsetFromDirection(local: Partial<Vector3>, direction: Direction | string): Vector3 {
    let forward: Vector3;
    let left: Vector3;

    const up: Vector3 = { x: 0, y: 1, z: 0 };

    switch (direction.toLowerCase()) {
      case "north":
        forward = { x: 0, y: 0, z: -1 };
        left = { x: 1, y: 0, z: 0 };
        break;
      case "south":
        forward = { x: 0, y: 0, z: 1 };
        left = { x: -1, y: 0, z: 0 };
        break;
      case "east":
        forward = { x: 1, y: 0, z: 0 };
        left = { x: 0, y: 0, z: 1 };
        break;
      case "west":
        forward = { x: -1, y: 0, z: 0 };
        left = { x: 0, y: 0, z: -1 };
        break;
      default:
        throw new Error("Unsupported direction: " + direction);
    }

    return {
      x: (local.x ?? 0) * left.x + (local.y ?? 0) * up.x + (local.z ?? 0) * forward.x,
      y: (local.x ?? 0) * left.y + (local.y ?? 0) * up.y + (local.z ?? 0) * forward.y,
      z: (local.x ?? 0) * left.z + (local.y ?? 0) * up.z + (local.z ?? 0) * forward.z,
    };
  }

  /**
   * Returns world offset vector from a local (^ ^ ^) offset and rotation
   * @param local Local offset in ^ ^ ^ space
   * @param rotation Rotation in degrees {pitch, yaw}
   * @returns Offset in world space
   */
  static offsetFromRotation(local: Partial<Vector3>, rotation: Vector2): Vector3 {
    const yawRad = (rotation.y * Math.PI) / 180;
    const pitchRad = (rotation.x * Math.PI) / 180;

    const sinYaw = Math.sin(yawRad);
    const cosYaw = Math.cos(yawRad);
    const sinPitch = Math.sin(pitchRad);
    const cosPitch = Math.cos(pitchRad);

    // Calculate basis vectors for the rotated local coordinate system
    const forward: Vector3 = {
      x: -sinYaw * cosPitch,
      y: -sinPitch,
      z: cosYaw * cosPitch,
    };

    const left: Vector3 = {
      x: -cosYaw,
      y: 0,
      z: -sinYaw,
    };

    const up: Vector3 = {
      x: -sinYaw * sinPitch,
      y: 1,
      z: cosYaw * sinPitch,
    };

    return {
      x: (local.x ?? 0) * left.x + (local.y ?? 0) * up.x + (local.z ?? 0) * forward.x,
      y: (local.x ?? 0) * left.y + (local.y ?? 0) * up.y + (local.z ?? 0) * forward.y,
      z: (local.x ?? 0) * left.z + (local.y ?? 0) * up.z + (local.z ?? 0) * forward.z,
    };
  }
}
