import fs from "fs";
import path from "path";

export function loadPartial(name: "header" | "footer" | "styles" | "scripts" | "head-scripts"): string {
  const filePath = path.join(process.cwd(), "public", "partials", `${name}.html`);
  const raw = fs.readFileSync(filePath, "utf-8");
  return preprocess(raw);
}

function preprocess(html: string): string {
  return (
    html
      // make all ptemagic.com.vn/ptemagic.com links relative
      .replace(/https?:\/\/(?:www\.)?ptemagic\.com\.vn\//g, "/")
      .replace(/https?:\/\/(?:www\.)?ptemagic\.com\//g, "/")
  );
}
