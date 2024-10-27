<template>
  <div class="gameBoard">
    <h1 class="gameBoard__clientId">
      Client id: {{ connectionStore.clientId }}
    </h1>
    <canvas
      ref="gameBoardRef"
      id="mainGameBoard"
      class="gameBoard__canvas"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import GameMain from '@/mod/GameMain';
import { useConnectionStore } from '@/stores/connectionStore';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();
const connectionStore = useConnectionStore();

const gameBoardRef: Ref<HTMLCanvasElement | null> = ref(null);
const context: Ref<CanvasRenderingContext2D | null> = ref(null);
const width: number = 1400;
const height: number = 800;
const cellSize: number = 20;

/** Initialize game */
const initGame = (): void => {
  gameBoardRef.value!.width = (cellSize * width) / cellSize;
  gameBoardRef.value!.height = (cellSize * height) / cellSize;
  context.value = gameBoardRef.value!.getContext('2d');

  const game = new GameMain(
    gameBoardRef.value!.width,
    gameBoardRef.value!.height,
    cellSize,
    context.value!,
  );

  gameStore.gameInstance = game;
};

/** Connect player to socket server */
const connectToServer = (): void => {
  connectionStore.connect();
};

onMounted((): void => {
  initGame();
  connectToServer();
});
</script>

<style lang="scss" scoped>
.gameBoard {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  width: 100%;
  height: 100vh;

  background-color: #121212;

  &__clientId {
    position: absolute;
    top: 25px;

    font-family: $roboto;
    font-weight: medium;
    font-size: 1.5rem;
    color: white;
  }

  &__canvas {
    display: block;

    border: solid 1px rgba(white, 0.1);
  }
}
</style>
