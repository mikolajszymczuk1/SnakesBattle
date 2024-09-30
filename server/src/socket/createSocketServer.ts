import { Server } from 'socket.io';
import type { AppConfig } from '@/types/AppConfig';

/**
 * Create socket server and all needed logic
 * @param {any} expressServer node express server instance
 */
export const createSocketServer = (expressServer: any, config: AppConfig) => {
  const io = new Server(expressServer, { cors: { origin: config.api.baseClientUrl } });

  io.on('connection', (socket): void => {
    console.log(`User connected: ${socket.id}`);

    socket.on('disconnect', (): void => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
