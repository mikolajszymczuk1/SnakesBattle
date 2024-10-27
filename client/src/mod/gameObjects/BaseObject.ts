import type { IBaseObject } from '@/interfaces/IBaseObject';

class BaseObject implements IBaseObject {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  tailColor: string;
  ctx: CanvasRenderingContext2D;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    tailColor: string,
    ctx: CanvasRenderingContext2D,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.tailColor = tailColor;
    this.ctx = ctx;
  }

  get xPos(): number {
    return this.x * this.width;
  }

  get yPos(): number {
    return this.y * this.height;
  }

  setX(x: number): void {
    this.x = x;
  }

  setY(y: number): void {
    this.y = y;
  }

  /** Draw object */
  draw(isTail: boolean = false): void {
    this.ctx.fillStyle = isTail ? this.tailColor : this.color;
    this.ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
  }
}

export default BaseObject;
