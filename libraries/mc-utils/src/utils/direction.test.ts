import { Direction } from "@minecraft/server";
import { VECTOR3_NORTH, VECTOR3_SOUTH, VECTOR3_EAST, VECTOR3_WEST, VECTOR3_UP, VECTOR3_DOWN } from "@minecraft/math";
import { describe, expect, it } from "vitest";

import { DirectionUtils } from "./direction";

describe("Direction Utils", () => {
  it("Converts rotation to a direction", () => {
    const north = { x: 0, y: 180 };
    const south = { x: 0, y: 0 };
    const west = { x: 0, y: 90 };
    const east = { x: 0, y: -90 };
    const down = { x: 90, y: 0 };
    const up = { x: -90, y: 0 };
    expect(DirectionUtils.fromRotation(north)).toBe(Direction.North);
    expect(DirectionUtils.fromRotation(south)).toBe(Direction.South);
    expect(DirectionUtils.fromRotation(east)).toBe(Direction.East);
    expect(DirectionUtils.fromRotation(west)).toBe(Direction.West);
    expect(DirectionUtils.fromRotation(up)).toBe(Direction.Up);
    expect(DirectionUtils.fromRotation(down)).toBe(Direction.Down);
  });

  it("Converts horizontal rotation to a direction", () => {
    const north = { x: 0, y: 180 };
    const south = { x: 0, y: 0 };
    const west = { x: 0, y: 90 };
    const east = { x: 0, y: -90 };
    expect(DirectionUtils.fromHorizontalRotation(north)).toBe(Direction.North);
    expect(DirectionUtils.fromHorizontalRotation(south)).toBe(Direction.South);
    expect(DirectionUtils.fromHorizontalRotation(east)).toBe(Direction.East);
    expect(DirectionUtils.fromHorizontalRotation(west)).toBe(Direction.West);
  });

  it("Converts a number to a direction", () => {
    const north = 0;
    const south = 1;
    const east = 2;
    const west = 3;
    const up = 4;
    const down = 5;
    expect(DirectionUtils.fromNumber(north)).toBe(Direction.North);
    expect(DirectionUtils.fromNumber(south)).toBe(Direction.South);
    expect(DirectionUtils.fromNumber(east)).toBe(Direction.East);
    expect(DirectionUtils.fromNumber(west)).toBe(Direction.West);
    expect(DirectionUtils.fromNumber(up)).toBe(Direction.Up);
    expect(DirectionUtils.fromNumber(down)).toBe(Direction.Down);
  });

  it("Converts a weirdo direction number to a direction", () => {
    const east = 0;
    const west = 1;
    const south = 2;
    const north = 3;
    expect(DirectionUtils.fromWeirdo(east)).toBe(Direction.East);
    expect(DirectionUtils.fromWeirdo(west)).toBe(Direction.West);
    expect(DirectionUtils.fromWeirdo(south)).toBe(Direction.South);
    expect(DirectionUtils.fromWeirdo(north)).toBe(Direction.North);
  });

  it("Returns direction rotated counter clockwise", () => {
    const north = Direction.North;
    const south = Direction.South;
    const west = Direction.West;
    const east = Direction.East;
    const down = Direction.Up;
    const up = Direction.Down;
    expect(DirectionUtils.rotateYLeft(north)).toBe(Direction.West);
    expect(DirectionUtils.rotateYLeft(east)).toBe(Direction.North);
    expect(DirectionUtils.rotateYLeft(south)).toBe(Direction.East);
    expect(DirectionUtils.rotateYLeft(west)).toBe(Direction.South);
    expect(DirectionUtils.rotateYLeft(up)).toBe(Direction.South);
    expect(DirectionUtils.rotateYLeft(down)).toBe(Direction.South);
  });

  it("Returns direction rotated clockwise", () => {
    const north = Direction.North;
    const south = Direction.South;
    const west = Direction.West;
    const east = Direction.East;
    const down = Direction.Up;
    const up = Direction.Down;
    expect(DirectionUtils.rotateYRight(north)).toBe(Direction.East);
    expect(DirectionUtils.rotateYRight(east)).toBe(Direction.South);
    expect(DirectionUtils.rotateYRight(south)).toBe(Direction.West);
    expect(DirectionUtils.rotateYRight(west)).toBe(Direction.North);
    expect(DirectionUtils.rotateYRight(up)).toBe(Direction.North);
    expect(DirectionUtils.rotateYRight(down)).toBe(Direction.North);
  });

  it("Returns the facing direction from two points.", () => {
    const origin = { x: 0, y: 0, z: 0 };
    const target = { x: 0, y: 0, z: 1 };
    expect(DirectionUtils.directionTo(origin, target)).toBe(Direction.North);
  });

  it("Returns the horizontal facing direction from two points.", () => {
    const origin = { x: 0, y: 0, z: 0 };
    const target = { x: 0, y: 0, z: 1 };
    expect(DirectionUtils.horizontalDirectionTo(origin, target)).toBe(Direction.North);
  });

  it("Returns the opposite direction", () => {
    const north = Direction.North;
    const south = Direction.South;
    const east = Direction.East;
    const west = Direction.West;
    const up = Direction.Up;
    const down = Direction.Down;
    expect(DirectionUtils.opposite(north)).toBe(Direction.South);
    expect(DirectionUtils.opposite(south)).toBe(Direction.North);
    expect(DirectionUtils.opposite(east)).toBe(Direction.West);
    expect(DirectionUtils.opposite(west)).toBe(Direction.East);
    expect(DirectionUtils.opposite(up)).toBe(Direction.Down);
    expect(DirectionUtils.opposite(down)).toBe(Direction.Up);
  });

  it("Converts a direction to an axis", () => {
    const north = Direction.North;
    const south = Direction.South;
    const east = Direction.East;
    const west = Direction.West;
    const up = Direction.Up;
    const down = Direction.Down;
    expect(DirectionUtils.toAxis(north)).toBe("x");
    expect(DirectionUtils.toAxis(south)).toBe("x");
    expect(DirectionUtils.toAxis(east)).toBe("z");
    expect(DirectionUtils.toAxis(west)).toBe("z");
    expect(DirectionUtils.toAxis(up)).toBe("y");
    expect(DirectionUtils.toAxis(down)).toBe("y");
  });

  it("Converts a direction to an offset", () => {
    const north = Direction.North;
    const south = Direction.South;
    const east = Direction.East;
    const west = Direction.West;
    const up = Direction.Up;
    const down = Direction.Down;
    expect(DirectionUtils.toOffset(north)).toEqual(VECTOR3_SOUTH);
    expect(DirectionUtils.toOffset(south)).toEqual(VECTOR3_NORTH);
    expect(DirectionUtils.toOffset(east)).toEqual(VECTOR3_EAST);
    expect(DirectionUtils.toOffset(west)).toEqual(VECTOR3_WEST);
    expect(DirectionUtils.toOffset(up)).toEqual(VECTOR3_UP);
    expect(DirectionUtils.toOffset(down)).toEqual(VECTOR3_DOWN);
  });

  it("Converts a direction to rotation", () => {
    const north = Direction.North;
    const south = Direction.South;
    const west = Direction.East;
    const east = Direction.West;
    const down = Direction.Up;
    const up = Direction.Down;
    expect(DirectionUtils.toRotation(north)).toEqual({ x: 0, y: 180 });
    expect(DirectionUtils.toRotation(south)).toEqual({ x: 0, y: 0 });
    expect(DirectionUtils.toRotation(east)).toEqual({ x: 0, y: 90 });
    expect(DirectionUtils.toRotation(west)).toEqual({ x: 0, y: -90 });
    expect(DirectionUtils.toRotation(up)).toEqual({ x: 90, y: 0 });
    expect(DirectionUtils.toRotation(down)).toEqual({ x: -90, y: 0 });
  });

  it("Returns the offset from a direction", () => {
    const forward = { x: 0, y: 0, z: 1 };
    const north = Direction.North;
    const south = Direction.South;
    const east = Direction.East;
    const west = Direction.West;
    expect(DirectionUtils.offsetFromDirection(forward, north)).toEqual({
      x: 0,
      y: 0,
      z: -1,
    });
    expect(DirectionUtils.offsetFromDirection(forward, south)).toEqual({
      x: 0,
      y: 0,
      z: 1,
    });
    expect(DirectionUtils.offsetFromDirection(forward, east)).toEqual({
      x: 1,
      y: 0,
      z: 0,
    });
    expect(DirectionUtils.offsetFromDirection(forward, west)).toEqual({
      x: -1,
      y: 0,
      z: 0,
    });
  });

  it("Returns the offset from rotation", () => {
    const forward = { x: 0, y: 0, z: 1 };
    const north = VECTOR3_SOUTH;
    const south = VECTOR3_NORTH;
    const east = VECTOR3_EAST;
    const west = VECTOR3_WEST;
    expect(DirectionUtils.offsetFromRotation(forward, north)).toEqual({
      x: -0,
      y: 0,
      z: 1,
    });
    expect(DirectionUtils.offsetFromRotation(forward, south)).toEqual({
      x: -0,
      y: 0,
      z: 1,
    });
    expect(DirectionUtils.offsetFromRotation(forward, east)).toEqual({
      x: -0,
      y: -0.01745240643728351,
      z: 0.9998476951563913,
    });
    expect(DirectionUtils.offsetFromRotation(forward, west)).toEqual({
      x: 0,
      y: 0.01745240643728351,
      z: 0.9998476951563913,
    });
  });
});
