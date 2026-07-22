"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Search, Filter, Play, Award, Sparkles } from "lucide-react";

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 bg-amber-50/40 border-b border-rose-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Ôn luyện PTE nhanh - tiết kiệm - hiệu quả
          </h2>

          <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Khám phá những tính năng vượt trội của PTE Talents Platform, được thiết kế để giúp bạn luyện tập thông minh và đạt điểm mục tiêu trong thời gian ngắn nhất.
          </p>

          <div className="pt-2">
            <Link
              href="/sign-up"
              className="inline-block px-7 py-3 rounded-full bg-gray-950 text-white font-bold text-xs sm:text-sm hover:bg-rose-600 shadow-md transition-colors"
            >
              Đăng ký MIỄN PHÍ
            </Link>
          </div>
        </div>

        {/* 2x2 Bento Grid Asymmetric Layout (100% matching ptemagic.com reference screenshot UI) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
          {/* Card 1 (Top-Left: 7 cols - Emerald Green Card) */}
          <div className="lg:col-span-7 bg-[#10B981] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-snug">
                Ngân hàng đề thi phong phú cho PTE Academic và PTE Core
              </h3>
              <p className="text-emerald-100 font-medium text-xs sm:text-sm leading-relaxed mb-8">
                Kho đề thi đa dạng với hàng nghìn câu hỏi cập nhật sát với đề thi thực tế, giúp học viên làm quen với cấu trúc và độ khó của kỳ thi PTE.
              </p>
            </div>

            {/* Vector UI Mockup: Question Bank Table */}
            <div className="bg-white rounded-t-2xl p-4 sm:p-5 text-gray-800 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500 mt-auto">
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100 text-xs">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg flex-1">
                  <Search className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-400 font-medium">Search...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-medium flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    <span>Filter</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-bold">
                    Search
                  </span>
                </div>
              </div>

              {/* Table Rows */}
              <div className="space-y-2 text-xs font-medium">
                <div className="grid grid-cols-12 items-center p-2 rounded-lg bg-gray-50 text-gray-700">
                  <span className="col-span-3 font-bold text-gray-900">DI00001</span>
                  <span className="col-span-5 truncate text-gray-600">The Quantum Loop in Computing</span>
                  <span className="col-span-2 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px] w-fit">Easy</span>
                  <span className="col-span-2 text-right font-bold text-emerald-600">Score 89 ✓</span>
                </div>
                <div className="grid grid-cols-12 items-center p-2 rounded-lg bg-white border border-gray-100 text-gray-700">
                  <span className="col-span-3 font-bold text-gray-900">DI00002</span>
                  <span className="col-span-5 truncate text-gray-600">Bioluminescence: Nature&apos;s Living Light</span>
                  <span className="col-span-2 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 font-bold text-[10px] w-fit">Medium</span>
                  <span className="col-span-2 text-right font-bold text-emerald-600">Score 85 ✓</span>
                </div>
                <div className="grid grid-cols-12 items-center p-2 rounded-lg bg-gray-50 text-gray-700">
                  <span className="col-span-3 font-bold text-gray-900">DI00003</span>
                  <span className="col-span-5 truncate text-gray-600">The Future of Space Farming</span>
                  <span className="col-span-2 px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold text-[10px] w-fit">Hard</span>
                  <span className="col-span-2 text-right font-bold text-emerald-600">Score 79 ✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 (Top-Right: 5 cols - Ocean Cyan Card) */}
          <div className="lg:col-span-5 bg-[#06B6D4] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500">
            {/* Vector UI Mockup: AI Feedback Widget */}
            <div className="bg-white rounded-b-2xl p-4 sm:p-5 text-gray-800 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500 mb-8">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-100 text-xs">
                <span className="font-extrabold text-gray-900">Your Answer</span>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">Fluency 9/9</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-700 font-bold">Content 5/5</span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">Grammar 5/5</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-600 leading-relaxed font-mono bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                Homework has been a longstanding tradition in education...
                <span className="bg-emerald-200 text-emerald-900 font-bold px-1 rounded mx-0.5">[Fluency 9/9]</span>
                There is a growing debate about its efficacy. On one hand, advocates argue that homework helps students consolidate their understanding of academic subjects.
              </p>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-snug">
                Chấm điểm tức thì, phân tích chi tiết từng kỹ năng
              </h3>
              <p className="text-cyan-100 font-medium text-xs sm:text-sm leading-relaxed">
                Hệ thống AI hiện đại cung cấp kết quả chấm điểm ngay lập tức, kèm phân tích chuyên sâu cho Speaking và Writing, giúp bạn hiểu rõ điểm mạnh và điểm cần cải thiện.
              </p>
            </div>
          </div>

          {/* Card 3 (Bottom-Left: 5 cols - Royal Blue Card) */}
          <div className="lg:col-span-5 bg-[#3B82F6] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-snug">
                Thi thử 4 kỹ năng với trải nghiệm như phòng thi thật
              </h3>
              <p className="text-blue-100 font-medium text-xs sm:text-sm leading-relaxed mb-8">
                Thực hành đầy đủ các kỹ năng Nghe - Nói - Đọc - Viết trong môi trường thi thử được thiết kế sát thực tế, giúp học viên rèn luyện tâm lý và kỹ năng quản lý thời gian.
              </p>
            </div>

            {/* Vector UI Mockup: Sample Test Card */}
            <div className="bg-white rounded-t-2xl p-4 sm:p-5 text-gray-800 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500 mt-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    P
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">Sample Test 01</h4>
                    <span className="text-[10px] text-gray-400">Created by Academic Team</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Completed</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                  <span>Progress</span>
                  <span className="font-bold text-blue-600">100/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 (Bottom-Right: 7 cols - Coral Red/Orange Card) */}
          <div className="lg:col-span-7 bg-[#EF4444] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500">
            {/* Vector UI Mockup: Skills Breakdown & Score Donuts */}
            <div className="bg-white rounded-b-2xl p-4 sm:p-6 text-gray-800 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500 mb-8">
              {/* 4 Skill Donut Rings */}
              <div className="grid grid-cols-4 gap-3 text-center mb-5 pb-4 border-b border-gray-100">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-base font-extrabold text-emerald-600 block">80</span>
                  <span className="text-[10px] font-bold text-gray-500">Listening</span>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                  <span className="text-base font-extrabold text-rose-600 block">72</span>
                  <span className="text-[10px] font-bold text-gray-500">Reading</span>
                </div>
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                  <span className="text-base font-extrabold text-blue-600 block">80</span>
                  <span className="text-[10px] font-bold text-gray-500">Speaking</span>
                </div>
                <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-100">
                  <span className="text-base font-extrabold text-cyan-600 block">74</span>
                  <span className="text-[10px] font-bold text-gray-500">Writing</span>
                </div>
              </div>

              {/* Skills Breakdown Progress Bars */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-700 font-bold">
                  <span>Skills Breakdown</span>
                  <span className="text-rose-600 font-extrabold text-xs">77 Overall</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-[11px] font-medium text-gray-500">Writing</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full w-[74%]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-[11px] font-medium text-gray-500">Speaking</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[80%]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-[11px] font-medium text-gray-500">Reading</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full w-[72%]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-[11px] font-medium text-gray-500">Listening</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[80%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-snug">
                Bảng điểm phân tích chuyên sâu
              </h3>
              <p className="text-rose-100 font-medium text-xs sm:text-sm leading-relaxed">
                Bảng điểm PTE trực quan, dễ hiểu, thể hiện rõ tiến bộ qua từng giai đoạn ôn luyện và đưa ra gợi ý để cải thiện kết quả trong lần thi tiếp theo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
