import SnakePlayer from '@/mod/gameObjects/SnakePlayer';
import { useGameStore } from '@/stores/gameStore';

class GameMain {
  private readonly gameWidth: number;
  private readonly gameHeight: number;
  private readonly cellSize: number;
  private readonly ctx: CanvasRenderingContext2D;
  private player: SnakePlayer | null = null;
  private lastTime: number;
  private keys: { [key: string]: boolean } = {};
  private readonly gameStore;

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
    this.gameStore.playersMap.forEach((player) => {
      player.draw();
    });
  }

  /**
   * Fabric method to crate new player
   * @returns {SnakePlayer} new player
   */
  public createPlayer(): SnakePlayer {
    const sp = new SnakePlayer(
      0,
      0,
      this.cellSize,
      this.cellSize,
      '#6a19ff',
      '#500ec9',
      this.ctx,
    );
    return sp;
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

    // Dr objects
    this.render();

    requestAnimationFrame(this.gameLoop);
  };
}

export default GameMain;
