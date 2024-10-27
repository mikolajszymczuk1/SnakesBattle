export type Position = {
  x: number;
  y: number;
};

export type SnakeData = {
  id: string;
  head: Position;
  tail: Position[];
  length: number;
};
