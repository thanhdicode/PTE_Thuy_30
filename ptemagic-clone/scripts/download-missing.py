import json
import re
import ssl
import urllib.parse
import urllib.request
from pathlib import Path

PUBLIC = Path('C:/Users/Administrator/repos/PTE_Thuy_30/ptemagic-clone/public')
DATA = Path('C:/Users/Administrator/repos/PTE_Thuy_30/ptemagic-clone/src/data/wp')

def ctx():
    c = ssl.create_default_context()
    c.check_hostname = False
    c.verify_mode = ssl.CERT_NONE
    return c

def fetch(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx(), timeout=30) as r:
            return r.read()
    except Exception as e:
        return None

def download_missing(path: str):
    if not path or not path.startswith('/') or path.startswith('//') or '..' in path:
        return
    # skip non-asset extensions
    ext = Path(path).suffix.lower()
    if ext not in {'.webp','.jpg','.jpeg','.png','.gif','.svg','.ico','.bmp','.woff','.woff2','.ttf','.eot','.otf','.css','.js','.json','.pdf','.zip','.mp3','.mp4','.webm','.ogg','.wav'}:
        return
    local = path[1:]
    dest = PUBLIC / local
    if dest.exists():
        return
    data = fetch('https://ptemagic.com.vn' + path)
    if data is None:
        data = fetch('https://ptemagic.com.vn' + path + '/')
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    print('downloaded', path)

def find_local_urls(text: str):
    # find src, data-lazy-src, data-src, srcset, href, url() values that look like local paths
    urls = set()
    # attributes
    for m in re.finditer(r'(?:src|data-lazy-src|data-src|srcset|href|action|url)\s*=\s*["\']([^"\']+)["\']', text, re.IGNORECASE):
        val = m.group(1)
        if val.startswith('/'):
            # srcset may contain multiple "url sizew," entries
            for part in val.split(','):
                url = part.strip().split(' ')[0]
                if url.startswith('/'):
                    urls.add(url)
        elif val.startswith('https://ptemagic.com.vn/') or val.startswith('http://ptemagic.com.vn/'):
            # absolute, convert to local
            p = urllib.parse.urlparse(val).path
            if p:
                urls.add(p)
    # url() in inline styles
    for m in re.finditer(r'url\(\s*["\']?([^\)"\']+)', text, re.IGNORECASE):
        val = m.group(1).strip()
        if val.startswith('/'):
            urls.add(val)
    return urls

def scan_file(path: Path):
    text = path.read_text(encoding='utf-8', errors='ignore')
    for url in find_local_urls(text):
        download_missing(url)

def main():
    for p in (PUBLIC / 'partials').glob('*.html'):
        scan_file(p)
    # all JSON content files
    for f in DATA.glob('*.json'):
        if f.name == 'manifest.json':
            continue
        try:
            item = json.loads(f.read_text(encoding='utf-8'))
        except Exception:
            continue
        if isinstance(item, dict):
            for url in find_local_urls(item.get('content', '')):
                download_missing(url)
    # all CSS files
    for css in PUBLIC.rglob('*.css'):
        if css.is_file():
            for url in find_local_urls(css.read_text(encoding='utf-8', errors='ignore')):
                download_missing(url)

if __name__ == '__main__':
    main()
