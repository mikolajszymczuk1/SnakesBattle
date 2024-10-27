import SnakeTail from '@/mod/gameObjects/SnakeTail';
import BaseObject from '@/mod/gameObjects/BaseObject';
import { useGameStore } from '@/stores/gameStore';
import { useConnectionStore } from '@/stores/connectionStore';
import type { SnakeData } from '@/types/commonTypes';

class SnakePlayer extends BaseObject {
  private readonly MOVE_DELAY: number = 0.1;

  private direction: string;
  private nextDirection: string;
  private timeSinceLastMove: number = 0;

  private readonly tail: SnakeTail[] = [];
  private snakeLength: number = 5;

  private readonly gameStore;
  private readonly connectionStore;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    tailColor: string,
    ctx: CanvasRenderingContext2D,
  ) {
    super(x, y, width, height, color, tailColor, ctx);
    this.direction = 'right';
    this.nextDirection = 'right';
    this.gameStore = useGameStore();
    this.connectionStore = useConnectionStore();
  }

  /** Draw object */
  public draw(): void {
    super.draw();
    for (const singleTailElement of this.tail) {
      singleTailElement.draw(true);
    }
  }

  /** Update object */
  public update(deltaTime: number, keys: { [key: string]: boolean }): void {
    this.updateDriection(keys);

    this.timeSinceLastMove += deltaTime;
    if (this.timeSinceLastMove > this.MOVE_DELAY) {
      this.timeSinceLastMove = 0;
      this.direction = this.nextDirection;
      this.grow();
      this.updatePosition();
      this.updateTail();
      this.sendSnakeDataToServer();
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
  public grow(x?: number, y?: number): void {
    const snakeTail = new SnakeTail(
      x ?? this.x,
      y ?? this.y,
      this.width,
      this.height,
      this.color,
      this.tailColor,
      this.ctx,
    );

    this.tail.push(snakeTail);
  }

  public sendSnakeDataToServer(): void {
    const data: SnakeData = {
      id: this.connectionStore.clientId,
      head: {
        x: this.x,
        y: this.y,
      },
      tail: [],
    };

    for (const tailElement of this.tail) {
      data.tail.push({ x: tailElement.x, y: tailElement.y });
    }

    this.gameStore.sendSnakeData(data);
  }

  public updateSnakeData(data: SnakeData) {
    // Update head
    this.x = data.head.x;
    this.y = data.head.y;

    // Update tail
    this.tail.splice(0, this.tail.length);
    data.tail.forEach((tailElement) => {
      this.grow(tailElement.x, tailElement.y);
    });
  }
}

export default SnakePlayer;
