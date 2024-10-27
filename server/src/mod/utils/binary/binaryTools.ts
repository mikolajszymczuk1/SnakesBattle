import type { Position, SnakeData } from '@/types/commonTypes';

/**
 * Get all snake data from buffer
 * @param {Buffer} buffer buffer to decode
 * @returns {SnakeData} snake data object
 */
export const getSnakeDataFromBinary = (buffer: Buffer): SnakeData => {
  const arrayBuffer = new Uint8Array(buffer).buffer;
  const view = new DataView(arrayBuffer);

  // Get id from buffer
  const idLength = view.getInt8(0);
  let playerId = new TextDecoder().decode(new Uint8Array(arrayBuffer, 1, idLength));

  // Get snake head data from buffer
  const headX = view.getInt16(idLength + 1, true);
  const headY = view.getInt16(idLength + 3, true);

  // Get snake tail data from buffer
  const tail: Position[] = [];
  for (let offset = idLength + 5; offset < view.byteLength; offset += 4) {
    const tailX = view.getInt16(offset, true);
    const tailY = view.getInt16(offset + 2, true);
    tail.push({ x: tailX, y: tailY });
  }

  return { id: playerId, head: { x: headX, y: headY }, tail };
};

/**
 * Convert snake data to binary version (array buffer)
 * @param {SnakeData} data snake data
 * @returns {ArrayBuffer} binary representation of snake data
 */
export const convertDataToBinary = (data: SnakeData): ArrayBuffer => {
  const tailLength = data.tail.length;
  const idBytes = new TextEncoder().encode(data.id);
  const idLength = idBytes.length;

  const bufferSize = 1 + idLength + 4 + tailLength * 4;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // Save id length (1 byte)
  view.setInt8(0, idLength);

  // Save id as bytes
  for (let i = 0; i < idLength; i++) {
    view.setUint8(i + 1, idBytes[i]);
  }

  // Save snake head
  view.setInt16(idLength + 1, data.head.x, true);
  view.setInt16(idLength + 3, data.head.y, true);

  // Save snake tail
  let offset = idLength + 5;
  for (const tailElement of data.tail) {
    view.setInt16(offset, tailElement.x, true);
    view.setInt16(offset + 2, tailElement.y, true);
    offset += 4;
  }

  return buffer;
};
