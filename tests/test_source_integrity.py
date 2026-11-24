"""The manifest gate must fail closed, including files not yet registered."""
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('source_integrity', ROOT/'pages-release/current/source_integrity.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class IntegrityTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root/'approved.js').write_text('const value = 1;\n')
        self.manifest = {'version':'3.4.2','files':{'approved.js':hashlib.sha256((self.root/'approved.js').read_bytes()).hexdigest()}}
        (self.root/'source-manifest.json').write_text(json.dumps(self.manifest))
    def tearDown(self):
        self.temp.cleanup()
    def test_clean(self):
        self.assertEqual(module.audit(self.root,self.manifest)[1],[])
    def test_new_file_is_rejected(self):
        (self.root/'unreviewed.js').write_text('new code')
        self.assertIn('UNREGISTERED: unreviewed.js', '\n'.join(module.audit(self.root,self.manifest)[1]))
    def test_aggregate_missing_and_modified(self):
        self.manifest['files']['missing.js']='0'*64
        (self.root/'approved.js').write_text('modified')
        errors=module.audit(self.root,self.manifest)[1]
        self.assertEqual(len(errors),2)
        self.assertIn('MISSING','\n'.join(errors))
    def test_symlink_is_rejected(self):
        (self.root/'linked.js').symlink_to(self.root/'approved.js')
        self.assertIn('symlinks', '\n'.join(module.audit(self.root,self.manifest)[1]))
    def test_invalid_path_is_rejected(self):
        self.manifest['files']['../outside']='0'*64
        self.assertIn('invalid manifest path','\n'.join(module.audit(self.root,self.manifest)[1]))
    def test_exact_approval_and_atomic_bad_batch(self):
        tool=ROOT/'pages-release/current/review_manifest.py'
        (self.root/'new.js').write_text('reviewed')
        digest=hashlib.sha256((self.root/'new.js').read_bytes()).hexdigest()
        before=(self.root/'source-manifest.json').read_bytes()
        bad=subprocess.run([sys.executable,str(tool),'--source',str(self.root),'--approve','new.js='+digest,'--approve','approved.js='+'0'*64],capture_output=True)
        self.assertNotEqual(bad.returncode,0)
        self.assertEqual((self.root/'source-manifest.json').read_bytes(),before)
        good=subprocess.run([sys.executable,str(tool),'--source',str(self.root),'--approve','new.js='+digest],capture_output=True)
        self.assertEqual(good.returncode,0,good.stderr)
        self.assertEqual(json.loads((self.root/'source-manifest.json').read_text())['files']['new.js'],digest)

if __name__=='__main__':unittest.main()
