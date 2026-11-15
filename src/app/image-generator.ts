export type Pattern = "random" | "checkerboard" | "columns" | "rows";

export type DrawOptions = {
  alpha: string;
  beta: string;
  long: boolean;
  pattern: Pattern;
};

const isPattern = (value: string | null): value is Pattern =>
  value === "random" ||
  value === "checkerboard" ||
  value === "columns" ||
  value === "rows";

const randomColor = (): string =>
  `rgba(${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random() * 255)},92)`;

export const getDrawOptions = (params: URLSearchParams): DrawOptions => {
  const alpha = params.get("alpha");
  const beta = params.get("beta");
  const requestedPattern = params.get("pattern");
  const random = params.get("random") === "true";

  return {
    alpha: alpha ? `#${alpha}` : randomColor(),
    beta: beta ? `#${beta}` : randomColor(),
    long: params.get("long") === "true",
    pattern: random
      ? "random"
      : isPattern(requestedPattern)
        ? requestedPattern
        : "random",
  };
};

export const draw = (
  context: CanvasRenderingContext2D,
  options: DrawOptions,
): void => {
  const { height, width } = context.canvas;
  const tileHeight = options.long ? 240 : 120;
  let row = 0;

  for (let y = 0; y < height; y += tileHeight, row++) {
    let column = 0;
    for (let x = 0; x < width; x += 120, column++) {
      const useAlpha =
        options.pattern === "random"
          ? Math.random() > 0.5
          : options.pattern === "checkerboard"
            ? (row + column) % 2 === 0
            : options.pattern === "columns"
              ? column % 2 === 0
              : row % 2 === 0;

      context.fillStyle = useAlpha ? options.alpha : options.beta;
      context.fillRect(x, y, 120, tileHeight);
    }
  }
};
