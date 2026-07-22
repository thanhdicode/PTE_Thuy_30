"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { Smartphone, Apple, Play } from "lucide-react";

export function MobileAppCta() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-pink-500 via-rose-400 to-pink-600 text-white relative overflow-hidden">
      {/* Glow shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
              <Smartphone className="w-4 h-4" />
              <span>Mobile App Available</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t.mobileApp.title}
            </h2>
            <p className="text-base sm:text-lg text-pink-100 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t.mobileApp.subtitle}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="https://apps.apple.com/au/app/pte-magic/id6451088443"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-white text-gray-900 font-bold flex items-center gap-3 hover:bg-pink-50 transition-colors shadow-md"
              >
                <Apple className="w-6 h-6 fill-current" />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-gray-500 leading-none">Download on</div>
                  <div className="text-sm font-extrabold">{t.mobileApp.appStore}</div>
                </div>
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=au.net.magicapp.pte.installer.android"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-gray-900 text-white font-bold flex items-center gap-3 hover:bg-gray-800 transition-colors shadow-md border border-white/20"
              >
                <Play className="w-6 h-6 fill-current" />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-gray-400 leading-none">GET IT ON</div>
                  <div className="text-sm font-extrabold">{t.mobileApp.googlePlay}</div>
                </div>
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="glass-pink-card p-8 rounded-3xl text-gray-900 max-w-md w-full shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">PTE Magic Mobile</h3>
              <p className="text-sm text-gray-600">
                Luyện tập Speaking, Listening, Reading, Writing tiện lợi với bộ đề thi thực tế được đồng bộ hóa tức thì trên di động.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
