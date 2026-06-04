import { Color } from "@lpsmods/mc-common";
import { Colors } from "@minecraft/math";
import { Vector2 } from "@minecraft/server";

/**
 * Allowed values for an image format.
 */
export enum ImageFormat {
  RGBA = "rgba",
  RGB = "rgb",
}

/**
 * Allowed values for a sampler method.
 */
export enum SamplerMethod {
  NEAREST = "nearest",
}

/**
 * Provides image behavior.
 */
export class Image {
  data: Color[][];
  readonly size: Vector2;
  readonly format: ImageFormat;

  constructor(size: number | Vector2, data: Color[][], format?: ImageFormat) {
    this.data = data;
    this.size = typeof size === "number" ? { x: size, y: size } : size;
    this.format = format ?? ("a" in data ? ImageFormat.RGBA : ImageFormat.RGB);
  }

  static new(size: Vector2, color?: Color, format?: ImageFormat): Image {
    const data: Color[][] = Array.from({ length: size.y }, () =>
      Array.from({ length: size.x }, () => color ?? Colors.Black),
    );
    return new Image(size, data, format);
  }

  // TODO: Load from base64
  static fromBase64(b64: string): Image {
    return new Image({ x: 16, y: 16 }, []);
  }

  static resize(image: Image, size: Vector2, samplerMethod: SamplerMethod): Image {
    const data: Color[][] = []; // TODO: Resized image.
    switch (samplerMethod) {
      case SamplerMethod.NEAREST:
        break;
    }
    return new Image(size, data, image.format);
  }

  getPixel(uv: Vector2): Color {
    return this.data[uv.x][uv.y];
  }

  // Export

  build(): Color[][] {
    return this.data;
  }

  // TODO: Export base64 (So it can be viewed in the browser)
  base64(): string {
    return "data:image/png;base64,i";
  }

  // Transform

  rotate(degrees: number): Image {
    const rad = (degrees * Math.PI) / 180;
    const h = this.data.length;
    const w = this.data[0].length;
    const out: Color[][] = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => ({ red: 0, green: 0, blue: 0, alpha: 1 })),
    );
    const cx = (w - 1) / 2;
    const cy = (h - 1) / 2;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const srcX = Math.round(cx + dx * cos - dy * sin);
        const srcY = Math.round(cy + dx * sin + dy * cos);
        if (srcX >= 0 && srcX < w && srcY >= 0 && srcY < h) {
          out[y][x] = this.data[srcY][srcX];
        }
      }
    }
    this.data = out;
    return this;
  }

  flipX(): Image {
    const h = this.data.length;
    if (h === 0) return this;
    this.data = [...this.data].reverse();
    return this;
  }

  flipY(): Image {
    this.data = this.data.map((row) => [...row].reverse());
    return this;
  }

  // Draw

  point(xy: Vector2, fill?: Color, width: number = 0): Image {
    const r = Math.floor(width / 2);
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        const px = Math.round(xy.x + dx);
        const py = Math.round(xy.y + dy);
        if (this.data[px] && this.data[px][py]) {
          const rgb = fill ?? Colors.Black;
          this.data[px][py] = { ...rgb, alpha: 1 };
        }
      }
    }
    return this;
  }

  line(from: Vector2, to: Vector2, fill?: Color, width: number = 0, curveJoint: boolean = false): Image {
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    const sx = from.x < to.x ? 1 : -1;
    const sy = from.y < to.y ? 1 : -1;
    let err = dx - dy;

    let x = from.x;
    let y = from.y;

    while (true) {
      this.point({ x, y }, fill, width);

      if (x === to.x && y === to.y) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }

    if (curveJoint) {
      // Example behavior: fill extra pixels around corners
      this.point(to, fill, width + 1);
    }

    return this;
  }

  rectangle(from: Vector2, to: Vector2, fill?: Color, outline?: Color, width: number = 1): Image {
    const minX = Math.min(from.x, to.x);
    const minY = Math.min(from.y, to.y);
    const maxX = Math.max(from.x, to.x);
    const maxY = Math.max(from.y, to.y);

    if (fill) {
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          this.point({ x, y }, fill, 1);
        }
      }
    }

    if (outline) {
      this.line({ x: minX, y: minY }, { x: maxX, y: minY }, outline, width);
      this.line({ x: minX, y: maxY }, { x: maxX, y: maxY }, outline, width);
      this.line({ x: minX, y: minY }, { x: minX, y: maxY }, outline, width);
      this.line({ x: maxX, y: minY }, { x: maxX, y: maxY }, outline, width);
    }

    return this;
  }

  polygon(xy: Vector2[], fill?: Color, outline?: Color, width: number = 1): Image {
    if (xy.length < 3) return this;

    if (fill) {
      const ys = xy.map((p) => p.y);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      for (let y = minY; y <= maxY; y++) {
        const intersections: number[] = [];
        for (let i = 0; i < xy.length; i++) {
          const a = xy[i];
          const b = xy[(i + 1) % xy.length];
          if ((a.y <= y && b.y > y) || (b.y <= y && a.y > y)) {
            const t = (y - a.y) / (b.y - a.y);
            intersections.push(Math.round(a.x + t * (b.x - a.x)));
          }
        }
        intersections.sort((a, b) => a - b);
        for (let i = 0; i < intersections.length; i += 2) {
          const xStart = intersections[i];
          const xEnd = intersections[i + 1];
          if (xEnd !== undefined) {
            for (let x = xStart; x <= xEnd; x++) {
              this.point({ x, y }, fill, 1);
            }
          }
        }
      }
    }

    if (outline) {
      for (let i = 0; i < xy.length; i++) {
        const a = xy[i];
        const b = xy[(i + 1) % xy.length];
        this.line(a, b, outline, width);
      }
    }

    return this;
  }
}
