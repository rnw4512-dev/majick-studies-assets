// Run with: node --test current-site/pixi-sanctuary/guardian-animation-controller.test.cjs
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

class AnimatedSprite {
  constructor(textures) {
    this.textures = textures; this.scale = {x: 1};
    this.playing = false; this.destroyed = false;
    this.currentFrame = 0; this.updates = [];
  }
  gotoAndStop(frame) {this.currentFrame = frame; this.playing = false;}
  play() {this.playing = true;}
  stop() {this.playing = false;}
  update(delta) {this.updates.push(delta);}
}
const ctx = {window: {PIXI: {AnimatedSprite, Assets: {load: async path => path}}}, console};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'guardian-animation-controller.js'), 'utf8'), ctx);
const api = ctx.window.MajickGuardianAnimation;
const texture = () => ({width: 1024, height: 1024});

test('supports every registered evolution stage', () => {
  assert.deepEqual(Array.from(api.STAGES), ['new-bond','apprentice','guardian','ascendant','celestial']);
});
test('preserves stationary idle pose and existing Pixi ticker ownership', () => {
  const sprite = new AnimatedSprite([texture(), texture(), texture(), texture()]);
  const controller = new api.GuardianAnimationController(sprite);
  assert.equal(sprite.autoUpdate, false);
  controller.setMotion(true, -1);
  controller.tick(2, 1.5);
  assert.equal(sprite.scale.x, -1);
  assert.equal(sprite.updates.length, 1);
  assert.equal(sprite.updates[0].deltaTime, 3);
  controller.setMotion(false);
  assert.equal(sprite.playing, false);
  assert.equal(sprite.currentFrame, 0);
  assert.equal(controller.state, 'idle');
  controller.dispose();
});
test('will not load unapproved stage images', async () => {
  let calls = 0;
  const frames = await api.loadApprovedStage('velora', 'new-bond', {}, async () => {calls++; return texture();});
  assert.equal(frames, null);
  assert.equal(calls, 0);
});
test('accepts four aligned frames and rejects mismatched dimensions', async () => {
  const paths = ['idle.png','left.png','passing.png','right.png'];
  const manifest = {velora: {'new-bond': paths}};
  const good = await api.loadApprovedStage('velora', 'new-bond', manifest, async () => texture());
  assert.equal(good.length, 4);
  const bad = await api.loadApprovedStage('velora', 'new-bond', manifest,
    async file => ({width: file === 'right.png' ? 512 : 1024, height: 1024}));
  assert.equal(bad, null);
});
