import SnakePlayer from '@/mod/gameObjects/SnakePlayer';
import { useGameStore } from '@/stores/gameStore';
import type { Position } from '@/types/commonTypes';
import Apple from '@/mod/gameObjects/Apple';

class GameMain {
  private readonly gameWidth: number;
  private readonly gameHeight: number;
  private readonly cellSize: number;
  private readonly ctx: CanvasRenderingContext2D;
  private player: SnakePlayer | null = null;
  private lastTime: number;
  private keys: { [key: string]: boolean } = {};
  private readonly gameStore;
  private readonly apples: Apple[] = [];

  constructor(
    gameWidth: number,
    gameHeight: number,
    cellSize: number,
    ctx: CanvasRenderingContext2D,
  ) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.cellSize = cellSize;
    this.ctx = ctx;
    this.lastTime = 0;
    this.gameStore = useGameStore();
    this.addListeners();
    this.createApples(3);
  }

  public setPlayer(player: SnakePlayer) {
    this.player = player;
  }

  /** Add some events listeners */
  public addListeners(): void {
    window.addEventListener('keydown', (e) => (this.keys[e.key] = true));
    window.addEventListener('keyup', (e) => (this.keys[e.key] = false));
  }

  /** Draw board helper grid */
  public drawGrid(): void {
    this.ctx.strokeStyle = '#1E1E1E';

    for (let x = 0; x <= this.gameWidth; x += this.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.gameHeight);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.gameHeight; y += this.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.gameWidth, y);
      this.ctx.stroke();
    }
  }

  /** Clear game window */
  public clearGameBoard(): void {
    this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
  }

  /** Update game elements */
  public update(deltaTime: number): void {
    this.player!.update(deltaTime, this.keys);
  }

  /** Render game elements */
  public render(): void {
    this.drawGrid();
    this.apples.forEach((apple) => apple.draw());
    this.gameStore.playersMap.forEach((player) => player.draw());
  }

  /**
   * Fabric method to crate new player
   * @param {string} headColor head color value
   * @param {string} tailColor tail color value
   * @returns {SnakePlayer} new player
   */
  public createPlayer(
    headColor: string = '#6a19ff',
    tailColor: string = '#500ec9',
  ): SnakePlayer {
    const sp = new SnakePlayer(
      0,
      0,
      this.cellSize,
      this.cellSize,
      headColor,
      tailColor,
      this.ctx,
    );
    return sp;
  }

  /**
   * Create apples objects on client side
   * @param {number} count count of apples to create
   */
  public createApples(count: number = 1): void {
    for (let i = 0; i < count; i++) {
      this.apples.push(
        new Apple(
          0,
          0,
          this.cellSize,
          this.cellSize,
          '#ff0000',
          '#ffffff',
          this.ctx,
        ),
      );
    }
  }

  /** Start game loop */
  public runGameLoop(): void {
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop);
  }

  /** Main game loop cycle */
  public gameLoop = (timestamp: number): void => {
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // Clear window
    this.clearGameBoard();

    // Update objects
    this.update(deltaTime);

    // Draw objects
    this.render();

    requestAnimationFrame(this.gameLoop);
  };

  /**
   * Update apple position
   * @param {Position[]} positions new apples positions
   */
  public updateApplesPosition(positions: Position[]): void {
    for (let i = 0; i < positions.length; i++) {
      this.apples[i].setX(positions[i].x);
      this.apples[i].setY(positions[i].y);
    }
  }

  public growSnake(): void {
    this.player!.increaseLength();
  }
}

export default GameMain;
