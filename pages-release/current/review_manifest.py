"""Audit all locked files. Updating requires explicit paths and expected SHA-256.
Run from repository root. Never invoked automatically by publishing.
"""
import argparse, hashlib, json
from pathlib import Path
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument("--approve", action="append", default=[], metavar="PATH=SHA256")
args=parser.parse_args()
root=Path("current-site")
manifest=root/"source-manifest.json"
data=json.loads(manifest.read_text())
locked=data["files"]
actual={}
for p in sorted(root.rglob("*")):
    if p.is_file() and p!=manifest:
        actual[p.relative_to(root).as_posix()]=hashlib.sha256(p.read_bytes()).hexdigest()
for spec in args.approve:
    name, sep, digest=spec.rpartition("=")
    if not sep or actual.get(name)!=digest:
        parser.error("Approval must match actual file bytes: "+spec)
for spec in args.approve:
    name, _, digest=spec.rpartition("=")
    locked[name]=digest
if args.approve:
    manifest.write_text(json.dumps(data,indent=2)+"\n")
errors=[]
for name,digest in locked.items():
    if actual.get(name)!=digest:
        errors.append(f"{name}: expected {digest}; actual {actual.get(name,'MISSING')}")
for name in sorted(actual.keys()-locked.keys()):
    print(f"UNTRACKED: {name}={actual[name]}")
for error in errors:
    print(error)
print(f"Audited {len(locked)} locked files; {len(errors)} mismatches; {len(actual.keys()-locked.keys())} untracked files.")
raise SystemExit(bool(errors))
