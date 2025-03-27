import { useSearchParams } from "next/navigation";
import React, { useRef, useEffect } from "react";

const Canvas = (props: any) => {
  const searchParams = useSearchParams();

  const canvasRef = useRef(null);

  const randomColor = () => {
    return `rgba(${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random() * 255)},92)`;
  };

  const draw = (ctx: any) => {
    const height = ctx.canvas.height;
    const width = ctx.canvas.width;

    const randomColorAlpha = searchParams.get("alpha")
      ? `#${searchParams.get("alpha")}`
      : randomColor();
    const randomColorBeta = searchParams.get("beta")
      ? `#${searchParams.get("beta")}`
      : randomColor();

    for (let x = 0; x <= width; x += 120) {
      for (
        let y = 0;
        y <= height;
        y += (searchParams.get("long") === "true" ? 2 : 1) * 120
      ) {
        if (
          searchParams.get("random") === "true"
            ? Math.random() > 0.5
            : searchParams.get("eval")
              ? eval(searchParams.get("eval")!)
              : Math.random() > 0.5
        ) {
          ctx.fillStyle = randomColorAlpha;
        } else {
          ctx.fillStyle = randomColorBeta;
        }
        ctx.fillRect(
          x,
          y,
          120,
          (searchParams.get("long") === "true" ? 2 : 1) * 120,
        );
      }
    }
  };

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext("2d");

    draw(context);
  }, []);

  return <canvas ref={canvasRef} height="3120" width="1440" {...props} />;
};

export default Canvas;
