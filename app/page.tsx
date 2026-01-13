"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-amber-200 grid grid-cols-3 grid-rows-3 text-black">
      <div onClick={() => router.push('/sudoku')} className="bg-green-200 m-4 flex items-center justify-center rounded-2xl">
        Sudoku
      </div>
    </div>
  );
}
