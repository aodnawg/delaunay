import P5 from "p5";
import { Triangle } from "./sketch/types";

import { makeDelauneyTriangle } from "./sketch/makeDelauneyTriangle";
import { makeOuterTriangle } from "./sketch/makeOuterTriangle";
import { subtractVectors } from "./sketch/subtractVectors";
import { multipleVectors } from "./sketch/multipleVectors";
import { addVectors } from "./sketch/addVectors";
import { range } from "ramda";

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const initialTriangle = makeOuterTriangle([0, 0], [canvasWidth, canvasHeight]);

const a = makeDelauneyTriangle(126, initialTriangle, canvasWidth, canvasHeight);
const b = a
  .filter((_, i) => i % 3 === 0)
  .map((t) => {
    return makeDelauneyTriangle(16, t);
  });

const getVectorMag = <T extends number[]>(vec: T): number => {
  const mag = Math.sqrt(vec.map((n) => n * n).reduce((a, c) => a + c, 0));
  return mag;
};

const drawTriangle = (p: P5) => (triangle: Triangle) => {
  const [[x0, y0], [x1, y1], [x2, y2]] = triangle;
  p.triangle(x0, y0, x1, y1, x2, y2);

  const v1 = subtractVectors(triangle[1], triangle[0]);
  const v2 = subtractVectors(triangle[2], triangle[0]);

  const m0 = getVectorMag(subtractVectors(triangle[1], triangle[2]));
  const m1 = getVectorMag(v1);
  const m2 = getVectorMag(v2);
  const d = m0 + m1 + m2;
  const s = m2 / d;
  const t = m1 / d;

  const center = addVectors(
    triangle[0],
    addVectors(multipleVectors(v1, s), multipleVectors(v2, t))
  );
  p.push();

  range(0, 62).map(() => {
    p.translate(center[0], center[1]);
    p.scale(1 - Math.random() * 0.6);

    p.translate(-center[0], -center[1]);

    p.triangle(x0, y0, x1, y1, x2, y2);
  });
  p.pop();
};

const makeSketch = () => (p: P5) => {
  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    a.forEach((t) => {
      // const r = Math.random() * 150;
      // const g = Math.random() * 150;
      // const b = Math.random() * 150;
      // p.stroke(r, g, b);
      p.strokeWeight(Math.random() * 2);

      drawTriangle(p)(t);
    });

    b.forEach((s) => {
      s.forEach((t) => {
        // const r = Math.random() * 150;
        // const g = Math.random() * 150;
        // const b = Math.random() * 150;
        // p.stroke(r, g, b);
        p.strokeWeight(Math.random());

        drawTriangle(p)(t);
      });
    });
  };
};

export default makeSketch;
