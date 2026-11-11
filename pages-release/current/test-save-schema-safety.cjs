'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = path.resolve(process.argv[2] || 'current-site');
function fixture() {
  const data = new Map();
  const c = {window: null, localStorage: {getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v))},
    CustomEvent: class {}, dispatchEvent() {}};
  c.window = c;
  vm.runInNewContext(fs.readFileSync(path.join(source, 'save-safety.js'), 'utf8'), c);
  return {api: c.MajickSaveSafety, data};
}
const original = {courses: {D756: {}}, progress: {D756: {answers: [{qid: 'kept'}]}},
  saveSchemaVersion: 2, futureField: {protected: true}, majickAccount: {xp: 700, crystals: 50}};
for (const key of ['PREVIOUS', 'PIN']) {
  const {api, data} = fixture();
  const raw = JSON.stringify(original);
  data.set(api.keys.KEY, raw);
  data.set(api.keys[key], JSON.stringify({...original, saveSchemaVersion: 1}));
  assert.throws(() => api.read(), /newer schema/, 'Never silently downgrade a newer save to an older snapshot');
  assert.equal(data.get(api.keys.KEY), raw, 'Preserve newer primary bytes');
  assert.equal(data.get(api.keys.BAD), undefined, 'A valid newer save is not corrupt data');
}
{
  const {api, data} = fixture();
  data.set(api.keys.KEY, '{broken');
  const valid = {...original, saveSchemaVersion: 1};
  data.set(api.keys.PREVIOUS, JSON.stringify(valid));
  assert.equal(JSON.stringify(api.read()), JSON.stringify(valid));
  assert.equal(data.get(api.keys.BAD), '{broken');
  assert.deepEqual(JSON.parse(JSON.stringify(api.preview(api.exportPayload(valid)))), valid);
}
console.log('PASS newer schemas remain intact; corrupt saves still recover; unknown fields survive backup roundtrip');
