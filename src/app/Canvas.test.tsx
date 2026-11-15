import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Canvas from "./Canvas";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

describe("Canvas", () => {
  const fillRect = vi.fn();
  const context = {
    canvas: { width: 1440, height: 3120 },
    fillStyle: "",
    fillRect,
  } as unknown as CanvasRenderingContext2D;

  beforeEach(() => {
    window.history.replaceState(
      {},
      "",
      "/?alpha=112233&beta=aabbcc&pattern=checkerboard",
    );
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      context,
    );
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
      (callback) => callback(new Blob(["png"], { type: "image/png" })),
    );
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:generated-image");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    fillRect.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("generates and displays a saveable PNG image", async () => {
    render(<Canvas className="generated-image" />);

    const image = await screen.findByRole("img", { name: "Generated Image" });

    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("src", "blob:generated-image");
    expect(image).toHaveAttribute("width", "1440");
    expect(image).toHaveAttribute("height", "3120");
    expect(image).toHaveClass("generated-image");
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/png",
    );
    expect(fillRect).toHaveBeenCalledTimes(312);
  });

  it("regenerates when URL options change and releases the previous image URL", async () => {
    vi.spyOn(URL, "createObjectURL")
      .mockReturnValueOnce("blob:first-image")
      .mockReturnValueOnce("blob:second-image");
    const view = render(<Canvas />);

    await screen.findByRole("img", { name: "Generated Image" });
    window.history.replaceState({}, "", "/?pattern=columns");

    await act(async () => {
      view.rerender(<Canvas />);
    });

    await waitFor(() => {
      expect(
        screen.getByRole("img", { name: "Generated Image" }),
      ).toHaveAttribute("src", "blob:second-image");
    });
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:first-image");
  });

  it("reports an image export failure", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
      (callback) => callback(null),
    );

    render(<Canvas />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to export the generated image.",
    );
  });
});
