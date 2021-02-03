import { remove, concat, range } from "ramda";
import { Triangle, Position, Edge } from "./types";
import { isTrianglesRequiredFlipping } from "./isTrianglesRequiredFlipping";
import { searchTriangleWithEdge } from "./searchTriangleWithEdge";
import { addVectors } from "./addVectors";
import { subtractVectors } from "./subtractVectors";
import { multipleVectors } from "./multipleVectors";

const makeVertexList = (
  num: number,
  width: number,
  height: number,
  k?: number
): Position[] => {
  return range(0, num).map(() => {
    const k_ = k || 1;
    const x = Math.floor(Math.random() * width * k_);
    const y = Math.floor(Math.random() * height * k_);
    const p: Position = [x / k_, y / k_];
    return p;
  });
};

const makeVertexListWithinTriangle = (triangle: Triangle, num: number) => {
  const [origin, p1, p2] = triangle;
  const v1 = subtractVectors(p1, origin);
  const v2 = subtractVectors(p2, origin);
  const gen = () => {
    const s = Math.random();
    const t = Math.random() * (1 - s);
    return addVectors(
      origin,
      addVectors(multipleVectors(v1, s), multipleVectors(v2, t))
    );
  };
  const result = range(0, num).map(gen);
  return result;
};

const isPointWithinTriangle = (point: Position, triangle: Triangle) => {
  const origin = triangle[0];
  const [x1, y1] = subtractVectors(triangle[1], origin);
  const [x2, y2] = subtractVectors(triangle[2], origin);
  const [x, y] = subtractVectors(point, origin);

  // Cramer's Rule
  const D = x1 * y2 - y1 * x2;
  const Dt = y2 * x - x2 * y;
  const Ds = x1 * y - y1 * x;

  const s = Ds / D;
  const t = Dt / D;

  const result =
    s > 0 && s < 1 && t > 0 && t < 1 && 1 - s - t > 0 && 1 - s - t < 1;

  return result;
};

const devideTriangle = (
  vertex: Position,
  triangle: Triangle
): [Triangle[], Edge[]] => {
  const edges = range(0, 3).map((i) => {
    return [triangle[i % 3], triangle[(i + 1) % 3]];
  }) as Edge[];
  const devidedTriangles = edges.map((e): Triangle => [...e, vertex]);
  return [devidedTriangles, edges];
};

const flip = (
  edges: Edge[],
  triangleList: Triangle[]
): [edges: Edge[], triangleList: Triangle[]] => {
  if (edges.length === 0) {
    return [[], triangleList];
  }
  const [currentEdge, ...restEdges] = edges;

  const triangles = searchTriangleWithEdge(triangleList, currentEdge);
  if (triangles.length < 2) {
    return flip(restEdges, triangleList);
  }
  const [[triangle1Idx, triangle1], [triangle2Idx, triangle2]] = triangles;

  const [
    isFlippingRequired,
    [newTriangle1, newTriangle2],
    addedEdges,
  ] = isTrianglesRequiredFlipping(triangle1, triangle2);

  if (!isFlippingRequired) {
    return flip(restEdges, triangleList);
  }

  const newEdgeList = concat(restEdges, addedEdges);
  const newTriangleList = [...triangleList];
  newTriangleList[triangle1Idx] = newTriangle1;
  newTriangleList[triangle2Idx] = newTriangle2;
  return flip(newEdgeList, newTriangleList);
};

const updateTriangleListWithVertex = (
  triangleList: Triangle[],
  vertex: Position
) => {
  const targetTriangleIndex = searchTriangleWrappingTargetVertex(
    triangleList,
    vertex
  );
  const targetTriangle = triangleList[targetTriangleIndex];
  const [devidedTriangles, edges] = devideTriangle(vertex, targetTriangle);
  const newTriangleList = concat(
    remove(targetTriangleIndex, 1, triangleList),
    devidedTriangles
  );

  const [, triangleList_] = flip(edges, newTriangleList);

  return triangleList_;
};

const searchTriangleWrappingTargetVertex = (
  triangleList: Triangle[],
  vertex: Position
) => {
  let targetTriangleIndex: number = -1;
  for (let i = 0; i < triangleList.length; i++) {
    const currentTriangle = triangleList[i];
    const result = isPointWithinTriangle(vertex, currentTriangle);
    if (!result) {
      continue;
    }
    targetTriangleIndex = i;
    break;
  }

  if (targetTriangleIndex < 0) {
    throw new Error();
  }

  return targetTriangleIndex;
};

export const makeDelauneyTriangle = (
  num: number,
  initialTriangle: Triangle,
  canvasWidth?: number,
  canvasHeight?: number
) => {
  const outerTriangle = initialTriangle;

  const vertexList =
    canvasWidth && canvasHeight
      ? makeVertexList(num, canvasWidth, canvasHeight, 200)
      : makeVertexListWithinTriangle(initialTriangle, num);

  let triangleList = [outerTriangle];
  vertexList.forEach((vertex) => {
    const updatedList = updateTriangleListWithVertex(triangleList, vertex);
    triangleList = updatedList;
  });

  return triangleList;
};
