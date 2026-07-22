import type { Metadata } from "next";
import "./globals.css";
import { loadPartial } from "@/lib/partials";

export const metadata: Metadata = {
  title: "PTE Magic - Trung Tâm Luyện Thi PTE Cho Người Việt",
  description: "PTE Magic - Trung tâm luyện thi PTE Academic uy tín cho người Việt.",
};

const lazyScript = `
(function(){
  function fix(){
    document.querySelectorAll('img[data-lazy-src], img[data-src]').forEach(function(img){
      var src = img.getAttribute('data-lazy-src') || img.getAttribute('data-src');
      if (src) { img.setAttribute('src', src); }
    });
    document.querySelectorAll('a[href^="https://ptemagic.com.vn/"]').forEach(function(a){
      a.href = a.href.replace('https://ptemagic.com.vn/', '/');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fix);
  else fix();
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerHtml = loadPartial("header");
  const footerHtml = loadPartial("footer");
  const stylesHtml = loadPartial("styles");
  const headScriptsHtml = loadPartial("head-scripts");
  const scriptsHtml = loadPartial("scripts");

  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <div style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: headScriptsHtml }} />
        <script dangerouslySetInnerHTML={{ __html: lazyScript }} />
      </head>
      <body className="home page-template page page-id-9883 full-width light">
        <div style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: stylesHtml }} />
        <div
          className="site-header-wrapper"
          dangerouslySetInnerHTML={{ __html: headerHtml }}
        />
        <div id="wrapper">{children}</div>
        <div
          className="site-footer-wrapper"
          dangerouslySetInnerHTML={{ __html: footerHtml }}
        />
        <div dangerouslySetInnerHTML={{ __html: scriptsHtml }} />
      </body>
    </html>
  );
}
