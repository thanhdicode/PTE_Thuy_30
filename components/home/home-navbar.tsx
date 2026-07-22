"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

export function HomeNavbar() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled ? "pt-3 px-4 sm:px-6 lg:px-8" : "pt-0 px-0"
      }`}
    >
      <div
        className={`mx-auto transition-all duration-500 ease-in-out ${
          scrolled
            ? "max-w-6xl bg-white/95 backdrop-blur-xl border border-rose-200/80 shadow-2xl rounded-full py-2.5 px-6 sm:px-8"
            : "w-full bg-white/90 backdrop-blur-md border-b border-rose-100/60 shadow-xs py-4.5 px-6 sm:px-12"
        } flex items-center justify-between whitespace-nowrap`}
      >
        {/* Brand Logo - PTE Talents */}
        <Link href="/" className="flex items-center gap-3 group shrink-0 select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-200 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 fill-white/20 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-gray-900 leading-none">
              PTE <span className="text-rose-500">Talents</span>
            </span>
            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mt-0.5">
              Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-gray-800">
          <a href="#features" className="hover:text-rose-600 transition-colors py-1 whitespace-nowrap">
            Tính năng
          </a>
          <Link href="/pte/academic/practice" className="hover:text-rose-600 transition-colors py-1 whitespace-nowrap">
            Kho đề thi
          </Link>
          <Link href="/pte/mock-tests" className="hover:text-rose-600 transition-colors py-1 whitespace-nowrap">
            Thi thử AI
          </Link>
          <Link href="/pricing" className="hover:text-rose-600 transition-colors py-1 whitespace-nowrap">
            Gói học
          </Link>
          <a href="#testimonials" className="hover:text-rose-600 transition-colors py-1 whitespace-nowrap">
            Học viên
          </a>
          <a href="#faq" className="hover:text-rose-600 transition-colors py-1 whitespace-nowrap">
            Hỏi đáp
          </a>
        </nav>

        {/* Right Actions & Language Switcher */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          {/* Language Switcher Button (VI / EN) */}
          <div className="flex items-center bg-rose-50/90 p-0.5 rounded-full border border-rose-200/80">
            <button
              onClick={() => setLanguage("vi")}
              className={`px-3 py-1 text-xs font-extrabold rounded-full transition-all ${
                language === "vi"
                  ? "bg-white text-rose-600 shadow-xs"
                  : "text-gray-500 hover:text-rose-600"
              }`}
              aria-label="Tiếng Việt"
            >
              VI
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 text-xs font-extrabold rounded-full transition-all ${
                language === "en"
                  ? "bg-white text-rose-600 shadow-xs"
                  : "text-gray-500 hover:text-rose-600"
              }`}
              aria-label="English"
            >
              EN
            </button>
          </div>

          {/* Auth Buttons */}
          <Link
            href="/sign-in"
            className="px-3 py-1.5 text-sm font-bold text-gray-800 hover:text-rose-600 transition-colors whitespace-nowrap"
          >
            Đăng nhập
          </Link>
          <Link
            href="/sign-up"
            className="px-4.5 py-2.5 text-sm font-extrabold rounded-full btn-pastel-pink transition-all flex items-center gap-1.5 shadow-md hover:shadow-rose-300 whitespace-nowrap"
          >
            <span>Học Thử Miễn Phí</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-gray-800 hover:text-rose-600 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden mx-4 mt-2 border border-rose-100 bg-white/95 backdrop-blur-xl rounded-2xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Ngôn ngữ</span>
            <div className="flex items-center gap-1 bg-rose-50 p-0.5 rounded-full border border-rose-200">
              <button
                onClick={() => setLanguage("vi")}
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  language === "vi" ? "bg-white text-rose-600 shadow-xs" : "text-gray-500"
                }`}
              >
                VI
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  language === "en" ? "bg-white text-rose-600 shadow-xs" : "text-gray-500"
                }`}
              >
                EN
              </button>
            </div>
          </div>
          <nav className="flex flex-col space-y-2 font-bold text-sm text-gray-800">
            <a href="#features" onClick={() => setMobileOpen(false)} className="hover:text-rose-600 py-1">
              Tính năng
            </a>
            <Link href="/pte/academic/practice" onClick={() => setMobileOpen(false)} className="hover:text-rose-600 py-1">
              Kho đề thi
            </Link>
            <Link href="/pte/mock-tests" onClick={() => setMobileOpen(false)} className="hover:text-rose-600 py-1">
              Thi thử AI
            </Link>
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="hover:text-rose-600 py-1">
              Gói học
            </Link>
            <a href="#testimonials" onClick={() => setMobileOpen(false)} className="hover:text-rose-600 py-1">
              Học viên
            </a>
            <a href="#faq" onClick={() => setMobileOpen(false)} className="hover:text-rose-600 py-1">
              Hỏi đáp
            </a>
          </nav>
          <div className="pt-1 flex flex-col gap-2">
            <Link
              href="/sign-in"
              className="w-full text-center py-2 rounded-xl text-sm font-bold border border-rose-200 text-gray-800 hover:bg-rose-50"
            >
              Đăng nhập
            </Link>
            <Link
              href="/sign-up"
              className="w-full text-center py-2 rounded-xl text-sm font-bold btn-pastel-pink"
            >
              Học Thử Miễn Phí
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
