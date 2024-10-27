import { Server } from 'socket.io';
import type { AppConfig } from '@/types/AppConfig';
import type { SnakeData } from '@/types/commonTypes';

/**
 * Create socket server and all needed logic
 * @param {any} expressServer node express server instance
 */
export const createSocketServer = (expressServer: any, config: AppConfig) => {
  const io = new Server(expressServer, { cors: { origin: config.api.baseClientUrl } });

  const playersMap: Map<string, SnakeData> = new Map<string, SnakeData>();

  io.on('connection', (socket): void => {
    console.log(`User connected: ${socket.id}`);
    socket.emit('client:connect', socket.id);
    playersMap.set(socket.id, { id: socket.id, head: { x: 0, y: 0 }, tail: [] });
    io.emit('player:updatePlayerList', Array.from(playersMap.entries()));
    socket.emit('player:run');

    socket.on('disconnect', (): void => {
      console.log(`User disconnected: ${socket.id}`);
      playersMap.delete(socket.id);
      socket.emit('player:removePlayer', socket.id);
    });

    socket.on('player:data', (data): void => {
      playersMap.set(data.id, data);
      socket.broadcast.emit('player:updateData', data);
    });
  });

  return io;
};
