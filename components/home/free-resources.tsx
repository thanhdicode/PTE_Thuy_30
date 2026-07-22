"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";

export function FreeResources() {
  return (
    <section id="resources" className="py-16 sm:py-20 bg-white border-b border-rose-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large Rounded Soft Pastel Pink Container */}
        <div className="bg-[#FFF0F5] rounded-[2.5rem] p-8 sm:p-12 lg:p-14 shadow-sm border border-rose-200/70">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column (7 cols): Header + Card 1 (Large Main Resource Card) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              {/* Header Text Area */}
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
                  Tài liệu luyện thi PTE miễn phí
                </h2>
                <p className="text-gray-700 font-medium text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mb-5">
                  Tải ngay các tài liệu và bí kíp ôn tập được biên soạn bởi đội ngũ chuyên gia PTE.
                </p>
                <div>
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 text-white font-bold text-xs sm:text-sm hover:bg-rose-700 shadow-md transition-colors"
                  >
                    <span>Tải ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 1: Large Main Resource Card */}
              <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg group border border-rose-200/50">
                <Image
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop"
                  alt="Tổng quan và Hướng dẫn chấm điểm PTE"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 700px"
                />

                {/* Top-Left Download Badge (Pastel Rose Accent) */}
                <div className="absolute top-5 left-5 z-10">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <span>Tải xuống</span>
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>

                {/* Dark Gradient Overlay at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-transparent flex items-end p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    Tổng quan và Hướng dẫn chấm điểm PTE
                  </h3>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Card 2 (Top Right) + Card 3 (Bottom Right) */}
            <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 justify-between">
              {/* Card 2: Top Right Resource Card */}
              <div className="relative w-full h-56 sm:h-64 rounded-3xl overflow-hidden shadow-lg group border border-rose-200/50">
                <Image
                  src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop"
                  alt="Danh sách kiểm tra chiến lược ngày thi"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />

                {/* Top-Left Download Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <span>Tải xuống</span>
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>

                {/* Dark Gradient Overlay at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-transparent flex items-end p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                    Danh sách kiểm tra chiến lược ngày thi
                  </h3>
                </div>
              </div>

              {/* Card 3: Bottom Right Resource Card */}
              <div className="relative w-full h-56 sm:h-64 rounded-3xl overflow-hidden shadow-lg group border border-rose-200/50">
                <Image
                  src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop"
                  alt="Mẫu PTE thiết yếu"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />

                {/* Top-Left Download Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <span>Tải xuống</span>
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>

                {/* Dark Gradient Overlay at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-transparent flex items-end p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                    Mẫu PTE thiết yếu
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
