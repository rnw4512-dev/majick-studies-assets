/* Guardian animation controller for PixiJS 8.6.6.
 * Adapter only: the Sanctuary owns positions, persistence and the sole ticker.
 * Does not create a Guardian, overwrite assets or register a second ticker.
 */
(function (global) {
  'use strict';
  const PIXI = global.PIXI;
  if (!PIXI) return;

  const STAGES = ['new-bond', 'apprentice', 'guardian', 'ascendant', 'celestial'];
  const FRAME_NAMES = ['idle', 'left', 'passing', 'right'];

  function validateFrames(frames, count) {
    return Array.isArray(frames) && frames.length === count &&
      frames.every(texture => texture && Number.isFinite(texture.width) &&
        Number.isFinite(texture.height) && texture.width > 0 && texture.height > 0 &&
        texture.width === frames[0].width && texture.height === frames[0].height);
  }

  // No implicit asset paths: only explicitly approved files can replace protected art.
  async function loadApprovedStage(canon, stage, entries, load = PIXI.Assets.load.bind(PIXI.Assets)) {
    if (!STAGES.includes(stage)) throw Error('Unknown Guardian evolution stage: ' + stage);
    const paths = entries?.[canon]?.[stage];
    if (!Array.isArray(paths) || paths.length !== 4 ||
        paths.some(path => typeof path !== 'string' || !path.trim())) return null;
    try {
      const frames = await Promise.all(paths.map(path => load(path)));
      if (!validateFrames(frames, 4)) {
        console.warn('Four-frame set rejected: inconsistent canvas dimensions', canon, stage);
        return null;
      }
      return frames;
    } catch (error) {
      console.warn('Four-frame artwork unavailable; keeping current artwork', canon, stage, error);
      return null;
    }
  }

  class GuardianAnimationController {
    constructor(sprite) {
      if (!(sprite instanceof PIXI.AnimatedSprite)) throw TypeError('Expected existing PIXI.AnimatedSprite');
      this.sprite = sprite;
      this.state = 'idle';
      this.direction = 1;
      this.frameCount = sprite.textures.length;
      // Sanctuary owns animation advancement via its existing app ticker.
      sprite.autoUpdate = false;
      sprite.loop = true;
      sprite.gotoAndStop(0);
    }

    setMotion(walking, direction = this.direction, permitted = true) {
      const sprite = this.sprite;
      if (sprite.destroyed) return;
      this.direction = direction < 0 ? -1 : 1;
      sprite.scale.x = Math.abs(sprite.scale.x) * this.direction;
      const shouldWalk = Boolean(walking && permitted && this.frameCount > 1);
      if (!shouldWalk) {
        if (this.state !== 'idle' || sprite.playing) sprite.gotoAndStop(0);
        this.state = 'idle';
        return;
      }
      if (this.state !== 'walk' || !sprite.playing) sprite.play();
      this.state = 'walk';
    }

    tick(deltaTime, speedMultiplier = 1) {
      if (this.state === 'walk' && this.sprite.playing && !this.sprite.destroyed) {
        this.sprite.update({deltaTime: Math.max(0, deltaTime) * Math.max(0, speedMultiplier)});
      }
    }

    dispose() {
      if (!this.sprite.destroyed) this.sprite.stop();
      this.state = 'idle';
    }
  }

  global.MajickGuardianAnimation = Object.freeze({
    STAGES: Object.freeze(STAGES),
    FRAME_NAMES: Object.freeze(FRAME_NAMES),
    validateFrames,
    loadApprovedStage,
    GuardianAnimationController
  });
})(window);
