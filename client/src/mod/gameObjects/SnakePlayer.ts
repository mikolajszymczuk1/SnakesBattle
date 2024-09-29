import SnakeTail from '@/mod/gameObjects/SnakeTail';
import BaseObject from '@/mod/gameObjects/BaseObject';

class SnakePlayer extends BaseObject {
  private direction: string;
  private nextDirection: string;
  private moveDelay: number = 0.08;
  private timeSinceLastMove: number = 0;

  private tail: SnakeTail[] = [];
  private snakeLength = 50;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    ctx: CanvasRenderingContext2D,
  ) {
    super(x, y, width, height, color, ctx);
    this.direction = 'right';
    this.nextDirection = 'right';
  }

  /** Draw object */
  public draw(): void {
    super.draw();
    for (const singleTailElement of this.tail) {
      singleTailElement.draw();
    }
  }

  /** Update object */
  public update(deltaTime: number, keys: { [key: string]: boolean }): void {
    this.updateDriection(keys);

    this.timeSinceLastMove += deltaTime;
    if (this.timeSinceLastMove > this.moveDelay) {
      this.timeSinceLastMove = 0;
      this.direction = this.nextDirection;
      this.grow();
      this.updatePosition();
      this.updateTail();
    }
  }

  /** Update direction */
  public updateDriection(keys: { [key: string]: boolean }): void {
    if (keys['ArrowUp'] && this.direction !== 'down') {
      this.nextDirection = 'up';
    }

    if (keys['ArrowDown'] && this.direction !== 'up') {
      this.nextDirection = 'down';
    }

    if (keys['ArrowLeft'] && this.direction !== 'right') {
      this.nextDirection = 'left';
    }

    if (keys['ArrowRight'] && this.direction !== 'left') {
      this.nextDirection = 'right';
    }
  }

  /** Update player position */
  public updatePosition(): void {
    switch (this.direction) {
      case 'up':
        this.y -= 1;
        break;
      case 'down':
        this.y += 1;
        break;
      case 'left':
        this.x -= 1;
        break;
      case 'right':
        this.x += 1;
        break;
    }
  }

  /** Change snake size */
  public increaseLength(): void {
    this.snakeLength++;
  }

  /** Update tail (tail movement logic) */
  public updateTail(): void {
    if (this.tail.length > this.snakeLength) {
      this.tail.shift();
    }
  }

  /** Add one element to player snake tail */
  public grow(): void {
    const snakeTail = new SnakeTail(
      this.x,
      this.y,
      this.width,
      this.height,
      this.color,
      this.ctx,
    );

    this.tail.push(snakeTail);
  }
}

export default SnakePlayer;
