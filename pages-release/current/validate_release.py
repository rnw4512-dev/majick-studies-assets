"""Shared integration/publishing gate; auditing never approves source changes."""
from pathlib import Path
import subprocess
import sys
source = sys.argv[1] if len(sys.argv)>1 else 'current-site'
output = sys.argv[2] if len(sys.argv)>2 else '_certified'
steps = [[sys.executable,'pages-release/current/review_manifest.py','--source',source],
 ['node','pages-release/current/release-checks.cjs',source]]
steps += [['node',str(path),source] for path in sorted(Path('pages-release/current').glob('test-*.cjs'))]
steps += [['node','--test','tests/d756-question-classification.test.cjs'],
 [sys.executable,'-B','tests/test_source_integrity.py'],
 [sys.executable,'pages-release/current/build.py',source,output]]
for command in steps:
 print('+ '+' '.join(command),flush=True)
 subprocess.run(command,check=True)
