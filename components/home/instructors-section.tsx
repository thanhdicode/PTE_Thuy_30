"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { ThreeDTeacherCard } from "./3d-teacher-card";
import {
  GraduationCap,
  Briefcase,
  Trophy,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
} from "lucide-react";

export function InstructorsSection() {
  const { t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  const teachers = [
    {
      id: "thuy-nguyen",
      name: "Master Thủy Nguyễn",
      title: "Trưởng Ban Chuyên Môn PTE 89+",
      image: "/images/teachers/teacher1.png",
      tag: "Founder & Head Academic",
      university: "Cử nhân Ngôn ngữ Anh & Thạc sĩ TESOL - Monash University (Australia)",
      experience: "8+ năm giảng dạy & biên soạn giáo án PTE Academic & Core chuyên sâu.",
      achievements: [
        "Đã đào tạo trực tiếp 1.500+ học viên đạt Target PTE 65+ & 79+.",
        "Tác giả bộ Template Speaking 89+ độc quyền với tỷ lệ trúng tủ 95%.",
        "Cố vấn chiến lược cho hệ thống AI chấm điểm khẩu hình phát âm.",
      ],
      syllabus: "Bộ Template Speaking Fluency & Chiến thuật xử lý Read Aloud / RS 79+",
      quote:
        "Bản chất của PTE không phải là học vẹt, mà là nắm chắc thuật toán chấm điểm và áp dụng đúng nhịp điệu phát âm chuẩn Pearson.",
    },
    {
      id: "nhat-nghia",
      name: "Mr. Phạm Nhật Nghĩa",
      title: "Trưởng Phòng Nghiên Cứu Thuật Toán AI & Giáo Án",
      image: "/images/teachers/teacher2.png",
      tag: "PTE 86 Overall & AI Lead",
      university: "Kỹ sư Khoa Học Máy Tính - ĐH Bách Khoa TP.HCM",
      experience: "6+ năm phân tích ma trận dữ liệu bài thi Pearson và lập trình AI chấm điểm.",
      achievements: [
        "Xây dựng hệ thống AI chấm điểm tự động đạt độ chính xác 98% phòng thi.",
        "Phân tích thuật toán đếm từ và ngắt nghỉ tự động cho bài thi Speaking & Writing.",
        "Hướng dẫn hơn 900+ học viên vượt mốc Target 50+ và 65+ cấp tốc.",
      ],
      syllabus: "Hệ thống bài test mô phỏng phòng thi & Bảng thuật toán chấm điểm AI",
      quote:
        "Học PTE cùng công nghệ AI giúp bạn biết chính xác mình sai ở đâu ngay lập tức, tiết kiệm 80% thời gian luyện tập.",
    },
    {
      id: "khanh-linh",
      name: "Ms. Khánh Linh",
      title: "Chuyên Gia Huấn Luyện Phát Âm & Speaking",
      image: "/images/teachers/teacher3.png",
      tag: "Master Speaking Specialist",
      university: "Cử nhân Sư Phạm Tiếng Anh - ĐH Quốc Gia Hà Nội",
      experience: "5+ năm huấn luyện âm điệu, nối âm & phản xạ Nói tự nhiên.",
      achievements: [
        "Đã hỗ trợ 800+ học viên mất gốc lấy lại nền tảng phát âm và đạt PTE 65+.",
        "Xây dựng phương pháp ngắt nhịp thở chuẩn giúp duy trì điểm Fluency tối đa.",
        "Biên soạn kho bài luyện phát âm theo từng vùng miền accent.",
      ],
      syllabus: "Lộ trình sửa phát âm chi tiết & Kỹ thuật lấy hơi chuẩn Pearson",
      quote:
        "Chỉ cần nắm đúng 3 quy tắc ngắt câu và giữ đều tốc độ, điểm Speaking 65+ nằm hoàn toàn trong tầm tay bạn.",
    },
    {
      id: "hoang-nam",
      name: "Mr. Hoàng Nam",
      title: "Senior Writing & Reading Strategist",
      image: "/images/teachers/teacher4.png",
      tag: "PTE 88 Overall & Master Writing",
      university: "Thạc sĩ Ngôn Ngữ Học Ứng Dụng - ĐH RMIT Vietnam",
      experience: "7+ năm nghiên cứu cấu trúc ngữ pháp và từ vựng thuật toán PTE.",
      achievements: [
        "Biên soạn bộ 2.000+ câu hỏi trúng tủ Summarize Written Text & Write From Dictation.",
        "Giúp 1.200+ học viên đạt điểm tối đa kỹ năng Writing & Reading.",
        "Tác giả cuốn cẩm nang chiến thuật làm bài Fill in the Blanks trúng tủ.",
      ],
      syllabus: "Bộ đề trúng tủ WFD & Cấu trúc ngữ pháp chuẩn Summarize Text",
      quote:
        "Tập trung đúng vào các dạng bài chiếm 70% tổng số điểm là con đường ngắn nhất để đỗ PTE ngay lần thi đầu tiên.",
    },
  ];

  // Auto rotate selected teacher every 6s unless hovered/paused
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % teachers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay, teachers.length]);

  const activeTeacher = teachers[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? teachers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === teachers.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = (idx: number) => {
    setActiveIdx(idx);
    detailPanelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="instructors"
      className="py-20 bg-gradient-to-b from-white via-rose-50/40 to-white relative overflow-hidden border-b border-rose-100/60"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Background Soft Pink Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-soft-pink-pill text-xs font-bold tracking-wide shadow-xs">
            <Award className="w-3.5 h-3.5 text-rose-500" />
            <span>ĐỘI NGŨ CHUYÊN GIA BIÊN SOẠN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Bộ Giáo Án Được Biên Soạn Bởi Giảng Viên Bề Dày Kinh Nghiệm
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
            Rút ngắn 80% thời gian ôn luyện nhờ lộ trình bài giảng & bộ template trúng tủ do các thầy cô giàu kinh nghiệm trực tiếp biên soạn.
          </p>
        </div>

        {/* Top 4 Teachers 3D Pop-Out Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {teachers.map((teacher, idx) => (
            <ThreeDTeacherCard
              key={teacher.id}
              teacher={teacher}
              isSelected={activeIdx === idx}
              onClick={() => handleCardClick(idx)}
              onMouseEnter={() => setActiveIdx(idx)}
            />
          ))}
        </div>

        {/* Active Instructor Detail Bio Panel */}
        <div
          ref={detailPanelRef}
          className="bg-white rounded-3xl border-2 border-rose-200/90 shadow-xl shadow-rose-100/70 p-6 md:p-10 relative overflow-hidden transition-all duration-300 scroll-mt-24"
        >
          {/* Top Decorative Header & Carousel Navigation Controls */}
          <div className="flex items-center justify-between pb-6 border-b border-rose-100 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 font-extrabold text-base">
                0{activeIdx + 1}
              </div>
              <span className="text-xs font-extrabold text-rose-500 uppercase tracking-wider">
                Hồ Sơ Giảng Viên Chi Tiết
              </span>
            </div>

            {/* Slider Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors"
                aria-label="Previous teacher"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-gray-500 px-2">
                {activeIdx + 1} / {teachers.length}
              </span>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors"
                aria-label="Next teacher"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Grid Layout: Left Column (Portrait) + Right Column (Info & Credentials) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (5 cols): Uniform Portrait Frame & Quote */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-b from-rose-100/70 via-rose-50/40 to-white border border-rose-200 p-4 flex items-end justify-center overflow-hidden shadow-inner">
                <Image
                  src={activeTeacher.image}
                  alt={activeTeacher.name}
                  fill
                  className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(244,114,182,0.35)] transition-all duration-300 p-2"
                  priority
                />
              </div>
              <p className="mt-4 text-xs sm:text-sm font-medium text-gray-600 italic text-center max-w-sm px-2">
                &ldquo;{activeTeacher.quote}&rdquo;
              </p>
            </div>

            {/* Right Column (7 cols): Name, Title & Full Credentials (NEVER OVERLAPPED) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Name & Title Header */}
              <div className="border-b border-rose-100 pb-4">
                <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-rose-100 text-rose-700 inline-block mb-2">
                  {activeTeacher.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                  {activeTeacher.name}
                </h3>
                <p className="text-sm font-bold text-rose-500 mt-1">
                  {activeTeacher.title}
                </p>
              </div>

              {/* University & Degree */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Học Vấn & Bằng Cấp
                  </h4>
                  <p className="text-base font-bold text-gray-900 mt-0.5">
                    {activeTeacher.university}
                  </p>
                </div>
              </div>

              {/* Teaching Experience */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Kinh Nghiệm Giảng Dạy & Chuyên Môn
                  </h4>
                  <p className="text-sm sm:text-base font-semibold text-gray-800 mt-0.5">
                    {activeTeacher.experience}
                  </p>
                </div>
              </div>

              {/* Key Achievements List */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Thành Tích & Năng Lực Đào Tạo
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm font-medium text-gray-700">
                    {activeTeacher.achievements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Syllabus Responsibility */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Bộ Giáo Án Trực Tiếp Biên Soạn
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-rose-600 mt-0.5">
                    {activeTeacher.syllabus}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/sign-up"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full btn-pastel-pink text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
                >
                  <span>Đăng Ký Học Cùng {activeTeacher.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pte/academic/practice"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full btn-pastel-pink-outline text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tải Bộ Giáo Án Miễn Phí</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
