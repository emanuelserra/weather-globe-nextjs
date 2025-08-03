"use client";

import dynamic from "next/dynamic";

const EarthCanvas = dynamic(() => import("./components/EarthCanvas"), {
  ssr: false,
});

export default function EarthPage() {
  return (
    <div className="w-full h-screen bg-black">
      <EarthCanvas />
    </div>
  );
}
