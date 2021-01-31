import { Position } from "./types";

export const getDistance = ([x1, y1]: Position, [x2, y2]: Position) => {
  const d = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
  return d;
};
