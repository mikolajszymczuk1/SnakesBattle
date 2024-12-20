import SnakeTail from '@/mod/gameObjects/SnakeTail';
import BaseObject from '@/mod/gameObjects/BaseObject';
import { useGameStore } from '@/stores/gameStore';
import { useConnectionStore } from '@/stores/connectionStore';
import type { SnakeData } from '@/types/commonTypes';
import { convertDataToBinary } from '@/mod/binary/binaryTools';

class SnakePlayer extends BaseObject {
  private direction: string;
  private nextDirection: string;
  private timeSinceLastMove: number = 0;

  private readonly tail: SnakeTail[] = [];
  private snakeLength: number = 3;
  private moveDealy: number = 0.08;

  private readonly speedBonusTime: number = 5;
  private isSnakeSpeed: boolean = false;
  private currentBonusTime: number = 0;

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

  public speedSnake(): void {
    this.moveDealy = 0.04;
    this.isSnakeSpeed = true;
    this.currentBonusTime = 0;
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

    // Resolve bonuses times
    this.currentBonusTime += deltaTime;
    if (this.isSnakeSpeed && this.currentBonusTime > this.speedBonusTime) {
      this.isSnakeSpeed = false;
      this.currentBonusTime = 0;
      this.moveDealy = 0.08;
    }

    // Main snake position and body updates
    this.timeSinceLastMove += deltaTime;
    if (this.timeSinceLastMove > this.moveDealy) {
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

    if (this.xPos > 1400) {
      this.x = 0;
    }

    if (this.yPos > 800) {
      this.y = 0;
    }

    if (this.xPos < 0) {
      this.x = 70;
    }

    if (this.yPos < 0) {
      this.y = 40;
    }
  }

  /** Change snake size */
  public increaseLength(count: number = 1): void {
    this.snakeLength += count;
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

  /** Send all snake data to server (binary) */
  public sendSnakeDataToServer(): void {
    const data: SnakeData = {
      id: this.connectionStore.clientId,
      head: { x: this.x, y: this.y },
      tail: this.tail,
    };
    this.gameStore.sendSnakeData(convertDataToBinary(data));
  }

  /**
   * Update snake data
   * @param {SnakeData} data snake data
   */
  public updateSnakeData(data: SnakeData): void {
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
