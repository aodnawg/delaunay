import P5 from "p5";
import { Triangle } from "./types";
import { isTrianglesRequiredFlipping } from "./isTrianglesRequiredFlipping";
import { makeCircumscribedCircle } from "./makeCircumscribedCircle";

const drawTriangle = (p: P5) => ([[x0, y0], [x1, y1], [x2, y2]]: Triangle) => {
  p.triangle(x0, y0, x1, y1, x2, y2);
};

export const isTrianglesRequiredFlippingTestDraw = (p: P5) => {
  const triangle1: Triangle = [
    [200, 100],
    [300, 200],
    [300, 100],
  ];

  const triangle2: Triangle = [
    [200, 100],
    [300, 200],
    [
      Math.sin(p.frameCount * 0.05) * 50 + 200,
      Math.cos(p.frameCount * 0.05) * 50 + 200,
    ],
  ];

  p.fill(200, 200, 250);
  drawTriangle(p)(triangle1);

  const [[cPx, cPy], cR] = makeCircumscribedCircle([
    [200, 100],
    [300, 200],
    [300, 100],
  ]);
  p.noFill();
  p.circle(cPx, cPy, Math.sqrt(cR) * 2);

  const [subject] = isTrianglesRequiredFlipping(triangle1, triangle2);
  if (subject) {
    p.fill(200, 250, 200, 90);
  } else {
    p.noFill();
  }

  drawTriangle(p)(triangle2);
};

export const isPointWithinTriangleTest = (p: P5) => (
  isPointWithinTriangle: any
) => {
  const target = p.createVector(200, 200);
  target.x += Math.sin(p.frameCount * 0.03) * 120;
  target.y += Math.cos(p.frameCount * 0.03) * 120;
  const triangle = [
    p.createVector(100, 100),
    p.createVector(200, 400),
    p.createVector(420, 130),
  ];
  const f = isPointWithinTriangle(target, triangle);
  f && p.fill(255, 100, 0, 77);
  // drawTriangle(p)(triangle);
  p.circle(target.x, target.y, 10);
  p.noFill();
};
