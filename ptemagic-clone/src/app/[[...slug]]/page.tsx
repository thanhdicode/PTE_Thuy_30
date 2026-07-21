import { findItem, listStaticParams, WpItem } from "@/lib/wp-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  return listStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) return { title: "PTE Magic" };
  return {
    title: item.title,
    description: item.excerpt.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

export default async function WpPage({ params }: PageProps) {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) notFound();

  return (
    <main
      id="main"
      className="site-main"
      dangerouslySetInnerHTML={{ __html: sanitizeWpContent(item.content) }}
    />
  );
}

function sanitizeWpContent(html: string): string {
  return (
    html
      .replace(/<!DOCTYPE[^>]*>/gi, "")
      .replace(/<html[^>]*>/gi, "")
      .replace(/<\/html>/gi, "")
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
      .replace(/<body[^>]*>/gi, "")
      .replace(/<\/body>/gi, "")
      // make ptemagic URLs relative
      .replace(/https?:\/\/(?:www\.)?ptemagic\.com\.vn\//g, "/")
      .replace(/https?:\/\/(?:www\.)?ptemagic\.com\//g, "/")
  );
}
