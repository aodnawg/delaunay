import { Position } from "./types";

export const isPositionEqual = (p1: Position, p2: Position) => {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  return x1 === x2 && y1 === y2;
};
