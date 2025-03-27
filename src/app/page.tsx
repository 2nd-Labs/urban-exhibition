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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div
        className={`text-6xl text-stone-300 ${myFont.className} content-center`}
      >
        Urban Exhibition v0.1.0
      </div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <Suspense>
            <Canvas></Canvas>
          </Suspense>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
