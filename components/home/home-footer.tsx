"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Sparkles, Facebook, Youtube, Globe, Heart } from "lucide-react";

export function HomeFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 fill-white/20 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                PTE <span className="text-rose-400">Talents</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-sm">
              {t.footer.desc}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-rose-400 hover:border-rose-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-rose-400 hover:border-rose-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://ptetalents.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-rose-400 hover:border-rose-500 transition-colors"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              {t.footer.aboutTitle}
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <a href="#features" className="hover:text-rose-400 transition-colors">
                  PTE Academic
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-rose-400 transition-colors">
                  PTE Core
                </a>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-rose-400 transition-colors">
                  {t.nav.pricing}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              {t.footer.skillsTitle}
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/pte/academic/practice" className="hover:text-rose-400 transition-colors">
                  PTE Speaking
                </Link>
              </li>
              <li>
                <Link href="/pte/academic/practice" className="hover:text-rose-400 transition-colors">
                  PTE Writing
                </Link>
              </li>
              <li>
                <Link href="/pte/academic/practice" className="hover:text-rose-400 transition-colors">
                  PTE Reading
                </Link>
              </li>
              <li>
                <Link href="/pte/academic/practice" className="hover:text-rose-400 transition-colors">
                  PTE Listening
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              {t.footer.legalTitle}
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/legal/privacy" className="hover:text-rose-400 transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-rose-400 transition-colors">
                  {t.footer.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 PTE Talents. {t.footer.rights}</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for PTE test takers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
