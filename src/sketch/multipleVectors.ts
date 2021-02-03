export const multipleVectors = <T extends number[]>(vec: T, n: number): T => {
  return vec.map((v) => v * n) as T;
};
