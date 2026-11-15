"use client";

import Canvas from "./Canvas";
import localFont from "next/font/local";
import { Suspense } from "react";

const myFont = localFont({
  src: "./MonaspaceKrypton-SemiWideLight.woff",
  display: "swap",
});

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 px-4 py-8 font-[family-name:var(--font-geist-sans)] sm:gap-16 sm:px-8 sm:py-12">
      <div
        className={`text-center text-[clamp(2rem,8vw,3.75rem)] text-stone-300 ${myFont.className}`}
      >
        Urban Exhibition v0.3.0
      </div>
      <main className="w-full max-w-[1440px]">
        <div className="w-full">
          <Suspense>
            <Canvas className="block h-auto w-full" />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
