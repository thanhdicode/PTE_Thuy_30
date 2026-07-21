from pathlib import Path
p = Path('C:/Users/Administrator/repos/PTE_Thuy_30/ptemagic-clone/public')
for f in p.iterdir():
    if f.is_file() and not f.name.startswith('.') and not f.suffix:
        f.unlink()
        print('removed', f.name)
print('done')
