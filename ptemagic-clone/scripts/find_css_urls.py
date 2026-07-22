import re, pathlib, json
css_dir = pathlib.Path('public/css')
urls = {}
for f in css_dir.glob('*.css'):
    text = f.read_text(encoding='utf-8', errors='ignore')
    found = re.findall(r'url\(\s*["\']?([^\)"\'\s]+)', text, re.IGNORECASE)
    if found:
        urls[f.name] = found
print(json.dumps(urls, indent=2))
