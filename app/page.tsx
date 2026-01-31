"use client";

import dynamic from "next/dynamic";

const IDELayout = dynamic(() => import("@/components/IDELayout"), {
  ssr: false,
});

export default function Home() {
  return <IDELayout />;
}
