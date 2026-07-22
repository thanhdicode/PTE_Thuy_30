"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { Quote, Star } from "lucide-react";

export function TestimonialsSlider() {
  const { t } = useLanguage();

  const reviews = [
    {
      name: "Thảo Nguyên",
      target: "Target PTE 65",
      score: "PTE Overall 68",
      comment: "PTE Magic có phần chấm điểm AI và feedback chi tiết giúp mình nhận ra lỗi chính tả, ngữ pháp và cách triển khai ý chưa hợp lý. Sau 2 tháng luyện tập liên tục với mock test, mình đạt 68 overall!",
    },
    {
      name: "Tấn Thịnh",
      target: "Target PTE 30",
      score: "PTE Overall 40",
      comment: "Mục tiêu của mình là đạt đủ điểm nộp hồ sơ Working Holiday Visa. Mình được bạn giới thiệu PTE Magic và bất ngờ vì lượng đề thi thật rất nhiều, thi thử không giới hạn giúp mình đạt 40 điểm.",
    },
    {
      name: "Phương Quỳnh",
      target: "Target PTE 80",
      score: "PTE Overall 89",
      comment: "Khi chuyển sang PTE Magic platform, mình thấy tự tin vì có AI chấm chi tiết từng kỹ năng. 2 dạng bài mình lo nhất là RS và WFD. Mock test trúng tủ nhiều câu giúp mình đạt 89 overall!",
    },
    {
      name: "Hoàng Hải",
      target: "Target PTE 80",
      score: "PTE Overall 85",
      comment: "Trước khi thi thì mình làm 1 bài mocktest/tuần. Kết quả thi thật của mình rất đều, 85 điểm. Nhờ có platform Magic mà mình tự tin vượt mục tiêu đề ra.",
    },
    {
      name: "Minh Tuyền",
      target: "Target PTE 65",
      score: "PTE Overall 81",
      comment: "Em chưa thi IELTS bao giờ và target 65 all bands nên kết quả 81 overall này vượt xa cả mong đợi. PTE Magic có lộ trình rõ ràng, đề thi sát thực tế, feedback AI rất chi tiết.",
    },
    {
      name: "Ngọc Huyền",
      target: "Target PTE 30",
      score: "PTE Overall 45",
      comment: "Với 1 đứa chưa bao giờ chạm tiếng anh như mình thì kết quả này ngoài sức kì vọng. Luyện thử mock tests giống thi thật nhiều lần nên đi thi không bị bỡ ngỡ.",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-pink-50/50 via-white to-pink-50/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 uppercase tracking-wider">
            Testimonials & Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t.testimonials.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* 3-Column Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="glass-pink-card p-6 md:p-8 rounded-3xl flex flex-col justify-between hover:shadow-lg hover:shadow-pink-200/50 transition-all duration-300"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-pink-300" />
                </div>

                <p className="text-sm text-gray-700 leading-relaxed italic mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author Info & Score Pill */}
              <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{rev.name}</h4>
                  <span className="text-xs font-medium text-pink-600">{rev.target}</span>
                </div>
                <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                  {rev.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
