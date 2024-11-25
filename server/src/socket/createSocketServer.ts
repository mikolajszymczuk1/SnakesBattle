import { Server } from 'socket.io';
import type { AppConfig } from '@/types/AppConfig';
import type { SnakeData, SnakeColor, AppleData } from '@/types/commonTypes';
import { generateApplesPositions } from '@/mod/utils/gameHelpers';
import { getSnakeDataFromBinary, convertDataToBinary } from '@/mod/utils/binary/binaryTools';

/**
 * Create socket server and all needed logic
 * @param {any} expressServer node express server instance
 */
export const createSocketServer = (expressServer: any, config: AppConfig) => {
  const io = new Server(expressServer, { cors: { origin: config.api.baseClientUrl } });

  const snakeColors: SnakeColor[] = [
    { headColor: '#FF5733', tailColor: '#CC4629' },
    { headColor: '#33FF57', tailColor: '#29CC45' },
    { headColor: '#3357FF', tailColor: '#2946CC' },
    { headColor: '#FF33A1', tailColor: '#CC2981' },
    { headColor: '#33FFF5', tailColor: '#29CCC5' },
    { headColor: '#FFC300', tailColor: '#CC9C00' },
    { headColor: '#E74C3C', tailColor: '#BA3E30' },
    { headColor: '#9B59B6', tailColor: '#7C4792' },
    { headColor: '#1ABC9C', tailColor: '#15967C' },
    { headColor: '#F1C40F', tailColor: '#C19E0C' },
  ];

  const maxPlayers: number = 5;

  const playersMap: Map<string, SnakeData> = new Map<string, SnakeData>();
  const filteredColors: SnakeColor[] = snakeColors.filter((snakeColor) => {
    for (const player of playersMap.values()) {
      if (player.headColor === snakeColor.headColor) {
        return false;
      }
    }

    return true;
  });
  const applesPosition: AppleData[] = generateApplesPositions(3);

  /** Send fresh player list to other players */
  const updatePlayerList = () => {
    io.emit('player:updatePlayerList', Array.from(playersMap.entries()));
  };

  /**
   * Apple collision logic
   * @param {SnakeData} data snake data
   * @param {any} socket socket instance
   */
  const handleAppleCollision = (data: SnakeData, socket: any) => {
    // Apple logic
    applesPosition.forEach((applePosition: AppleData) => {
      if (data.head.x === applePosition.position.x && data.head.y === applePosition.position.y) {
        switch (applePosition.appleType) {
          case 'basic':
            socket.emit('player:grow');
            break;
          case 'bonus':
            socket.emit('player:grow:bonus');
            break;
          case 'speed':
            socket.emit('player:grow:speed');
            break;
          default:
            socket.emit('player:grow');
        }

        applePosition.position.x = Math.floor(Math.random() * 70);
        applePosition.position.y = Math.floor(Math.random() * 40);

        const appleTypes = ['basic', 'basic', 'basic', 'basic', 'bonus', 'bonus', 'speed'];
        applePosition.appleType = appleTypes[Math.floor(Math.random() * appleTypes.length)];

        io.emit('game:updateApplesPositions', applesPosition);
      }
    });
  };

  /**
   * Player collisions logic
   * @param {SnakeData} data snake data
   * @param {any} socket socket instance
   */
  const handlePlayerCollision = (data: SnakeData, socket: any) => {
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
      updatePlayerList();
      return true;
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
        updatePlayerList();
        return true;
      }
    }

    return false;
  };

  io.on('connection', (socket): void => {
    if (playersMap.size >= maxPlayers) {
      return;
    }

    console.log(`User connected: ${socket.id}`);
    socket.emit('client:connect', socket.id);
    const selectedColor = filteredColors[Math.floor(Math.random() * snakeColors.length)];
    playersMap.set(socket.id, {
      id: socket.id,
      head: { x: 0, y: 0 },
      tail: [],
      headColor: selectedColor.headColor,
      tailColor: selectedColor.tailColor,
    });
    updatePlayerList();
    io.emit('game:updateApplesPositions', applesPosition);
    socket.emit('player:run');

    socket.on('disconnect', (): void => {
      console.log(`User disconnected: ${socket.id}`);
      playersMap.delete(socket.id);
      socket.emit('player:removePlayer', socket.id);
      updatePlayerList();
    });

    socket.on('player:data', (buffer: Buffer): void => {
      const data: SnakeData = getSnakeDataFromBinary(buffer);

      handleAppleCollision(data, socket);

      if (handlePlayerCollision(data, socket)) {
        return;
      }

      if (playersMap.has(data.id)) {
        playersMap.set(data.id, {
          id: data.id,
          head: data.head,
          tail: data.tail,
          headColor: playersMap.get(data.id)?.headColor,
          tailColor: playersMap.get(data.id)?.tailColor,
        });

        socket.broadcast.emit('player:updateData', convertDataToBinary(data));
      }
    });
  });

  return io;
};
