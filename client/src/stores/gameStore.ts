import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { socket } from '@/utils/socketClient/socket';

export const useGameStore = defineStore('gameStore', () => {
  /** Bind all socket events */
  const bindEvents = (): void => {};

  return { bindEvents };
});
