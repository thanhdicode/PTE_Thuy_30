"use client";

import React from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-gray-900 font-sans selection:bg-pink-100 selection:text-rose-900">
      {children}
    </div>
  );
}