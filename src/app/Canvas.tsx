import { useSearchParams } from "next/navigation";
import type { ImgHTMLAttributes } from "react";
import { useEffect, useState } from "react";
import { draw, getDrawOptions } from "./image-generator";

/* eslint-disable @next/next/no-img-element -- Native rendering preserves context-menu saving for the PNG blob. */
const Canvas = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [image, setImage] = useState<{
    src: string;
    params: string;
  } | null>(null);
  const [imageError, setImageError] = useState<{
    message: string;
    params: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    const canvas = document.createElement("canvas");
    canvas.height = 3120;
    canvas.width = 1440;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to create a canvas rendering context.");
    }

    draw(context, getDrawOptions(new URLSearchParams(searchParamsString)));
    canvas.toBlob((blob) => {
      if (cancelled) {
        return;
      }
      if (!blob) {
        setImageError({
          message: "Unable to export the generated image.",
          params: searchParamsString,
        });
        return;
      }

      objectUrl = URL.createObjectURL(blob);
      setImage({ src: objectUrl, params: searchParamsString });
    }, "image/png");

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [searchParamsString]);

  if (imageError?.params === searchParamsString) {
    return <p role="alert">{imageError.message}</p>;
  }

  if (image?.params !== searchParamsString) {
    return null;
  }

  return (
    <img
      src={image.src}
      alt="Generiertes Bild"
      height="3120"
      width="1440"
      {...props}
    />
  );
};

export default Canvas;
