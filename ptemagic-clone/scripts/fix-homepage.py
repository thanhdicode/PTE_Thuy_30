import json
import re
import ssl
import urllib.parse
import urllib.request
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
DATA = ROOT / "src" / "data" / "wp"
HOME_HTML = Path(r"C:\Users\Administrator\repos\PTE_Thuy_30\ptemagic_home.html")
DOMAIN = "ptemagic.com.vn"

def ctx():
    c = ssl.create_default_context()
    c.check_hostname = False
    c.verify_mode = ssl.CERT_NONE
    return c

def fetch(url: str) -> bytes | None:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, context=ctx(), timeout=30) as r:
            return r.read()
    except Exception as e:
        print("  fetch error", url, e)
        return None

def normalize_url(url: str, base: str = "https://ptemagic.com.vn/") -> str | None:
    url = url.strip()
    if url.startswith("data:") or url.startswith("#"):
        return None
    if url.startswith("//"):
        url = "https:" + url
    if url.startswith("/"):
        url = "https://ptemagic.com.vn" + url
    if not url.startswith("http"):
        url = urllib.parse.urljoin(base, url)
    parsed = urllib.parse.urlparse(url)
    host = parsed.netloc.replace("www.", "")
    if host != DOMAIN:
        return None
    return url

ASSET_EXTENSIONS = {
    ".webp", ".jpg", ".jpeg", ".png", ".gif", ".svg", ".ico", ".bmp",
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    ".css", ".js", ".json", ".xml", ".pdf", ".zip",
    ".mp3", ".mp4", ".webm", ".ogg", ".wav",
}

def is_asset_url(url: str) -> bool:
    parsed = urllib.parse.urlparse(url)
    path = parsed.path
    if path.endswith("/"):
        return False
    base = urllib.parse.unquote(urllib.parse.urlparse(path).path)
    ext = Path(base).suffix.lower()
    return ext in ASSET_EXTENSIONS

def try_fetch_with_fallbacks(url: str):
    for u in [url, urllib.parse.urlunparse(urllib.parse.urlparse(url)._replace(query=""))]:
        data = fetch(u)
        if data:
            return data, u
    parsed = urllib.parse.urlparse(url)
    path = parsed.path
    fallbacks = []
    if path.startswith("/themes/"):
        fallbacks.append(path.replace("/themes/", "/wp-content/themes/", 1))
    if path.startswith("/plugins/"):
        fallbacks.append(path.replace("/plugins/", "/wp-content/plugins/", 1))
    if path.startswith("/ml-slider/"):
        fallbacks.append(path.replace("/ml-slider/", "/wp-content/plugins/ml-slider/", 1))
    for fb in fallbacks:
        u = urllib.parse.urlunparse(parsed._replace(path=fb, query=""))
        data = fetch(u)
        if data:
            return data, u
    return None, url

def download_asset(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    path = parsed.path
    local_path = path[1:] if path.startswith("/") else path
    if not is_asset_url(url):
        return "/" + local_path if local_path else "/"
    dest = PUBLIC / local_path
    if dest.exists() and dest.is_dir():
        shutil.rmtree(dest)
    if dest.parent.exists() and dest.parent.is_file():
        dest.parent.unlink()
    if dest.exists():
        return "/" + local_path
    data, final_url = try_fetch_with_fallbacks(url)
    if data is None:
        # keep original absolute URL if asset cannot be fetched
        return url
    final_path = urllib.parse.urlparse(final_url).path
    final_path = final_path[1:] if final_path.startswith("/") else final_path
    dest = PUBLIC / final_path
    if dest.exists() and dest.is_dir():
        shutil.rmtree(dest)
    if dest.parent.exists() and dest.parent.is_file():
        dest.parent.unlink()
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return "/" + final_path

def rewrite_text(text: str) -> str:
    pattern = r'https?://(?:www\.)?ptemagic\.com\.vn/[^\s"\'<>()\]\}]+'
    def repl(m: re.Match) -> str:
        return download_asset(m.group(0))
    return re.sub(pattern, repl, text)

def collect_styles(html: str):
    seen = set()
    out = []
    patterns = [
        r'<link[^>]+rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)',
        r'<link[^>]+href=["\']([^"\']+)[^>]+rel=["\']stylesheet["\']',
        r'<link[^>]+rel=["\']preload["\'][^>]+as=["\']style["\'][^>]+href=["\']([^"\']+)',
    ]
    for pat in patterns:
        for m in re.finditer(pat, html, re.IGNORECASE):
            href = m.group(1)
            n = normalize_url(href)
            if not n:
                continue
            local = download_asset(n)
            if local in seen:
                continue
            seen.add(local)
            out.append(f'<link rel="stylesheet" href="{local}" />')
    return out

EXCLUDED_HOSTS = ["googletagmanager", "google-analytics", "facebook", "cloudflare", "connect.facebook.net"]
TRACKING_KEYWORDS = ["gtag(", "gtag.", "fbq(", "facebook.com/tr", "dataLayer", "PixelYourSite", "pysOptions", "pys_"]

def is_tracking_src(url: str) -> bool:
    return any(h in url for h in EXCLUDED_HOSTS)

def is_tracking_inline(body: str) -> bool:
    return any(k in body for k in TRACKING_KEYWORDS)

def extract_inline_styles(html: str):
    out = []
    for m in re.finditer(r'<style[^>]*>(.*?)</style>', html, re.IGNORECASE | re.DOTALL):
        tag = m.group(0)
        body = m.group(1)
        style_id = ""
        idm = re.search(r'id=["\']([^"\']+)', tag, re.IGNORECASE)
        if idm:
            style_id = idm.group(1)
        if style_id in ["flatsome-main-inline-css", "rocket-critical-css", "woocommerce-inline-inline-css"]:
            new_body = rewrite_text(body)
            open_tag = tag[:tag.find(">")+1]
            out.append(open_tag + new_body + "</style>")
    return out

JQUERY_SCRIPTS = {"/wp-includes/js/jquery/jquery.min.js", "/wp-includes/js/jquery/jquery-migrate.min.js"}

def extract_home_assets():
    html = HOME_HTML.read_text(encoding="utf-8", errors="ignore")
    styles = collect_styles(html)
    styles += extract_inline_styles(html)
    head_scripts = []
    scripts = []
    seen_src = set()
    for m in re.finditer(r'<script([^>]*)>(.*?)</script>', html, re.IGNORECASE | re.DOTALL):
        attrs = m.group(1)
        body = m.group(2)
        srcm = re.search(r'src=["\']([^"\']+)["\']', attrs, re.IGNORECASE)
        if srcm:
            src = srcm.group(1)
            n = normalize_url(src)
            if not n:
                continue
            if is_tracking_src(n):
                continue
            local = download_asset(n)
            if local in seen_src:
                continue
            seen_src.add(local)
            clean_attrs = " ".join(a for a in attrs.split() if not a.lower().startswith("src="))
            # remove defer/async so jQuery loads before page inline scripts
            if local in JQUERY_SCRIPTS:
                clean_attrs = " ".join(a for a in clean_attrs.split() if a.lower() not in ("defer", "async"))
                head_scripts.append(f'<script{" " + clean_attrs if clean_attrs else ""} src="{local}"></script>')
                continue
            scripts.append(f'<script{" " + clean_attrs if clean_attrs else ""} src="{local}"></script>')
        else:
            if not body.strip():
                continue
            if is_tracking_inline(body):
                continue
            new_body = rewrite_text(body)
            scripts.append(f'<script{attrs}>{new_body}</script>')
    return styles, head_scripts, scripts

def process_partials():
    for name in ["header.html", "footer.html"]:
        p = PUBLIC / "partials" / name
        if p.exists():
            text = p.read_text(encoding="utf-8", errors="ignore")
            new = rewrite_text(text)
            if new != text:
                p.write_text(new, encoding="utf-8")
                print("rewrote partial", name)

def process_css_files():
    for css in PUBLIC.rglob("*.css"):
        if not css.is_file():
            continue
        text = css.read_text(encoding="utf-8", errors="ignore")
        base = "https://ptemagic.com.vn/" + str(css.relative_to(PUBLIC)).replace("\\", "/")
        def repl(m: re.Match) -> str:
            orig = m.group(1)
            quote = ""
            url = orig.strip()
            if url.startswith('"') and url.endswith('"'):
                quote = '"'; url = url[1:-1]
            elif url.startswith("'") and url.endswith("'"):
                quote = "'"; url = url[1:-1]
            if url.startswith("data:") or url.startswith("#") or not url:
                return m.group(0)
            n = normalize_url(url, base)
            if not n:
                return m.group(0)
            local = download_asset(n)
            return f"url({quote}{local}{quote})"
        new = re.sub(r'url\(\s*(["\']?[^\)"\']+["\']?)\s*\)', repl, text, flags=re.IGNORECASE)
        if new != text:
            css.write_text(new, encoding="utf-8")
            print("rewrote css", css.relative_to(PUBLIC))

def process_homepage():
    p = DATA / "page_9883.json"
    if p.exists():
        item = json.loads(p.read_text(encoding="utf-8"))
        content = item.get("content", "")
        if content:
            new = rewrite_text(content)
            if new != content:
                item["content"] = new
                p.write_text(json.dumps(item, ensure_ascii=False), encoding="utf-8")
                print("rewrote homepage")

def main():
    print("Extracting homepage styles/scripts...")
    styles, head_scripts, scripts = extract_home_assets()
    old_css = PUBLIC / "css"
    if old_css.exists():
        shutil.rmtree(old_css)
        print("removed old public/css")
    (PUBLIC / "partials").mkdir(parents=True, exist_ok=True)
    (PUBLIC / "partials" / "styles.html").write_text("\n".join(styles), encoding="utf-8")
    (PUBLIC / "partials" / "head-scripts.html").write_text("\n".join(head_scripts), encoding="utf-8")
    (PUBLIC / "partials" / "scripts.html").write_text("\n".join(scripts), encoding="utf-8")
    print("styles", len(styles), "head scripts", len(head_scripts), "scripts", len(scripts))
    print("Processing header/footer...")
    process_partials()
    print("Processing homepage content...")
    process_homepage()
    print("Processing CSS files...")
    process_css_files()
    print("Done")

if __name__ == "__main__":
    main()
