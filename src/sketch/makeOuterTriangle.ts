import { Triangle, Position } from "./types";
import { addVectors } from "./addVectors";
import { subtractVectors } from "./subtractVectors";
import { multipleVectors } from "./multipleVectors";
import { getDistance } from "./getDistance";

export const makeOuterTriangle = (p1: Position, p2: Position): Triangle => {
  const center = addVectors<Position>(
    p1,
    multipleVectors(subtractVectors(p2, p1), 0.5)
  );
  const radius = Math.sqrt(getDistance(p2, center));
  const angles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];

  const outerTrianglePoints = angles.map((a) => {
    const vec: Position = [Math.sin(a), Math.cos(a)];
    const vecExtended = multipleVectors(vec, radius * 2);
    const point = addVectors(center, vecExtended);
    return point;
  }) as Triangle;
  return outerTrianglePoints;
};
