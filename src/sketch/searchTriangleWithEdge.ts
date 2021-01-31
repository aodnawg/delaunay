import { Triangle, Position, Edge } from "./types";
import { isPositionEqual } from "./isPotisionEqual";

type TriangleStack = [index: number, triangle: Triangle][];

export const isVertexIncludedInTriangle = (
  vertex: Position,
  triangle: Triangle
) => {
  for (let i = 0; i < triangle.length; i++) {
    const currentVertex = triangle[i];
    const result = isPositionEqual(currentVertex, vertex);
    if (result) {
      return true;
    }
  }
  return false;
};

const isEdgeIncludedInTriangle = (edge: Edge, triangle: Triangle) => {
  for (let i = 0; i < edge.length; i++) {
    const currentVertex = edge[i];
    const result = isVertexIncludedInTriangle(currentVertex, triangle);
    if (!result) {
      return false;
    }
  }
  return true;
};

export const searchTriangleWithEdge = (
  triangleList: Triangle[],
  edge: Edge
) => {
  const triangleStack: TriangleStack = [];
  for (let i = 0; i < triangleList.length; i++) {
    const currentTriangle = triangleList[i];
    const result = isEdgeIncludedInTriangle(edge, currentTriangle);
    if (result) {
      triangleStack.push([i, currentTriangle]);
    }
  }

  return triangleStack;
};
