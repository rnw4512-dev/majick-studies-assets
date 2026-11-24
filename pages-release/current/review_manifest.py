"""Audit every canonical file; approve only explicit reviewed PATH=SHA256 pairs.
Never auto-approve in CI. A review should include git diff / history, provenance
for assets, applicable tests, and recording the exact approval in the commit.
"""
import argparse
import json
import os
from pathlib import Path
from source_integrity import DIGEST, audit, inventory

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source', type=Path, default=Path('current-site'))
parser.add_argument('--approve', action='append', default=[], metavar='PATH=SHA256')
args = parser.parse_args()
manifest = args.source / 'source-manifest.json'
data = json.loads(manifest.read_text())
actual, inventory_errors = inventory(args.source)
if inventory_errors:
    parser.error('\n'.join(inventory_errors))
approved = {}
for spec in args.approve:
    name, sep, digest = spec.rpartition('=')
    if not sep or not DIGEST.fullmatch(digest) or actual.get(name) != digest:
        parser.error('Approval must match actual file bytes: ' + spec)
    approved[name] = digest
if approved:
    data['files'].update(approved)
    temporary = manifest.with_suffix('.json.tmp')
    try:
        temporary.write_text(json.dumps(data, indent=2) + '\n')
        os.replace(temporary, manifest)
    finally:
        temporary.unlink(missing_ok=True)
_, errors = audit(args.source, data)
for error in errors:
    print(error)
print(f'Audited {len(data["files"])} locked files; {len(actual)} actual files; {len(errors)} errors.')
raise SystemExit(bool(errors))
