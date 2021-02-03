import P5 from "p5";
import { Triangle } from "./sketch/types";

import { makeDelauneyTriangle } from "./sketch/makeDelauneyTriangle";
import { makeOuterTriangle } from "./sketch/makeOuterTriangle";

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const initialTriangle = makeOuterTriangle([0, 0], [canvasWidth, canvasHeight]);
const a = makeDelauneyTriangle(126, initialTriangle, canvasWidth, canvasHeight);
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
    const r = Math.random() * 150;
    const g = Math.random() * 150;
    const b = Math.random() * 150;
    p.strokeWeight(weight);
    p.stroke(r, g, b, 50);
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
