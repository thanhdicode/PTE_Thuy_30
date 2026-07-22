"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/50 via-[#FFF9FA] to-white pt-28 sm:pt-36 pb-16 border-b border-rose-100/60">
      {/* Background Soft Pastel Pink Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-pink-100/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Split Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">
          {/* Left Column (6 cols): Title, Subtitle, CTA Button */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.15]">
              Nền tảng luyện thi PTE hàng đầu chuẩn Pearson dành cho người Việt
            </h1>

            <p className="text-gray-600 font-medium text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
              Được tin tưởng bởi 400,000+ học viên từ 80+ quốc gia để chinh phục kỳ thi PTE Academic & Core.
            </p>

            <div className="pt-2">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gray-950 text-white font-extrabold text-sm sm:text-base hover:bg-rose-600 shadow-lg hover:shadow-rose-200 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Bắt đầu MIỄN PHÍ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column (6 cols): 3D Score Report Mockup Card */}
          <div className="lg:col-span-6">
            <div className="relative w-full max-w-lg mx-auto bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100/80 group hover:shadow-rose-100 transition-all duration-500">
              {/* Top Student Info & 84 Overall Badge */}
              <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                    HT
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900 leading-tight">Hoàng Tuấn</h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">Test Taker ID: PTE008769</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      MOCK TEST 14 - 3 SKILLS
                    </span>
                  </div>
                </div>

                {/* Overall Score Badge */}
                <div className="bg-amber-400 text-gray-950 font-black rounded-2xl px-4 py-2 text-center shadow-md border border-amber-300">
                  <span className="text-[10px] uppercase font-bold tracking-wider block text-gray-800">Overall Score</span>
                  <span className="text-2xl font-black block leading-none mt-0.5">84</span>
                </div>
              </div>

              {/* Communicative Skills Donut Rings */}
              <div className="py-5 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
                  Communicative Skills
                </span>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-base sm:text-lg font-extrabold text-emerald-600 block">78</span>
                    <span className="text-[10px] font-bold text-gray-500">Listening</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                    <span className="text-base sm:text-lg font-extrabold text-rose-600 block">90</span>
                    <span className="text-[10px] font-bold text-gray-500">Reading</span>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                    <span className="text-base sm:text-lg font-extrabold text-blue-600 block">77</span>
                    <span className="text-[10px] font-bold text-gray-500">Speaking</span>
                  </div>
                  <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-100">
                    <span className="text-base sm:text-lg font-extrabold text-cyan-600 block">90</span>
                    <span className="text-[10px] font-bold text-gray-500">Writing</span>
                  </div>
                </div>
              </div>

              {/* Skills Breakdown Progress Bars */}
              <div className="pt-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-700 font-bold mb-2">
                  <span>Skills Breakdown</span>
                  <span className="text-rose-600 font-extrabold">Verified Score</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-[11px] font-semibold text-gray-500">Writing</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full w-[90%]" />
                    </div>
                    <span className="w-6 text-right font-bold text-gray-700">90</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-[11px] font-semibold text-gray-500">Speaking</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[77%]" />
                    </div>
                    <span className="w-6 text-right font-bold text-gray-700">77</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-[11px] font-semibold text-gray-500">Reading</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full w-[90%]" />
                    </div>
                    <span className="w-6 text-right font-bold text-gray-700">90</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-[11px] font-semibold text-gray-500">Listening</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[78%]" />
                    </div>
                    <span className="w-6 text-right font-bold text-gray-700">78</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stat Floating Metrics Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto pt-4">
          <div className="p-6 rounded-2xl bg-white shadow-md border border-rose-100/60 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <span className="text-3xl sm:text-4xl font-black text-gray-900 block mb-1">400K+</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-600">Học viên đã luyện thi thành công</span>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-md border border-rose-100/60 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <span className="text-3xl sm:text-4xl font-black text-gray-900 block mb-1">60+</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-600">Quốc gia sử dụng</span>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-md border border-rose-100/60 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <span className="text-3xl sm:text-4xl font-black text-gray-900 block mb-1">200+</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-600">Đối tác tin cậy</span>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-md border border-rose-100/60 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <span className="text-3xl sm:text-4xl font-black text-gray-900 block mb-1">8K+</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-600">Đề thi thực hành</span>
          </div>
        </div>
      </div>
    </section>
  );
}
