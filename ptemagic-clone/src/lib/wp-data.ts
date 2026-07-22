import fs from "fs";
import path from "path";

const wpDir = path.join(process.cwd(), "src", "data", "wp");

export type WpItem = {
  id: number;
  type: "page" | "post";
  slug: string;
  link: string;
  title: string;
  excerpt: string;
  content: string;
  featured_media: number;
  segments: string[];
};

let manifestCache: { segments: string[]; file: string }[] | null = null;

export function loadManifest(): { segments: string[]; file: string }[] {
  if (manifestCache) return manifestCache;
  const raw = fs.readFileSync(path.join(wpDir, "manifest.json"), "utf-8");
  const parsed = JSON.parse(raw) as { segments: string[]; file: string }[];
  manifestCache = parsed;
  return parsed;
}

export function findItem(segments: string[] = []): WpItem | null {
  const manifest = loadManifest();
  const key = segments.join("/");
  const entry = manifest.find((m) => m.segments.join("/") === key);
  if (!entry) return null;
  const raw = fs.readFileSync(path.join(wpDir, entry.file), "utf-8");
  return JSON.parse(raw) as WpItem;
}

export function listStaticParams(): { slug: string[] }[] {
  const manifest = loadManifest();
  return manifest.map((m) => ({
    slug: m.segments,
  }));
}
