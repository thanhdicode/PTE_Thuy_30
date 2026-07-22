from pathlib import Path
p = Path('C:/Users/Administrator/repos/PTE_Thuy_30/ptemagic-clone/public')
keep_dirs = {'partials'}
for f in p.rglob('*'):
    if f.is_file() and not f.suffix:
        f.unlink()
        print('removed', f)
