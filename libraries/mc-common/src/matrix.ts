import { Vector2, Vector3 } from "@minecraft/server";

/**
 * Type definition for a matrix3.
 */
export type Matrix3 = number[][];

/**
 * Utility helpers for matrix.
 */
export abstract class MatrixUtils {
  // Helpers

  static create(rows: number, cols: number, fill = 0): Matrix3 {
    return Array.from({ length: rows }, () => Array(cols).fill(fill));
  }

  static identity(size: number): Matrix3 {
    const m = this.create(size, size);
    for (let i = 0; i < size; i++) {
      m[i][i] = 1;
    }
    return m;
  }

  static clone(matrix: Matrix3): Matrix3 {
    return matrix.map((row) => [...row]);
  }

  static transpose(matrix: Matrix3): Matrix3 {
    return matrix[0].map((_, col) => matrix.map((row) => row[col]));
  }

  // Math

  static multiply(a: Matrix3, b: Matrix3): Matrix3 {
    const rows = a.length;
    const cols = b[0].length;
    const shared = b.length;
    const result = this.create(rows, cols);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let sum = 0;
        for (let i = 0; i < shared; i++) {
          sum += a[y][i] * b[i][x];
        }
        result[y][x] = sum;
      }
    }
    return result;
  }

  static multiplyVector(matrix: Matrix3, vector: number[]): number[] {
    return matrix.map((row) => row.reduce((sum, value, i) => sum + value * vector[i], 0));
  }

  static scale(matrix: Matrix3, scalar: number): Matrix3 {
    return matrix.map((row) => row.map((v) => v * scalar));
  }

  // 2D Transform

  static translation2D(x: number, y: number): Matrix3 {
    return [
      [1, 0, x],
      [0, 1, y],
      [0, 0, 1],
    ];
  }

  static rotation2D(angle: number): Matrix3 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
      [c, -s, 0],
      [s, c, 0],
      [0, 0, 1],
    ];
  }

  static scale2D(x: number, y: number): Matrix3 {
    return [
      [x, 0, 0],
      [0, y, 0],
      [0, 0, 1],
    ];
  }

  static transformPoint2D(point: Vector2, matrix: Matrix3): Vector2 {
    const [x, y] = this.multiplyVector(matrix, [point.x, point.y, 1]);
    return { x, y };
  }

  // 3D Transform

  static rotateX(angle: number): Matrix3 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
      [1, 0, 0],
      [0, c, -s],
      [0, s, c],
    ];
  }

  static rotateY(angle: number): Matrix3 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
      [c, 0, s],
      [0, 1, 0],
      [-s, 0, c],
    ];
  }

  static rotateZ(angle: number): Matrix3 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
      [c, -s, 0],
      [s, c, 0],
      [0, 0, 1],
    ];
  }

  static rotation3D(rotation: Vector3): Matrix3 {
    const rx = this.rotateX(rotation.x);
    const ry = this.rotateY(rotation.y);
    const rz = this.rotateZ(rotation.z);
    // ZYX order
    return this.multiply(rz, this.multiply(ry, rx));
  }

  static rotatePoint3D(point: Vector3, rotation: Vector3): Vector3 {
    const matrix = this.rotation3D(rotation);
    const [x, y, z] = this.multiplyVector(matrix, [point.x, point.y, point.z]);
    return { x, y, z };
  }

  // Projection

  static perspectiveProjection(point: Vector3, fov: number, aspect: number, near: number, far: number): Matrix3 {
    const f = 1 / Math.tan(fov / 2);
    return [
      [f / aspect, 0, 0, 0],
      [0, f, 0, 0],
      [0, 0, (far + near) / (near - far), (2 * far * near) / (near - far)],
      [0, 0, -1, 0],
    ];
  }
}
