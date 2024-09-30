import { reactive } from 'vue';
import { io } from 'socket.io-client';

export const state = reactive({
  connected: false,
});

export const socket = io('http://localhost:8080');

socket.on('connect', (): void => {
  state.connected = true;
});

socket.on('disconnect', (): void => {
  state.connected = false;
});
