import type { AppleData } from '@/types/commonTypes';

/**
 * Generate specific amount of apples positions
 * @param {number} numberOfApples number of apples to generate
 * @returns {AppleData[]} positions of all apples
 */
export const generateApplesPositions = (numberOfApples: number = 1): AppleData[] => {
  const positions: AppleData[] = [];
  for (let i = 0; i < numberOfApples; i++) {
    const x = Math.floor(Math.random() * 70);
    const y = Math.floor(Math.random() * 40);
    positions.push({ appleType: 'basic', position: { x, y } });
  }

  return positions;
};
