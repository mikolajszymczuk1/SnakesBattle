import { ref, type Ref, reactive, type Reactive } from 'vue';
import { defineStore } from 'pinia';
import { socket } from '@/utils/socketClient/socket';
import GameMain from '@/mod/GameMain';
import SnakePlayer from '@/mod/gameObjects/SnakePlayer';
import { useConnectionStore } from '@/stores/connectionStore';
import type { Position, SnakeData } from '@/types/commonTypes';

export const useGameStore = defineStore('gameStore', () => {
  const gameInstance: Ref<GameMain | null> = ref(null);
  const playersMap: Reactive<Map<string, SnakePlayer>> = reactive(
    new Map<string, SnakePlayer>(),
  );

  /** Bind all socket events */
  const bindEvents = (): void => {
    socket.on('player:updatePlayerList', (players): void => {
      const mapFromServer: Map<string, SnakeData> = new Map(players);

      // Before update player list, remove old players
      for (const [id, player] of playersMap) {
        if (!mapFromServer.has(id)) {
          playersMap.delete(id);
        }
      }

      // Update exiting players or prepare new objects
      for (const [id, data] of mapFromServer) {
        if (playersMap.has(id)) {
          playersMap.get(id)!.updateSnakeData(data);
        } else {
          playersMap.set(id, gameInstance.value!.createPlayer());
        }
      }
    });

    socket.on('player:run', (): void => {
      const connectionStore = useConnectionStore();
      gameInstance.value?.setPlayer(
        playersMap.get(connectionStore.clientId) as SnakePlayer,
      );
      gameInstance.value?.runGameLoop();
    });

    socket.on('player:updateData', (data: SnakeData): void => {
      if (playersMap.has(data.id)) {
        playersMap.get(data.id)!.updateSnakeData(data);
      }
    });

    socket.on('player:removePlayer', (id: string): void => {
      playersMap.delete(id);
    });

    socket.on('player:grow', (): void => {
      gameInstance.value!.growSnake();
    });

    socket.on('game:updateApplePosition', (position: Position): void => {
      gameInstance.value!.updateApplePosition(position);
    });
  };

  const sendSnakeData = (data: SnakeData): void => {
    socket.emit('player:data', data);
  };

  return {
    gameInstance,
    playersMap,
    bindEvents,
    sendSnakeData,
  };
});
