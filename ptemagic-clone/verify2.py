from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto('http://localhost:3001/')
    page.wait_for_timeout(5000)
    page.screenshot(path='verify_home2.png', full_page=True)
    print('saved verify_home2.png')
    page.goto('http://localhost:3001/khoa-hoc-tieng-anh-pte/')
    page.wait_for_timeout(5000)
    page.screenshot(path='verify_course2.png', full_page=True)
    print('saved verify_course2.png')
    browser.close()
