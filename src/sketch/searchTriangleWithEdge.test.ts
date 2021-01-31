import { isVertexIncludedInTriangle } from "./searchTriangleWithEdge";
import { Position } from "./types";

describe("isTrianglesRequiredFlipping", () => {
  it("a", () => {
    const p1: Position = [1, 2];

    const p2: Position = [1, 2];
    const result = isVertexIncludedInTriangle(p1, [p2]);
    expect(result).toBeTruthy();
  });

  it("b", () => {
    const p1: Position = [1, 2];

    const p2: Position = [1, 3];
    const result = isVertexIncludedInTriangle(p1, [p2]);
    expect(result).toBeFalsy();
  });
});
