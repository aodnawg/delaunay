import React, { useRef, useEffect } from "react";
import P5 from "p5";
import makeSketch from "./sketch2";

const sketch = makeSketch();

const Canvas: React.FC = () => {
  const p5Ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (p5Ref.current === null) {
      return;
    }
    const p5Instance = new P5(sketch, p5Ref.current);
    return () => p5Instance.remove();
  }, []);
  return <div className="w-full h-full" ref={p5Ref}></div>;
};

export default Canvas;
