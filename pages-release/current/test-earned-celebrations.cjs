'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = process.argv[2] || 'current-site';
const code = fs.readFileSync(path.join(source, 'reward-core.js'), 'utf8');
const account = {
  xp: 0, crystals: 0, chests: 0,
  rewardCore: { ledger: {}, stats: { correct: 0, independent: 0, delayed: 0 }, masteryXp: 0, eggFragments: 0 },
};
const effects = [];
const receipts = [];
const context = vm.createContext({
  account: () => account,
  state: () => ({ activeCourse: 'D756' }),
  guardianRewards: () => ({ guardian: null, egg: null }),
  treasureDrop: () => null,
  save() {},
  pushRewardState() {},
  showReceipt(receipt) { receipts.push(receipt.key); },
  window: { MajickAnimationEffects: { play(type, options) { effects.push({ type, label: options.label }); } } },
});
vm.runInContext(code.slice(code.indexOf('function baseFor('), code.indexOf('function rarityRank(')), context);
vm.runInContext(code.slice(code.indexOf('function rewardKey('), code.indexOf('function receiptLines(')), context);

for (const [type, effect, options] of [
  ['correct-answer', 'success', { difficulty: 3, independent: true, correct: true }],
  ['correct-answer', 'mastery', { difficulty: 5, independent: true, correct: true }],
  ['guided-learning-correct', 'success', { assisted: true, correct: true }],
  ['brain-break-correct', 'success', { assisted: true, correct: true }],
  ['whole-course-complete', 'lesson', { assisted: true }],
  ['d756-meeting-first-pass', 'reward', { masteryEligible: false }],
  ['d756-meeting-repeat-practice', 'reward', { masteryEligible: false }],
  ['study-fragment-earned', 'reward', {}],
  ['game-fragment-earned', 'reward', {}],
  ['starfall-fragment-earned', 'reward', {}],
  ['adventure-fragment-earned', 'reward', {}],
  ['potion-recall-practice', 'reward', { assisted: true }],
  ['boss-victory', 'reward', {}],
  ['endurance-test', 'reward', {}],
  ['streak-10', 'reward', {}],
  ['lesson-mastered', 'lesson', { independent: true }],
].map((row, index) => [row[0], row[1], { key: 'earned-' + index, ...row[2] }])) {
  const priorEffectCount = effects.length;
  const receipt = context.award(type, options);
  assert.equal(receipt.course, 'D756');
  assert.equal(effects.length, priorEffectCount + 1, type);
  assert.equal(effects.at(-1).type, effect, type);
  assert.equal(receipts.at(-1), options.key);
  const earned = JSON.stringify(account);
  assert.equal(context.award(type, options), receipt);
  assert.equal(JSON.stringify(account), earned, type);
  assert.equal(effects.length, priorEffectCount + 1, 'replay ' + type);
}

const before = JSON.stringify({ account, effects, receipts });
for (const type of ['correct-answer', 'guided-learning-correct', 'brain-break-correct']) {
  assert(context.award(type, { key: 'wrong-' + type, correct: false }).rejected, type);
}
assert(context.award('micro-skill-mastered', { key: 'assisted-micro', assisted: true }).rejected);
assert(context.award('learning-effort', { key: 'effort' }).rejected);
assert.equal(JSON.stringify({ account, effects, receipts }), before);
console.log('PASS earned celebration types, repeat-safe receipts, incorrect checks, and assisted mastery exclusion');
