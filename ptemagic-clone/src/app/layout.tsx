import type { Metadata } from "next";
import "./globals.css";
import { loadPartial } from "@/lib/partials";

export const metadata: Metadata = {
  title: "PTE Magic - Trung Tâm Luyện Thi PTE Cho Người Việt",
  description: "PTE Magic - Trung tâm luyện thi PTE Academic uy tín cho người Việt.",
};

const wpStyles = [
  "/css/flatsome.css",
  "/css/flatsome-shop.css",
  "/css/style.css",
  "/css/all.min.css",
  "/css/animate.min.css",
  "/css/swiper-bundle.min.css",
  "/css/flexslider.css",
  "/css/marquee.css",
  "/css/owl.carousel.min.css",
  "/css/owl.theme.default.min.css",
  "/css/jquery.fancybox.min.css",
  "/css/wpforms-full.min.css",
];

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

  return (
    <html lang="vi">
      <head>
        {wpStyles.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <script dangerouslySetInnerHTML={{ __html: lazyScript }} />
      </head>
      <body className="home page-template page page-id-9883 full-width light">
        <div
          className="site-header-wrapper"
          dangerouslySetInnerHTML={{ __html: headerHtml }}
        />
        <div id="wrapper">{children}</div>
        <div
          className="site-footer-wrapper"
          dangerouslySetInnerHTML={{ __html: footerHtml }}
        />
      </body>
    </html>
  );
}
