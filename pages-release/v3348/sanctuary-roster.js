// V3.3.50 compatibility layer: roster reporting/audit only.
// New Guardian spawning and movement live in Game.js. Original four retain protected legacy motion.
(()=>{
  'use strict';
  if(typeof Game==='undefined') return;

  const VERSION='3.3.50';
  const ORIGINAL=new Set(['luna','ember','nova','mallow']);
  const STAGES=['new-bond','apprentice','guardian','ascendant','celestial'];
  const DISPLAY={
    luna:'Velora', ember:'Cascade', nova:'Solstice', mallow:'Aurelia',
    vesper:'Vesper', briar:'Briar', zephyr:'Zephyr', prism:'Prism', rook:'Rook', solara:'Solara'
  };

  function roster(scene){
    return Array.isArray(scene?.v3317CareState?.roster) ? scene.v3317CareState.roster : [];
  }

  function stage(g,scene){
    const state=scene?.v3317GuardianStates?.[g.type]||{};
    const level=Number(state.level||g.level||1);
    const slug=state.stageSlug||g.stageSlug;
    return STAGES.includes(slug)
      ? slug
      : level>=12?'celestial'
      : level>=8?'ascendant'
      : level>=5?'guardian'
      : level>=3?'apprentice'
      :'new-bond';
  }

  function canon(g){
    return window.MajickGuardianRegistry?.get?.(g.type)?.canon
      || String(g.type||'').replace(/[^a-z0-9-]/gi,'').toLowerCase();
  }

  function displayName(g){
    return DISPLAY[g?.type] || g?.name || g?.type || 'Guardian';
  }

  function guardianSprite(scene,g){
    if(!scene || !g) return null;
    if(ORIGINAL.has(g.type)){
      return scene[g.type] || null;
    }
    return scene.majickGuardianSprites?.[g.petId] || null;
  }

  function isVisible(pet){
    return !!pet?.active && pet.visible!==false && Number(pet.alpha??1)>.05;
  }

  function report(scene){
    const rows=roster(scene).map(g=>{
      const pet=guardianSprite(scene,g);
      const walk=ORIGINAL.has(g.type) ? scene?.['v3317Walk_'+g.type] : null;
      const action=ORIGINAL.has(g.type) ? scene?.['v3317Action_'+g.type] : null;
      const present=isVisible(pet) || isVisible(walk) || isVisible(action);
      return {
        petId:g.petId,
        name:displayName(g),
        type:g.type,
        present:!!present
      };
    });

    try{
      window.parent?.postMessage(
        {type:'MAJICK_SANCTUARY_ROSTER_V3350',rows},
        location.origin
      );
    }catch(_){}

    return rows;
  }

  // Backward-compatible entry point for V3.3.50 audit code.
  // It no longer creates or moves Guardian sprites.
  Game.prototype.v3348SyncRoster=function(){
    this.syncGuardianRoster?.();
    this.v3320RefreshGuardianLabels?.(this.v3317CareState);
    return report(this);
  };

  // Retained only so old callers do not throw. New Guardian movement belongs to Game.js.
  Game.prototype.v3348Roam=function(id){
    const pet=this.majickGuardianSprites?.[id];
    if(!pet?.active) return false;
    if(typeof this.scheduleNewGuardianRoam==='function'){
      this.scheduleNewGuardianRoam(pet);
      return true;
    }
    return false;
  };

  const apply=Game.prototype.v3320ApplyCareSnapshot;
  Game.prototype.v3320ApplyCareSnapshot=function(snapshot){
    const result=apply?.call(this,snapshot);
    this.syncGuardianRoster?.();
    report(this);
    return result;
  };

  const create=Game.prototype.create;
  Game.prototype.create=function(){
    const result=create.apply(this,arguments);
    this.time?.delayedCall?.(900,()=>{
      this.syncGuardianRoster?.();
      report(this);
    });
    this.time?.delayedCall?.(2300,()=>report(this));
    this.time?.addEvent?.({
      delay:12000,
      loop:true,
      callback:()=>report(this)
    });
    return result;
  };

  window.MajickSanctuaryRoster={
    VERSION,
    stage,
    canon,
    inspect(scene){
      const s=scene||window.majickPhaserGame?.scene?.getScene?.('Game');
      return {
        roster:report(s),
        dynamic:Object.keys(s?.majickGuardianSprites||{})
      };
    }
  };

  window.addEventListener('message',ev=>{
    if(ev.origin!==location.origin || ev.data?.type!=='MAJICK_SANCTUARY_ROSTER_REQUEST_V3350') return;
    const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
    if(scene){
      scene.syncGuardianRoster?.();
      report(scene);
    }
  });
})();
