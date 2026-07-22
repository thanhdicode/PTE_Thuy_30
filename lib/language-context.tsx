"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "vi" | "en";

export interface Translations {
  nav: {
    features: string;
    practice: string;
    mockTest: string;
    pricing: string;
    blog: string;
    contact: string;
    signIn: string;
    getStarted: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    getStartedBtn: string;
    practiceFreeBtn: string;
    statStudents: string;
    statCountries: string;
    statAccuracy: string;
    statSupport: string;
    studentsLabel: string;
    countriesLabel: string;
    accuracyLabel: string;
    supportLabel: string;
  };
  features: {
    badge: string;
    title: string;
    subtitle: string;
    item1Title: string;
    item1Desc: string;
    item2Title: string;
    item2Desc: string;
    item3Title: string;
    item3Desc: string;
    item4Title: string;
    item4Desc: string;
  };
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
  };
  resources: {
    badge: string;
    title: string;
    subtitle: string;
    downloadBtn: string;
    res1Title: string;
    res2Title: string;
    res3Title: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
    q5: string;
    a5: string;
  };
  cta: {
    title: string;
    subtitle: string;
    btn: string;
  };
  footer: {
    desc: string;
    aboutTitle: string;
    skillsTitle: string;
    legalTitle: string;
    privacy: string;
    terms: string;
    rights: string;
  };
}

export const translations: Record<Language, Translations> = {
  vi: {
    nav: {
      features: "Tính năng",
      practice: "Kho đề thi",
      mockTest: "Thi thử AI",
      pricing: "Gói học",
      blog: "Kinh nghiệm PTE",
      contact: "Liên hệ",
      signIn: "Đăng nhập",
      getStarted: "Học Thử Miễn Phí",
    },
    hero: {
      badge: "NỀN TẢNG LUYỆN THI PTE TALENTS AI",
      title: "Chinh Phục Kỳ Thi PTE Academic & Core Dễ Dàng",
      subtitle: "Giải pháp luyện thi PTE trực tuyến chuyên nghiệp. Tự động hóa chấm điểm AI 4 kỹ năng Speaking, Writing, Reading, Listening với kết quả chuẩn xác 98%.",
      getStartedBtn: "Bắt Đầu Luyện Thi Ngay",
      practiceFreeBtn: "Khám Phá Đề Thi",
      statStudents: "10.000+",
      statCountries: "4 Kỹ Năng",
      statAccuracy: "98%",
      statSupport: "24/7",
      studentsLabel: "Bài luyện & Đề thi cập nhật",
      countriesLabel: "Speaking, Writing, Reading, Listening",
      accuracyLabel: "Chính xác so với thi thật",
      supportLabel: "Hỗ trợ & Hướng dẫn học tập",
    },
    features: {
      badge: "TÍNH NĂNG NỔI BẬT",
      title: "Giải Pháp Luyện Thi PTE Toàn Diện",
      subtitle: "Được thiết kế hiện đại giúp bạn rút ngắn 80% thời gian ôn luyện và đạt điểm mục tiêu trong thời gian ngắn nhất.",
      item1Title: "Kho Đề Luyện 4 Kỹ Năng 20+ Dạng Bài",
      item1Desc: "Hệ thống câu hỏi phong phú chuẩn PTE Academic & Core, tích hợp Web Audio API ghi âm Speaking, đếm từ đếm ngược Writing, kéo thả Reading.",
      item2Title: "AI Chấm Điểm Speaking & Writing Tức Thì",
      item2Desc: "Nhận kết quả chấm chi tiết từng tiêu chí: Phát âm (Pronunciation), Độ trôi chảy (Fluency), Ngữ pháp (Grammar), Từ vựng và Cấu trúc bài làm.",
      item3Title: "Phòng Thi Thử (Mock Test) Như Thi Thật",
      item3Desc: "Môi trường thi thử đồng bộ đếm ngược gian hàng Pearson, tự động nộp bài và phân tích điểm mạnh yếu để rèn luyện tâm lý vững vàng.",
      item4Title: "Biểu Đồ Tiến Độ & Phân Tích Điểm Yếu",
      item4Desc: "Bảng thống kê điểm số trực quan qua thời gian, gợi ý bài luyện cá nhân hóa theo từng lỗ hổng kỹ năng để bạn bứt phá điểm số.",
    },
    testimonials: {
      badge: "HỌC VIÊN THÀNH CÔNG",
      badgeText: "Cảm Nhận Thực Tế Từ Học Viên PTE Talents",
      title: "Học Viên Nói Gì Về PTE Talents?",
      subtitle: "Hàng ngàn học viên đã chinh phục được Target PTE 30, 50, 65, 79+ và hoàn thành mục tiêu du học, định cư Úc, New Zealand, Canada.",
    },
    resources: {
      badge: "TÀI LIỆU MIỄN PHÍ",
      title: "Bí Kíp & Bộ Template PTE Chuẩn",
      subtitle: "Tải ngay các tài liệu và bộ mẫu bài độc quyền được biên soạn bởi đội ngũ chuyên gia PTE Talents.",
      downloadBtn: "Tải Tài Liệu Miễn Phí",
      res1Title: "Bộ Template Speaking & Writing Chuẩn PTE 79+",
      res2Title: "Cẩm Nang Chiến Thuật Làm Bài & Quản Lý Thời Gian",
      res3Title: "Bộ Từ Vựng PTE Thiết Yếu Cập Nhật Mới Nhất",
    },
    faq: {
      badge: "HỎI ĐÁP",
      title: "Giải Đáp Thắc Mắc Thường Gặp",
      subtitle: "Mọi thông tin cần biết trước khi bắt đầu hành trình ôn luyện PTE tại PTE Talents.",
      q1: "PTE Talents hỗ trợ những kỹ năng nào?",
      a1: "PTE Talents hỗ trợ đầy đủ 4 kỹ năng Speaking, Writing, Reading và Listening với 20+ dạng bài đúng chuẩn Pearson.",
      q2: "Điểm chấm bằng AI trên PTE Talents có chính xác không?",
      a2: "Hệ thống AI áp dụng công nghệ Speech-to-Text & NLP tiên tiến nhất, cho độ chính xác đạt trên 98% so với giám khảo Pearson.",
      q3: "Tôi có được thi thử miễn phí không?",
      a3: "Có! Bạn có thể tạo tài khoản miễn phí và trải nghiệm ngay các bài tập luyện cùng bài thi thử mô phỏng.",
      q4: "Làm sao để thanh toán gia hạn gói học?",
      a4: "Hệ thống tích hợp thanh toán tự động qua VNPay, Momo, ZaloPay và Chuyển khoản ngân hàng kích hoạt ngay sau 5 giây.",
      q5: "PTE Academic và PTE Core khác nhau ra sao?",
      a5: "PTE Academic phục vụ du học & định cư chung, PTE Core dành riêng cho định cư Canada. Cả hai đều có sẵn trên PTE Talents.",
    },
    cta: {
      title: "Sẵn Sàng Chinh Phục Điểm PTE Mục Tiêu?",
      subtitle: "Đăng ký tài khoản luyện tập miễn phí ngay hôm nay để trải nghiệm công nghệ AI chấm điểm vượt trội.",
      btn: "Bắt Đầu Ngay (Miễn Phí)",
    },
    footer: {
      desc: "PTE Talents - Nền tảng luyện thi PTE trực tuyến chuyên nghiệp hàng đầu. Tự động hóa chấm điểm AI giúp bạn đạt điểm mục tiêu nhanh nhất.",
      aboutTitle: "Về PTE Talents",
      skillsTitle: "Luyện 4 Kỹ Năng",
      legalTitle: "Chính Sách & Điều Khoản",
      privacy: "Chính sách bảo mật",
      terms: "Điều khoản dịch vụ",
      rights: "Tất cả quyền được bảo lưu bởi PTE Talents.",
    },
  },
  en: {
    nav: {
      features: "Features",
      practice: "Practice Bank",
      mockTest: "AI Mock Test",
      pricing: "Pricing",
      blog: "PTE Guides",
      contact: "Contact",
      signIn: "Sign In",
      getStarted: "Try For Free",
    },
    hero: {
      badge: "PTE TALENTS AI PRACTICE PLATFORM",
      title: "Master PTE Academic & Core Exams Effortlessly",
      subtitle: "Professional online PTE preparation platform. Automated 98% accurate AI scoring for Speaking, Writing, Reading, & Listening.",
      getStartedBtn: "Start Practicing Now",
      practiceFreeBtn: "Explore Question Bank",
      statStudents: "10,000+",
      statCountries: "4 Skills",
      statAccuracy: "98%",
      statSupport: "24/7",
      studentsLabel: "Updated Practice & Tests",
      countriesLabel: "Speaking, Writing, Reading, Listening",
      accuracyLabel: "Real Exam AI Accuracy",
      supportLabel: "Dedicated Learning Support",
    },
    features: {
      badge: "PLATFORM FEATURES",
      title: "Comprehensive PTE Exam Preparation",
      subtitle: "Modernly designed to reduce 80% of preparation time and hit target scores faster.",
      item1Title: "20+ Question Types for 4 Skills",
      item1Desc: "Extensive question bank tailored for PTE Academic & Core with Web Audio recorder, word counter, and drag-and-drop Reading.",
      item2Title: "Instant AI Scoring for Speaking & Writing",
      item2Desc: "Instant feedback detailing Pronunciation, Fluency, Grammar, Vocabulary, and Essay Structure.",
      item3Title: "Realistic Mock Test Simulator",
      item3Desc: "Exam-matched timed condition with auto-submission and analytical scorecard for exam confidence.",
      item4Title: "Progress Tracker & Weakness Analysis",
      item4Desc: "Visual score history and personalized practice recommendations to target skill gaps.",
    },
    testimonials: {
      badge: "SUCCESSFUL STUDENTS",
      badgeText: "Real Success Stories from PTE Talents Takers",
      title: "What Students Say About PTE Talents",
      subtitle: "Thousands of students achieved PTE 30, 50, 65, 79+ for study abroad and migration goals.",
    },
    resources: {
      badge: "FREE RESOURCES",
      title: "PTE Expert Tips & Standard Templates",
      subtitle: "Download official preparation guides and templates created by PTE Talents experts.",
      downloadBtn: "Download Free Guide",
      res1Title: "PTE 79+ Speaking & Writing Templates",
      res2Title: "Exam Day Strategy & Time Management",
      res3Title: "Essential PTE Vocabulary List",
    },
    faq: {
      badge: "FAQ",
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know before starting your PTE journey with PTE Talents.",
      q1: "Which skills are covered on PTE Talents?",
      a1: "PTE Talents covers all 4 skills: Speaking, Writing, Reading, and Listening across 20+ question types.",
      q2: "How accurate is the AI scoring on PTE Talents?",
      a2: "Our AI engine achieves 98%+ scoring correlation with real Pearson exam evaluators.",
      q3: "Can I try practice tests for free?",
      a3: "Yes! You can register a free account and access sample practice questions and mock tests.",
      q4: "Which payment methods are supported?",
      a4: "Instant automated activation via VNPay, Momo, ZaloPay, and Direct Bank Transfer.",
      q5: "What is the difference between PTE Academic and PTE Core?",
      a5: "PTE Academic is for general study & migration, while PTE Core is for Canadian immigration.",
    },
    cta: {
      title: "Ready to Achieve Your Target PTE Score?",
      subtitle: "Create your free account today and experience AI-powered practice tools.",
      btn: "Get Started Now (Free)",
    },
    footer: {
      desc: "PTE Talents - Leading online PTE practice platform. AI automated scoring helping you reach your target score in minimum time.",
      aboutTitle: "About PTE Talents",
      skillsTitle: "4 PTE Skills",
      legalTitle: "Policies & Terms",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      rights: "All rights reserved by PTE Talents.",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi");

  useEffect(() => {
    const saved = localStorage.getItem("pte_language") as Language;
    if (saved === "vi" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("pte_language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
