"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  title: string;
  image: string;
  tag: string;
  university: string;
}

interface TeacherCardProps {
  teacher: Teacher;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
}

export function ThreeDTeacherCard({
  teacher,
  isSelected,
  onClick,
  onMouseEnter,
}: TeacherCardProps) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`group relative cursor-pointer transition-all duration-300 ease-out select-none ${
        isSelected ? "scale-[1.03] z-20" : "hover:scale-[1.02] z-10 opacity-95 hover:opacity-100"
      }`}
    >
      {/* Outer Card Frame */}
      <div
        className={`relative w-full rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
          isSelected
            ? "bg-gradient-to-b from-rose-50/90 via-pink-50/40 to-white border-2 border-rose-400 shadow-xl shadow-rose-200/70"
            : "bg-white border border-rose-100 shadow-sm hover:shadow-lg hover:border-rose-300"
        }`}
      >
        {/* 1. TOP HEADER: Tag Badge, Teacher Name & Title (ALWAYS AT TOP, NEVER COVERED) */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 text-xs font-extrabold rounded-full transition-colors ${
                isSelected
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-100/90 text-rose-700 group-hover:bg-rose-200/90"
              }`}
            >
              {teacher.tag}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-rose-600 transition-colors leading-tight">
            {teacher.name}
          </h3>
          <p className="text-xs font-bold text-rose-500">
            {teacher.title}
          </p>
          <p className="text-xs text-gray-500 font-medium line-clamp-1">
            🎓 {teacher.university}
          </p>
        </div>

        {/* 2. LOWER HALF: 3D Pop-Out Cutout Image Frame */}
        <div className="relative w-full h-56 rounded-2xl bg-gradient-to-b from-rose-100/60 via-rose-50/40 to-rose-100/20 border border-rose-100/80 flex items-end justify-center overflow-visible mt-2">
          {/* Image Cutout */}
          <div className="relative w-48 h-60 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-4">
            <Image
              src={teacher.image}
              alt={teacher.name}
              fill
              className="object-contain object-bottom drop-shadow-[0_10px_15px_rgba(244,114,182,0.3)] group-hover:drop-shadow-[0_20px_25px_rgba(244,114,182,0.5)] transition-all duration-300"
              sizes="200px"
              priority
            />
          </div>
        </div>

        {/* 3. BOTTOM CTA hint */}
        <div className="mt-4 pt-3 border-t border-rose-100/80 flex items-center justify-center text-xs font-bold text-rose-600 gap-1 group-hover:underline">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Xem Hồ Sơ Giảng Viên</span>
        </div>
      </div>
    </div>
  );
}
