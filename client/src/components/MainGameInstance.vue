<template>
  <div class="gameBoard">
    <canvas
      ref="gameBoardRef"
      id="mainGameBoard"
      class="gameBoard__canvas"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import GameMain from '@/mod/GameMain.ts';

const gameBoardRef: Ref<HTMLCanvasElement | null> = ref(null);
const context: Ref<CanvasRenderingContext2D | null> = ref(null);
const cellSize: number = 40;

/** Initialize game */
const initGame = (): void => {
  gameBoardRef.value.width =
    cellSize * (Math.floor(window.innerWidth / cellSize) - 1);
  gameBoardRef.value.height =
    cellSize * (Math.floor(window.innerHeight / cellSize) - 1);
  context.value = gameBoardRef.value.getContext('2d');

  const game = new GameMain(
    gameBoardRef.value.width,
    gameBoardRef.value.height,
    cellSize,
    context.value,
  );

  game.createPlayer();
  game.runGameLoop();
};

onMounted((): void => {
  initGame();
});
</script>

<style lang="scss" scoped>
.gameBoard {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;

  background-color: #121212;

  &__canvas {
    display: block;
  }
}
</style>
