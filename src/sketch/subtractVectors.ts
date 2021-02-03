export const subtractVectors = <T extends number[]>(v1: T, v2: T): T => {
  const n = v1.length;
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(v1[i] - v2[i]);
  }
  return result as T;
};
