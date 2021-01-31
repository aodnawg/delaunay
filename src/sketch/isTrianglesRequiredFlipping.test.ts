import { isTrianglesRequiredFlipping } from "./isTrianglesRequiredFlipping";
import { Triangle } from "./types";

describe("isTrianglesRequiredFlipping", () => {
  it("falsy", () => {
    const triangle1: Triangle = [
      [0, 0],
      [0, 10],
      [10, 0],
    ];

    const triangle2: Triangle = [
      [0, 10],
      [11, 11],
      [10, 0],
    ];
    const [subject, [t1, t2]] = isTrianglesRequiredFlipping(
      triangle1,
      triangle2
    );

    expect(subject).toBeFalsy();
    expect(t1).toEqual(triangle1);
    expect(t2).toEqual(triangle2);
  });

  it("truhy", () => {
    const triangle1: Triangle = [
      [0, 0],
      [0, 10],
      [10, 0],
    ];

    const triangle2: Triangle = [
      [0, 10],
      [5, 5],
      [10, 0],
    ];
    const [subject, [t1, t2]] = isTrianglesRequiredFlipping(
      triangle1,
      triangle2
    );

    expect(subject).toBeTruthy();
    expect(t1).toEqual([
      [0, 0],
      [5, 5],
      [0, 10],
    ]);
    expect(t2).toEqual([
      [0, 0],
      [5, 5],
      [10, 0],
    ]);
  });
});
