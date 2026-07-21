import json
import os
import re
import html

out_dir = r'C:\Users\Administrator\repos\PTE_Thuy_30\ptemagic-clone\src\data\wp'
export_dir = r'C:\Users\Administrator\repos\PTE_Thuy_30\docs\reference-audit\ptemagic\wp-export'
os.makedirs(out_dir, exist_ok=True)

def to_segments(link, allowed_hosts=('ptemagic.com.vn','ptemagic.com','careerenglish.ptemagic.com.vn')):
    # remove protocol and host
    path = re.sub(r'^https?://[^/]+', '', link)
    path = path.strip('/')
    if not path:
        return []
    # remove trailing slash and split
    return path.strip('/').split('/')

def prepare(items, item_type):
    manifest = []
    for item in items:
        link = item.get('link', '')
        slug = item.get('slug', '')
        title = html.unescape(item.get('title', {}).get('rendered', ''))
        content = item.get('content', {}).get('rendered', '')
        excerpt = item.get('excerpt', {}).get('rendered', '')
        featured = item.get('featured_media', 0)
        segments = to_segments(link)
        key = '/'.join(segments) or '__index'
        data = {
            'id': item.get('id'),
            'type': item_type,
            'slug': slug,
            'link': link,
            'title': title,
            'excerpt': excerpt,
            'content': content,
            'featured_media': featured,
            'segments': segments,
        }
        fname = f"{item_type}_{item.get('id')}.json"
        with open(os.path.join(out_dir, fname), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False)
        manifest.append({
            'id': item.get('id'),
            'type': item_type,
            'slug': slug,
            'title': title,
            'link': link,
            'segments': segments,
            'file': fname,
        })
    return manifest

pages = json.load(open(os.path.join(export_dir, 'pages.json'), encoding='utf-8'))
posts = json.load(open(os.path.join(export_dir, 'posts.json'), encoding='utf-8'))

manifest = prepare(pages, 'page') + prepare(posts, 'post')

# detect duplicate segments (page wins)
seen = {}
for m in manifest:
    key = '/'.join(m['segments']) or '__index'
    if key not in seen:
        seen[key] = m

with open(os.path.join(out_dir, 'manifest.json'), 'w', encoding='utf-8') as f:
    json.dump(list(seen.values()), f, ensure_ascii=False, indent=2)

print('Prepared', len(manifest), 'items, unique', len(seen))
