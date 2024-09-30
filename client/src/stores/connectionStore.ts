import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { socket } from '@/utils/socketClient/socket';

export const useConnectionStore = defineStore('connectionStore', () => {
  const isConnected: Ref<boolean> = ref(false);

  /** Bind all socket events */
  const bindEvents = (): void => {
    socket.on('connect', (): void => {
      isConnected.value = true;
    });

    socket.on('disconnect', (): void => {
      isConnected.value = false;
    });
  };

  /** Connect to socket server */
  const connect = (): void => {
    socket.connect();
  };

  /** Disconnect from socket server */
  const disconnect = (): void => {
    socket.disconnect();
  };

  return { isConnected, bindEvents, connect, disconnect };
});
