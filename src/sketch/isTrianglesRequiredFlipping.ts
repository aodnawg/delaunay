import { Triangle, Position, Edge } from "./types";
import { isPositionEqual } from "./isPotisionEqual";
import { makeCircumscribedCircle } from "./makeCircumscribedCircle";
import { getDistance } from "./getDistance";

const existsSamePointsInTriangle = (position: Position, triangle: Triangle) => {
  for (let i = 0; i < triangle.length; i++) {
    const currentPosition = triangle[i];
    const result = isPositionEqual(position, currentPosition);
    if (result) {
      return i;
    }
  }
  return false;
};

const containPointWithCircumcribedCircle = (
  p: Position,
  triangle: Triangle
) => {
  const [cPosition, cR] = makeCircumscribedCircle(triangle);
  const distance = getDistance(cPosition, p);
  if (distance > cR) {
    return false;
  } else {
    return true;
  }
};

/**
 * triangle1 から triangle2 が所持していない座標を出力する
 */
const substractedPointByTriangles = (
  triangle1: Triangle,
  triangle2: Triangle
): [[Position, Position], [Position, Position]] => {
  const targetPoint: number[] = [];
  const containedIndex: number[] = [];
  for (let i = 0; i < triangle1.length; i++) {
    const p = triangle1[i];
    const skip = existsSamePointsInTriangle(p, triangle2);
    if (skip !== false) {
      containedIndex.push(skip);
      continue;
    }
    targetPoint.push(i);
  }

  const targetIndex2Index = [0, 1, 2].filter(
    (i) => i !== containedIndex[0] && i !== containedIndex[1]
  )[0];
  const targetTriangle2 = triangle2[targetIndex2Index];

  if (targetPoint.length !== 1) {
    throw new Error();
  }

  const targetIndex = targetPoint[0];
  const targetPosition = triangle1[targetIndex];

  const restPosition = [0, 1, 2]
    .filter((i) => i !== targetIndex)
    .map((i) => triangle1[i]) as [Position, Position];

  return [[targetPosition, targetTriangle2], restPosition];
};

export const isTrianglesRequiredFlipping = (
  triangle1: Triangle,
  triangle2: Triangle
): [
  result: boolean,
  triangles: [Triangle, Triangle],
  edgeList: [Edge, Edge, Edge, Edge, Edge]
] => {
  const [
    [isolatedPoint1, isolatedPoint2],
    [sharedPoint1, sharedPoint2],
  ] = substractedPointByTriangles(triangle1, triangle2);
  const contains = containPointWithCircumcribedCircle(
    isolatedPoint1,
    triangle2
  );

  if (!contains) {
    const newEdge: [Edge, Edge, Edge, Edge, Edge] = [
      [sharedPoint1, isolatedPoint1],
      [isolatedPoint1, sharedPoint2],
      [sharedPoint2, isolatedPoint2],
      [isolatedPoint2, sharedPoint1],
      [sharedPoint1, sharedPoint2],
      // [isolatedPoint1, isolatedPoint2],
    ];
    return [contains, [triangle1, triangle2], newEdge];
  }

  const newEdge: [Edge, Edge, Edge, Edge, Edge] = [
    [sharedPoint1, isolatedPoint1],
    [isolatedPoint1, sharedPoint2],
    [sharedPoint2, isolatedPoint2],
    [isolatedPoint2, sharedPoint1],
    // [sharedPoint1, sharedPoint2],
    [isolatedPoint1, isolatedPoint2],
  ];

  return [
    contains,
    [
      [isolatedPoint1, isolatedPoint2, sharedPoint1],
      [isolatedPoint1, isolatedPoint2, sharedPoint2],
    ],
    newEdge,
  ];
};
