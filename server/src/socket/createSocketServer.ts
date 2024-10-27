import { Server } from 'socket.io';
import type { AppConfig } from '@/types/AppConfig';
import type { Position, SnakeData } from '@/types/commonTypes';

/**
 * Create socket server and all needed logic
 * @param {any} expressServer node express server instance
 */
export const createSocketServer = (expressServer: any, config: AppConfig) => {
  const io = new Server(expressServer, { cors: { origin: config.api.baseClientUrl } });
  const playersMap: Map<string, SnakeData> = new Map<string, SnakeData>();
  const applePosition: Position = { x: 35, y: 20 };

  io.on('connection', (socket): void => {
    console.log(`User connected: ${socket.id}`);
    socket.emit('client:connect', socket.id);
    playersMap.set(socket.id, { id: socket.id, head: { x: 0, y: 0 }, tail: [], length: 0 });
    io.emit('player:updatePlayerList', Array.from(playersMap.entries()));
    io.emit('game:updateApplePosition', applePosition);
    socket.emit('player:run');

    socket.on('disconnect', (): void => {
      console.log(`User disconnected: ${socket.id}`);
      playersMap.delete(socket.id);
      socket.emit('player:removePlayer', socket.id);
      socket.broadcast.emit('player:updatePlayerList', Array.from(playersMap.entries()));
    });

    socket.on('player:data', (data): void => {
      // Apple logic
      if (data.head.x === applePosition.x && data.head.y === applePosition.y) {
        applePosition.x = Math.floor(Math.random() * 70);
        applePosition.y = Math.floor(Math.random() * 40);
        socket.emit('player:grow');
        io.emit('game:updateApplePosition', applePosition);
      }

      // Collisions with own tail
      if (
        playersMap.has(data.id) &&
        playersMap
          .get(data.id)!
          .tail.some((tailElement) => tailElement.x === data.head.x && tailElement.y === data.head.y)
      ) {
        playersMap.delete(data.id);
        socket.emit('player:gameOver');
        socket.emit('player:removePlayer', data.id);
        socket.broadcast.emit('player:updatePlayerList', Array.from(playersMap.entries()));
        return;
      }

      // Collision with other players
      for (const [id, player] of playersMap) {
        if (
          id !== data.id &&
          player.tail.some((tailElement) => tailElement.x === data.head.x && tailElement.y === data.head.y)
        ) {
          playersMap.delete(data.id);
          socket.emit('player:gameOver');
          socket.emit('player:removePlayer', data.id);
          socket.broadcast.emit('player:updatePlayerList', Array.from(playersMap.entries()));
          return;
        }
      }

      if (playersMap.has(data.id)) {
        playersMap.set(data.id, data);
        socket.broadcast.emit('player:updateData', data);
      }
    });
  });

  return io;
};
