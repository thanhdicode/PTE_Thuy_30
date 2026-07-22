"use client";

import React from "react";
import { LanguageProvider } from "@/lib/language-context";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesGrid } from "@/components/home/features-grid";
import { TestimonialsMarquee } from "@/components/home/testimonials-marquee";
import { ScoreReportsCarousel } from "@/components/home/score-reports-carousel";
import { FreeResources } from "@/components/home/free-resources";
import { InstructorsSection } from "@/components/home/instructors-section";
import { FaqAccordion } from "@/components/home/faq-accordion";
import { HomeFooter } from "@/components/home/home-footer";

export default function HomePage() {
  return (
    <LanguageProvider>
      <div className="min-h-[100dvh] bg-white text-gray-900 font-sans selection:bg-rose-100 selection:text-rose-900">
        <HomeNavbar />
        <main>
          <HeroSection />
          <FeaturesGrid />
          <TestimonialsMarquee />
          <ScoreReportsCarousel />
          <FreeResources />
          <InstructorsSection />
          <FaqAccordion />
        </main>
        <HomeFooter />
      </div>
    </LanguageProvider>
  );
}
