import P5 from "p5";
import { remove, concat, range, append } from "ramda";
import { getDistance } from "./sketch/getDistance";
import { Triangle, Position, Edge } from "./sketch/types";
import { isTrianglesRequiredFlipping } from "./sketch/isTrianglesRequiredFlipping";
import { searchTriangleWithEdge } from "./sketch/searchTriangleWithEdge";

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const multipleVectors = <T extends number[]>(vec: T, n: number): T => {
  return vec.map((v) => v * n) as T;
};

const makeVertexList = (
  num: number,
  width: number,
  height: number
): Position[] => {
  return range(0, num).map(() => {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const p: Position = [x, y];
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

const addVectors = <T extends number[]>(v1: T, v2: T): T => {
  const n = v1.length;
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(v1[i] + v2[i]);
  }
  return result as T;
};

const subtractVectors = <T extends number[]>(v1: T, v2: T): T => {
  const n = v1.length;
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(v1[i] - v2[i]);
  }
  return result as T;
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

const makeOuterTriangle = (p1: Position, p2: Position): Triangle => {
  const center = addVectors<Position>(
    p1,
    subtractVectors(p2, p1).map((n) => n * 0.5) as Position
  );
  const radius = Math.sqrt(getDistance(p2, center));
  const angles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];

  const outerTrianglePoints = angles.map((a) => {
    const vec: Position = [Math.sin(a), Math.cos(a)];
    const vecExtended = vec.map((n) => n * radius * 2) as Position;
    const point = addVectors(center, vecExtended);
    return point;
  }) as Triangle;
  return outerTrianglePoints;
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

const makeDelauneyTriangle = (num: number, initialTriangle?: Triangle) => {
  const outerTriangle =
    initialTriangle || makeOuterTriangle([0, 0], [canvasWidth, canvasHeight]);

  const vertexList = initialTriangle
    ? makeVertexListWithinTriangle(initialTriangle, num)
    : makeVertexList(num, canvasWidth, canvasHeight);

  let triangleList = [outerTriangle];
  vertexList.forEach((vertex) => {
    const updatedList = updateTriangleListWithVertex(triangleList, vertex);
    triangleList = updatedList;
  });

  return triangleList;
};

const a = makeDelauneyTriangle(40);
const b = a
  .filter((_, i) => i % 3 !== 0)
  .map((t) => {
    return makeDelauneyTriangle(16, t);
  });
const c = b.map((l) => {
  return l
    .filter((_, i) => i % 3 !== 0)
    .map((t) => {
      return makeDelauneyTriangle(64, t);
    })
    .flat();
});

const makeSketch = () => (p: P5) => {
  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    // p.fill(255, 60);
    p.noFill();
    p.strokeWeight(0.8);
  };

  const drawPickedTriangle = (list: Triangle[], weight: number) => {
    p.resetMatrix();

    p.translate(
      (p.noise(p.frameCount, 0) - 0.5) * 1,
      (p.noise(p.frameCount, 1) - 0.5) * 1
    );
    const randomIndex = Math.floor(Math.random() * list.length);
    const [[x0, y0], [x1, y1], [x2, y2]] = list[randomIndex];
    const r = Math.random() * 250;
    const g = Math.random() * 250;
    const b = Math.random() * 250;
    p.strokeWeight(weight);
    p.stroke(r, g, b, 10);
    p.triangle(x0, y0, x1, y1, x2, y2);
  };

  p.draw = () => {
    drawPickedTriangle(a, 0.05);

    b.forEach((l) => {
      drawPickedTriangle(l, 0.1);
    });
    c.forEach((l) => {
      drawPickedTriangle(l, 2);
    });
  };
};

export default makeSketch;
