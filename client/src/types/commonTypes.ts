export type Position = {
  x: number;
  y: number;
};

export type SnakeData = {
  id: string;
  head: Position;
  tail: Position[];
  headColor?: string;
  tailColor?: string;
};

export type AppleData = {
  appleType: string;
  position: Position;
};
