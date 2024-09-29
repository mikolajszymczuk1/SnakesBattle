export interface IBaseObject {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  ctx: CanvasRenderingContext2D;

  get xPos(): number;
  get yPos(): number;

  setX(x: number): void;
  setY(y: number): void;

  draw(): void;
}
