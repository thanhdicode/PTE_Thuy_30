"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { InfiniteMarquee } from "./infinite-marquee";
import { X, ZoomIn, ArrowRight, Award } from "lucide-react";

interface ScoreReport {
  id: string;
  title: string;
  score: string;
  image: string;
  student: string;
}

export function ScoreReportsCarousel() {
  const [selectedImage, setSelectedImage] = useState<ScoreReport | null>(null);

  const scoreReports: ScoreReport[] = [
    {
      id: "report-1",
      title: "PTE Academic Pearson Score Report",
      score: "89 Overall",
      image: "/images/score-reports/result-quynh-score.png",
      student: "Phương Quỳnh - PTE 89",
    },
    {
      id: "report-2",
      title: "PTE Academic Pearson Score Report",
      score: "85 Overall",
      image: "/images/score-reports/result-thanhbinh.png",
      student: "Thanh Bình - PTE 85",
    },
    {
      id: "report-3",
      title: "PTE Academic Pearson Score Report",
      score: "79 Overall",
      image: "/images/score-reports/result-huutung.png",
      student: "Hữu Tùng - PTE 79",
    },
    {
      id: "report-4",
      title: "PTE Academic Pearson Score Report",
      score: "76 Overall",
      image: "/images/score-reports/result-zaykaiz-after.png",
      student: "Đăng Khoa - PTE 76",
    },
    {
      id: "report-5",
      title: "PTE Academic Pearson Score Report",
      score: "73 Overall",
      image: "/images/score-reports/feedback-giahung.png",
      student: "Gia Hùng - PTE 73",
    },
    {
      id: "report-6",
      title: "PTE Academic Pearson Score Report",
      score: "70 Overall",
      image: "/images/score-reports/result-tanphuong.jpg",
      student: "Tấn Phương - PTE 70",
    },
    {
      id: "report-7",
      title: "PTE Academic Pearson Score Report",
      score: "68 Overall",
      image: "/images/score-reports/result-vanthuyet-after.jpg",
      student: "Văn Thuyết - PTE 68",
    },
    {
      id: "report-8",
      title: "PTE Academic Pearson Score Report",
      score: "66 Overall",
      image: "/images/score-reports/feedback-pass460.png",
      student: "Hà Minh - PTE 66",
    },
    {
      id: "report-9",
      title: "PTE Academic Pearson Score Report",
      score: "65 Overall",
      image: "/images/score-reports/result-dinhngoc.jpg",
      student: "Đình Ngọc - PTE 65",
    },
  ];

  return (
    <section id="score-reports" className="py-20 bg-soft-pink-bg overflow-hidden border-b border-rose-100/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-soft-pink-pill text-xs font-bold tracking-wide shadow-xs mb-4">
          <Award className="w-3.5 h-3.5 text-rose-500" />
          <span>BẢNG ĐIỂM HỌC VIÊN THẬT</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Khám phá bảng điểm của học viên tại <span className="text-rose-600">PTE Talents</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto mt-3">
          Hàng ngàn chứng chỉ Pearson PTE Score Report điểm cao được cập nhật liên tục từ học viên chính thức.
        </p>
      </div>

      {/* Infinite Horizontal Marquee Carousel of Pearson Score Reports */}
      <InfiniteMarquee direction="left" className="py-4">
        {scoreReports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedImage(report)}
            className="group relative w-[220px] sm:w-[260px] md:w-[290px] aspect-[3/4] bg-white rounded-2xl p-2.5 border border-rose-100 shadow-sm hover:shadow-2xl hover:border-rose-300 hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Score Card Image Container */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={report.image}
                alt={report.student}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 240px, 300px"
              />
              
              {/* Hover Zoom Overlay */}
              <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-bold text-sm">
                <ZoomIn className="w-5 h-5 text-white" />
                <span>Xem Bảng Điểm</span>
              </div>
            </div>

            {/* Score Tag Badge */}
            <div className="absolute top-4 right-4 bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md">
              {report.score}
            </div>
          </div>
        ))}
      </InfiniteMarquee>

      {/* Bottom Center CTA "Xem Thêm" Button (100% matching sample design) */}
      <div className="mt-12 text-center">
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gray-950 text-white font-bold text-sm sm:text-base hover:bg-rose-600 shadow-lg hover:shadow-rose-200 transition-all duration-300 hover:-translate-y-0.5"
        >
          <span>Xem Thêm Bảng Điểm</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Lightbox Modal for Full Score Report View */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-rose-200 overflow-hidden max-h-[90dvh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  Pearson PTE Score Report
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  {selectedImage.student}
                </h3>
              </div>

              <button
                onClick={() => setSelectedImage(null)}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal High-Res Score Image */}
            <div className="relative w-full flex-1 min-h-[450px] sm:min-h-[550px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
              <Image
                src={selectedImage.image}
                alt={selectedImage.student}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>

            {/* Modal Bottom CTA */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-gray-500">
                ✅ Xác minh chứng chỉ thật trên hệ thống Pearson
              </span>
              <Link
                href="/sign-up"
                className="px-6 py-2.5 rounded-full btn-pastel-pink text-xs font-bold flex items-center gap-1.5"
              >
                <span>Chinh Phục Điểm Cao Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
