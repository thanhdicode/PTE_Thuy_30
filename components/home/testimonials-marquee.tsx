"use client";

import React from "react";
import Image from "next/image";

interface Testimonial {
  name: string;
  target: string;
  avatar: string;
  comment: string;
}

export function TestimonialsMarquee() {
  const col1: Testimonial[] = [
    {
      name: "Thảo Nguyễn",
      target: "Target PTE 65",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      comment:
        "Lần đầu thi IELTS cũng như các test khác bao giờ và target của em là 65 all bands nên kết quả 81 overall này vượt xa cả mong đợi của em. PTE Talents có lộ trình luyện tập rõ ràng, đề thi sát thực tế, và đặc biệt phần feedback AI rất chi tiết.",
    },
    {
      name: "Tấn Thịnh",
      target: "Target PTE 30",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      comment:
        "Mục tiêu của mình là đạt đủ điểm để nộp hồ sơ Working Holiday Visa. Mình được bạn bè giới thiệu PTE Talents và thực sự bất ngờ vì lượng đề thi thật rất nhiều, lại có thể thử không giới hạn. Mình luyện thử nhiều lần, nên khi đi thi thật không còn cảm giác bỡ ngỡ và đã đạt Overall 40.",
    },
    {
      name: "Phương Quỳnh",
      target: "Target PTE 80",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      comment:
        "Khi chuyển sang PTE Talents platform, mình thấy tự tin vì có AI chấm chi tiết từng kỹ năng. 2 dạng bài mình thấy lo nhất là RS và WFD. Mock test nhiều lần giúp mình quen dần với áp lực thi và mình cũng may mắn trúng các câu trong bộ đề của Talents và đạt 89 overall.",
    },
    {
      name: "Đình Phúc",
      target: "Target PTE 50",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      comment:
        "Ban đầu mình rất sợ phần Speaking vì giọng hay bị giật cục. AI của PTE Talents đã phân tích chính xác tốc độ nói và lỗi phát âm từng từ, giúp mình tăng vọt từ 42 lên 64 điểm Speaking chỉ sau 3 tuần.",
    },
    {
      name: "Bích Ngọc",
      target: "Target PTE 65",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      comment:
        "Hệ thống kho đề thi tủ cập nhật hàng tuần cực kỳ đỉnh. Lần đi thi vừa rồi mình trúng tới 4 câu WFD và 2 câu RS, làm bài trôi chảy và nhận kết quả 78 overall vượt mong đợi!",
    },
    {
      name: "Thành Nam",
      target: "Target PTE 79+",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      comment:
        "Chiến thuật và các bộ template Speaking/Writing của PTE Talents thực sự đỉnh cao. Không cần từ vựng quá cao siêu nhưng đúng cấu trúc thuật toán Pearson là ăn trọn điểm.",
    },
  ];

  const col2: Testimonial[] = [
    {
      name: "Minh Tuyền",
      target: "Target PTE 65",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
      comment:
        "Lần đầu thi PTE, target của em là 65 all bands nên kết quả 81 overall này vượt xa mong đợi. PTE Talents có lộ trình luyện tập rõ ràng, đề thi sát thực tế, và đặc biệt phần feedback AI rất chi tiết.",
    },
    {
      name: "Ngọc Huyền",
      target: "Target PTE 30",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      comment:
        "Với 1 đứa chưa bao giờ chạm tiếng Anh như mình thì kết quả như này ngoài sức kỳ vọng của mình. Mình luyện thử các mock tests giống thi thật nhiều lần, nên khi đi thi thật không còn cảm giác bỡ ngỡ. Điểm số thi thật của mình gần như giống kết quả thi thử.",
    },
    {
      name: "Hoàng Hải",
      target: "Target PTE 79+",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      comment:
        "Trước khi thi thì mình làm 1 bài mocktest/tuần, tổng cộng 3 bài. Kết quả thi của mình rất đều, 74 - 75 hết. Nhưng khi thi xong thì cảm nhận của mình là những câu trong bài thi thật dễ hơn trong mocktest nhiều. Nhờ có platform Talents mà mình đạt 85 overall.",
    },
    {
      name: "Hải Yến",
      target: "Target PTE 65",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      comment:
        "Phần thi Reading từng là ác mộng của mình. Nhờ tính năng kéo thả Fill in the Blanks với giải thích đáp án cực kỳ chi tiết trên PTE Talents, mình đã tự tin chinh phục mốc 71 điểm Reading.",
    },
    {
      name: "Anh Khoa",
      target: "Target PTE 50",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      comment:
        "Giao diện đếm ngược đếm từ giống hệt phòng thi Pearson thật 100%. Luyện 5 bài thi thử trên hệ thống giúp mình kiểm soát thời gian hoàn hảo và đỗ nộp hồ sơ du học Úc.",
    },
    {
      name: "Tuyết Mai",
      target: "Target PTE 79+",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      comment:
        "Đội ngũ giảng viên và trợ lý AI của PTE Talents hỗ trợ giải đáp thắc mắc bài làm 24/7. Nhờ đó mình khắc phục ngay lỗi chính tả Writing và đạt 84 overall ngay lần đầu.",
    },
  ];

  const col3: Testimonial[] = [
    {
      name: "Vinh Dương",
      target: "Target PTE 30",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      comment:
        "Mình cần thi PTE rất gấp và hoàn toàn không có thời gian để chuẩn bị. PTE Talents có câu hỏi cập nhật liên tục, sát với đề thi, đặc biệt là phần Listening và Reading rất đa dạng. Mình đã tăng từ 59 điểm thành 72 điểm trong 3 ngày ôn luyện trên platform.",
    },
    {
      name: "Quyên Lê",
      target: "Target PTE 65",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      comment:
        "Bộ template chuẩn và tính năng ghi âm chấm điểm Speaking tức thì giúp mình vượt mục tiêu 65+ để hoàn thiện hồ sơ du học Úc.",
    },
    {
      name: "Trung Hiếu",
      target: "Target PTE 30",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      comment:
        "Sau khi dùng PTE Talents, mình thấy yên tâm hơn nhiều vì nền tảng có sẵn kho đề thi thật và các bài thi thử AI. Điểm số mô phỏng sát với thi thật, mỗi lần luyện xong đều có phân tích chi tiết điểm mạnh, điểm yếu.",
    },
    {
      name: "Gia Bảo",
      target: "Target PTE 79+",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      comment:
        "Lộ trình học cá nhân hóa được chia nhỏ theo ngày giúp mình không bị ngợp. Mỗi ngày dành 1 tiếng ôn luyện trên PTE Talents là đủ để bứt phá điểm số ấn tượng.",
    },
    {
      name: "Khánh Vân",
      target: "Target PTE 65",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      comment:
        "Tính năng chấm điểm phát âm ngắt nghỉ tự động của AI giúp mình nhận ra những thói quen sai lầm trước đây. Kết quả Speaking tăng 25 điểm thần kỳ!",
    },
    {
      name: "Hữu Đạt",
      target: "Target PTE 50",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      comment:
        "Giá cả hợp lý mà lượng đề thi và chất lượng AI chấm bài không khác gì phòng thi Pearson thật. Đã giới thiệu cho 3 đứa bạn cùng luyện và đều đỗ hết!",
    },
  ];

  const renderCard = (rev: Testimonial, idx: number) => (
    <div
      key={idx}
      className="bg-gray-50/80 hover:bg-white p-6 rounded-2xl border border-gray-100/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <span className="text-amber-400 font-serif text-4xl leading-none block mb-2 select-none">
          “
        </span>
        <p className="text-xs sm:text-sm text-gray-700 font-normal leading-relaxed mb-6">
          {rev.comment}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-rose-200 shadow-xs">
          <Image
            src={rev.avatar}
            alt={rev.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm leading-tight">
            {rev.name}
          </h4>
          <span className="text-xs font-medium text-gray-400">
            {rev.target}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section id="testimonials" className="py-20 bg-white overflow-hidden border-b border-rose-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Học viên nói gì về <span className="text-rose-600">PTE Talents</span>?
        </h2>
        <p className="text-base sm:text-lg text-gray-500 font-medium max-w-2xl mx-auto mt-3">
          Hàng ngàn học viên đã vượt qua mục tiêu du học & định cư nhờ lộ trình ôn luyện và công nghệ AI chuẩn xác.
        </p>
      </div>

      {/* Expanded & Taller 3 Columns Vertical Infinite Marquee Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative h-[820px] overflow-hidden">
        {/* Top & Bottom Gradient Mask Overlay */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 h-full">
          {/* Column 1: Vertical Up */}
          <div className="overflow-hidden relative h-full">
            <div className="animate-marquee-vertical-up space-y-6">
              {[...col1, ...col1].map((rev, idx) => renderCard(rev, idx))}
            </div>
          </div>

          {/* Column 2: Vertical Down */}
          <div className="overflow-hidden relative h-full hidden sm:block">
            <div className="animate-marquee-vertical-down space-y-6">
              {[...col2, ...col2].map((rev, idx) => renderCard(rev, idx))}
            </div>
          </div>

          {/* Column 3: Vertical Up */}
          <div className="overflow-hidden relative h-full hidden md:block">
            <div className="animate-marquee-vertical-up space-y-6">
              {[...col3, ...col3].map((rev, idx) => renderCard(rev, idx))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
