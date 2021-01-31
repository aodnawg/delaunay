import { Triangle, Position } from "./types";

export const makeCircumscribedCircle = (
  triangle: Triangle
): [position: Position, r: number] => {
  const [[x1, y1], [x2, y2], [x3, y3]] = triangle;

  const c = 2.0 * ((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1));
  const x =
    ((y3 - y1) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1) +
      (y1 - y2) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1)) /
    c;
  const y =
    ((x1 - x3) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1) +
      (x2 - x1) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1)) /
    c;
  const position: Position = [x, y];
  const r = Math.pow(x - x1, 2) + Math.pow(y - y1, 2);

  return [position, r];
};
