import urllib.request, ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
req = urllib.request.Request('https://ptemagic.com.vn/', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
data = urllib.request.urlopen(req, context=ctx, timeout=30).read()
open('ptemagic_home.html', 'wb').write(data)
print('saved', len(data))
