from pathlib import Path
p = Path('C:/Users/Administrator/repos/PTE_Thuy_30/ptemagic-clone/public')
for d in p.iterdir():
    if d.is_dir() and d.name not in {'css','images','partials','wp-content'}:
        print(d.name, sum(1 for _ in d.rglob('*')))
