import { afterEach, describe, expect, it, vi } from "vitest";
import { draw, getDrawOptions } from "./image-generator";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getDrawOptions", () => {
  it("reads custom colors, tile size, and a supported pattern", () => {
    expect(
      getDrawOptions(
        new URLSearchParams(
          "alpha=112233&beta=aabbcc&long=true&pattern=checkerboard",
        ),
      ),
    ).toEqual({
      alpha: "#112233",
      beta: "#aabbcc",
      long: true,
      pattern: "checkerboard",
    });
  });

  it("falls back to random for unsupported patterns and honors random=true", () => {
    expect(getDrawOptions(new URLSearchParams("pattern=invalid")).pattern).toBe(
      "random",
    );
    expect(
      getDrawOptions(new URLSearchParams("pattern=columns&random=true"))
        .pattern,
    ).toBe("random");
  });

  it("generates colors when none are specified", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    expect(getDrawOptions(new URLSearchParams())).toMatchObject({
      alpha: "rgba(128,128,128,92)",
      beta: "rgba(128,128,128,92)",
    });
  });
});

describe("draw", () => {
  const createContext = (width: number, height: number) => {
    const fills: Array<{ color: string; args: number[] }> = [];
    const context = {
      canvas: { width, height },
      fillStyle: "",
      fillRect: vi.fn(function (
        this: { fillStyle: string },
        ...args: number[]
      ) {
        fills.push({ color: this.fillStyle, args });
      }),
    } as unknown as CanvasRenderingContext2D;

    return { context, fills };
  };

  it("draws a checkerboard and covers the canvas without extra tiles", () => {
    const { context, fills } = createContext(240, 240);

    draw(context, {
      alpha: "#111111",
      beta: "#eeeeee",
      long: false,
      pattern: "checkerboard",
    });

    expect(fills).toEqual([
      { color: "#111111", args: [0, 0, 120, 120] },
      { color: "#eeeeee", args: [120, 0, 120, 120] },
      { color: "#eeeeee", args: [0, 120, 120, 120] },
      { color: "#111111", args: [120, 120, 120, 120] },
    ]);
  });

  it("uses the selected row or column pattern and taller tiles", () => {
    const { context, fills } = createContext(240, 480);

    draw(context, {
      alpha: "#111111",
      beta: "#eeeeee",
      long: true,
      pattern: "rows",
    });

    expect(fills).toHaveLength(4);
    expect(fills.map(({ color }) => color)).toEqual([
      "#111111",
      "#111111",
      "#eeeeee",
      "#eeeeee",
    ]);
    expect(fills[0].args).toEqual([0, 0, 120, 240]);
    expect(fills[2].args).toEqual([0, 240, 120, 240]);
  });

  it("uses alternating columns and random choices for their respective patterns", () => {
    const columnContext = createContext(240, 120);
    draw(columnContext.context, {
      alpha: "#111111",
      beta: "#eeeeee",
      long: false,
      pattern: "columns",
    });
    expect(columnContext.fills.map(({ color }) => color)).toEqual([
      "#111111",
      "#eeeeee",
    ]);

    vi.spyOn(Math, "random").mockReturnValueOnce(0.1).mockReturnValueOnce(0.9);
    const randomContext = createContext(240, 120);
    draw(randomContext.context, {
      alpha: "#111111",
      beta: "#eeeeee",
      long: false,
      pattern: "random",
    });
    expect(randomContext.fills.map(({ color }) => color)).toEqual([
      "#eeeeee",
      "#111111",
    ]);
  });
});
