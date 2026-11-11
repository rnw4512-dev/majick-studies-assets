"""Conservative, reproducible repository inventory. Missing references never imply dead code."""
from pathlib import Path
from collections import defaultdict
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/audits'
paths = subprocess.check_output(['git', 'ls-files', '-z'], cwd=ROOT).decode().split('\0')
paths = [p for p in paths if p and (ROOT / p).is_file()]
texts = {}
hashes = defaultdict(list)
for name in paths:
    data = (ROOT / name).read_bytes()
    hashes[hashlib.sha256(data).hexdigest()].append(name)
    if Path(name).suffix in {'.js', '.cjs', '.html', '.css', '.json', '.webmanifest', '.yml', '.md', '.py'}:
        texts[name] = data.decode('utf-8', errors='replace')

# Record quoted paths, including manifests, generated-asset templates, CSS and workflows.
# This is evidence, not a complete JavaScript/data-flow analysis.
refs = defaultdict(set)
dynamic = []
by_name = defaultdict(list)
for p in paths:
    by_name[Path(p).name].append(p)
for source, text in texts.items():
    if source.startswith('docs/audits/') or source == 'tools/aetheria-inventory.py':
        continue
    for value in re.findall(r'''["'`]([^"'`\n]{1,250})["'`]''', text):
        value = value.split('?')[0].split('#')[0]
        if '${' in value:
            dynamic.append({'source': source, 'template': value})
        if Path(value).name in by_name:
            for target in by_name[Path(value).name]:
                refs[target].add(source)

groups = [v for v in hashes.values() if len(v) > 1]
duplicate = {p: [x for x in group if x != p] for group in groups for p in group}
rows = []
for p in paths:
    suffix = Path(p).suffix
    canonical = p.startswith('current-site/')
    references = sorted(refs[p] - {p})
    if canonical:
        purpose = ('Guardian/appearance/scene asset; identity or manifest compatibility may apply' if '/assets/' in p or '/frames/' in p else
                   'Canonical application entry point' if p == 'current-site/index.html' else
                   'Canonical runtime script' if suffix == '.js' else
                   'Canonical presentation rules' if suffix == '.css' else
                   'Canonical application resource or independently addressable page')
        status = 'active' if p == 'current-site/index.html' else 'unknown'
        risk = 'high' if suffix in {'.js', '.json', '.html'} or '/assets/' in p else 'medium'
    elif p.startswith('pages-release/current/') or p.startswith('tests/') or p.startswith('.github/') or p.startswith('tools/'):
        purpose, status, risk = 'Build, verification or repository automation', 'active' if references else 'unknown', 'medium'
    elif p.startswith('pages-release/'):
        purpose, status, risk = 'Historical release source/payload; recovery and external consumers unverified', 'legacy', 'high'
    else:
        purpose, status, risk = 'Documentation or historical source/asset; external consumers unverified', 'unknown', 'high'
    rows.append({'path': p, 'purpose': purpose, 'runtime_status': status,
                 'references': references, 'risk': risk, 'recommendation': 'keep',
                 'evidence': ['Tracked at baseline; canonical build copies current-site only.',
                              'Quoted-path/basename search: %d potential consumers; no-reference is not proof of disuse.' % len(references)],
                 'identical_files': duplicate.get(p, []), 'bytes': (ROOT / p).stat().st_size})

storage = []
css = defaultdict(list)
for p, text in texts.items():
    if not p.startswith('current-site/'):
        continue
    for i, line in enumerate(text.splitlines(), 1):
        if re.search(r'localStorage\.|indexedDB|sessionStorage\.', line):
            storage.append({'path': p, 'line': i, 'operations': sorted(set(re.findall(r'(?:localStorage|sessionStorage)\.\w+', line)))})
    if p.endswith('.css'):
        for selector, body in re.findall(r'([^{}]+)\{([^{}]+)\}', text):
            key = re.sub(r'\s+', ' ', selector.strip()) + '{' + re.sub(r'\s+', ' ', body.strip()) + '}'
            css[key].append(p)
OUT.mkdir(parents=True, exist_ok=True)
payload = {'baseline_commit': '31be7d10f31ebb71b66a2055ef0246d228aac9ce',
           'method': 'Conservative quoted-path and basename evidence plus exact-byte duplicates; dynamic/external consumers require runtime review. No automated removals.',
           'files': rows, 'exact_duplicate_groups': groups, 'dynamic_templates': dynamic,
           'storage_operations': storage,
           'duplicate_css_rules': [{'rule': rule, 'files': files} for rule, files in css.items() if len(files) > 1]}
(OUT / 'aetheria-file-inventory.json').write_text(json.dumps(payload, indent=2) + '\n')
print(json.dumps({'files': len(rows), 'bytes': sum(r['bytes'] for r in rows), 'duplicate_groups': len(groups),
                  'storage_operations': len(storage), 'duplicate_css_rules': len(payload['duplicate_css_rules'])}))
