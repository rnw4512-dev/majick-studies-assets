"""Shared read-only canonical-source audit. Missing registrations are release errors."""
import hashlib
import re
from pathlib import Path, PurePosixPath

DIGEST = re.compile(r'^[0-9a-f]{64}$')


def inventory(source):
    source = Path(source)
    files, errors = {}, []
    for path in sorted(source.rglob('*')):
        name = path.relative_to(source).as_posix()
        if path.is_symlink():
            errors.append(f'{name}: symlinks are not approved release sources')
        elif path.is_file() and name != 'source-manifest.json':
            files[name] = hashlib.sha256(path.read_bytes()).hexdigest()
    return files, errors


def audit(source, manifest):
    actual, errors = inventory(source)
    locked = manifest.get('files')
    if not isinstance(locked, dict):
        return actual, ['Manifest files must be a path-to-SHA-256 object'] + errors
    for name, expected in locked.items():
        path = PurePosixPath(name)
        if path.is_absolute() or '..' in path.parts or path.as_posix() != name or name == 'source-manifest.json':
            errors.append(f'{name}: invalid manifest path')
            continue
        if not isinstance(expected, str) or not DIGEST.fullmatch(expected):
            errors.append(f'{name}: invalid SHA-256')
        elif actual.get(name) != expected:
            errors.append(f'{name}: expected {expected}; actual {actual.get(name, "MISSING")}')
    for name in sorted(actual.keys() - locked.keys()):
        errors.append(f'UNREGISTERED: {name}={actual[name]}')
    return actual, errors
