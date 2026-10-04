// =============================================================
// V3.3.10 PHASER MOTION RESTORE + DARK COLLEGIUM VISUAL PASS
// IMPORTANT: the user's original Phase 4 image files are NOT replaced.
// This layer only improves scene staging, motion scheduling, depth and room art.
// =============================================================

Game.prototype.createBackground = function()
{
    const W=this.worldWidth,H=this.worldHeight;
    this.add.rectangle(W/2,H/2,W,H,0x1c111b).setDepth(-50);
    if(this.textures.exists('academy-sanctuary-bg')){
        this.add.image(W/2,H/2,'academy-sanctuary-bg').setDisplaySize(W,H).setDepth(-49);
    }

};

Game.prototype.createDecor = function()
{
    const gold=0xd2a76d,deep=0x1d1119,wood=0x382218,velvet=0x5c294d;
    const shadow=(w,h)=>this.add.ellipse(0,h/2,w,h,0x050308,.34);

    this.createMovableDecor('arcane-bookcase',300,730,'Arcane Stacks',()=>{
        const c=this.add.container(0,0);c.add(shadow(210,48));
        c.add(this.add.rectangle(0,-28,194,264,0x1a1017,1).setStrokeStyle(5,0x8b6247,.70));
        c.add(this.add.triangle(0,-178,-102,54,102,54,0,-22,0x2b1820,.98).setStrokeStyle(4,gold,.48));
        [-112,-54,4,62].forEach((yy,row)=>{c.add(this.add.rectangle(0,yy+32,168,9,0x69452e,.98));for(let i=0;i<7;i++){const col=[0x5c3048,0x35505e,0x4c5c39,0x6b4330,0x43335e][(i+row)%5];c.add(this.add.rectangle(-63+i*21,yy+10,14,38+(i%3)*7,col,.98).setStrokeStyle(1,0xe0bd83,.22));}});
        const orb=this.add.circle(57,-138,13,0x7b68d4,.78).setStrokeStyle(2,0xe7dcff,.56);c.add(orb);this.tweens.add({targets:orb,alpha:.35,scale:1.2,duration:1350,yoyo:true,repeat:-1});
        c.add(this.add.text(-55,-151,'☾',{fontFamily:'Georgia',fontSize:'30px',color:'#d7b77a'}).setOrigin(.5));return c;
    },()=>this.openArcaneStacks());

    this.createMovableDecor('moonlit-desk',1015,790,'Moonlit Study Desk',()=>{
        const c=this.add.container(0,0);c.add(shadow(330,54));
        c.add(this.add.rectangle(0,6,320,82,wood,1).setStrokeStyle(4,gold,.62));
        c.add(this.add.rectangle(-132,84,29,126,deep,.99));c.add(this.add.rectangle(132,84,29,126,deep,.99));
        c.add(this.add.rectangle(-35,-33,135,62,0xf0dfbf,.96).setStrokeStyle(2,0x98704e,.55));
        c.add(this.add.rectangle(36,-33,135,62,0xe9d4b8,.96).setStrokeStyle(2,0x98704e,.55));
        c.add(this.add.line(0,-33,0,-62,0,0,0x865e42,.72));
        c.add(this.add.circle(108,-56,22,0x3f315c,.94).setStrokeStyle(3,0xbd98d6,.58));
        c.add(this.add.circle(108,-56,9,0x7b83d8,.65));
        const flame=this.add.circle(-122,-66,9,0xffbc65,.92);c.add(flame);c.add(this.add.rectangle(-122,-40,9,44,0xe8d3b3,.94));this.tweens.add({targets:flame,scaleY:1.28,alpha:.55,duration:430,yoyo:true,repeat:-1});
        return c;
    },()=>this.openStudyDesk());

    this.createMovableDecor('observatory-telescope',1310,710,'Celestial Observatory',()=>{
        const c=this.add.container(0,0);c.add(shadow(220,44));
        c.add(this.add.line(0,58,-65,168,0,0,0x7a5438,.94).setLineWidth(8));c.add(this.add.line(0,58,65,168,0,0,0x7a5438,.94).setLineWidth(8));c.add(this.add.rectangle(0,55,16,155,0x8e694a,.96));
        const tube=this.add.rectangle(5,-27,190,54,0x49322d,1).setStrokeStyle(5,gold,.74).setAngle(-18);c.add(tube);c.add(this.add.circle(-88,-57,31,0x22233c,1).setStrokeStyle(5,0xa886c2,.75));c.add(this.add.circle(-88,-57,16,0x6178a3,.82));
        return c;
    },()=>this.openObservatory());

    this.createMovableDecor('crystal-pedestal',1515,760,'Crystal Focus Pedestal',()=>{
        const c=this.add.container(0,0);c.add(shadow(180,48));
        const aura=this.add.ellipse(0,-46,166,128,0x8667ee,.15);c.add(aura);c.add(this.add.rectangle(0,64,112,82,0x26202d,.99).setStrokeStyle(4,gold,.62));c.add(this.add.rectangle(0,14,78,28,0x4b3850,.99).setStrokeStyle(2,gold,.42));
        [[0,-92,0x9a76ec],[-38,-55,0x6e9bd3],[38,-48,0xbe67bd]].forEach(([x,y,col])=>c.add(this.add.polygon(x,y,[0,-48,25,-8,14,38,-14,38,-25,-8],col,.94).setStrokeStyle(3,0xf0e2ff,.72)));
        this.tweens.add({targets:aura,alpha:.32,scale:1.16,duration:1200,yoyo:true,repeat:-1});return c;
    },()=>this.openCrystalFocus());

    this.createMovableDecor('reading-chair',610,805,'Velvet Reading Chair',()=>{
        const c=this.add.container(0,0);c.add(shadow(180,42));c.add(this.add.ellipse(0,-35,150,174,0x522446,1).setStrokeStyle(5,gold,.56));c.add(this.add.rectangle(0,47,158,62,velvet,1).setStrokeStyle(3,gold,.42));c.add(this.add.ellipse(0,0,102,78,0x764566,.92));c.add(this.add.text(0,-46,'☾',{fontFamily:'Georgia',fontSize:'43px',color:'#e8ca8f'}).setOrigin(.5));return c;
    },()=>this.openArcaneStacks());

    this.createMovableDecor('familiar-settee',1840,792,'Familiar Lounge',()=>{
        const c=this.add.container(0,0);c.add(shadow(330,50));c.add(this.add.rectangle(0,-30,285,112,0x3c1b33,1).setStrokeStyle(5,gold,.55));c.add(this.add.rectangle(0,42,316,70,0x603056,1).setStrokeStyle(3,0xc69b69,.42));c.add(this.add.ellipse(-72,33,98,48,0x8d6687,.80));c.add(this.add.ellipse(72,33,98,48,0x8d6687,.80));c.add(this.add.text(0,-40,'✦  ☾  ✦',{fontFamily:'Georgia',fontSize:'25px',color:'#ebcb90'}).setOrigin(.5));return c;
    },()=>this.openFamiliarLounge());

    const crystalBed=(gem,glow,sigil)=>{const c=this.add.container(0,0);c.add(shadow(300,52));const a=this.add.ellipse(0,0,290,155,glow,.13);c.add(a);c.add(this.add.rectangle(0,45,270,80,0x251620,.99).setStrokeStyle(5,gold,.54));c.add(this.add.ellipse(0,16,232,72,0x78536f,.96).setStrokeStyle(2,0xe9d0df,.34));[-102,-67,-32,3,38,73,108].forEach(dx=>c.add(this.add.triangle(dx,-38,-20,42,20,42,0,-40,gem,.92).setStrokeStyle(2,0xf4e4ff,.60)));c.add(this.add.ellipse(0,7,96,42,0xdcc5d9,.90));c.add(this.add.text(0,8,sigil,{fontFamily:'Georgia',fontSize:'25px',color:'#fff0cd'}).setOrigin(.5));this.tweens.add({targets:a,alpha:.28,scale:1.1,duration:1450,yoyo:true,repeat:-1});return c};
    this.createMovableDecor('moonstone-crystal-bed',760,858,'Moonstone Crystal Bed',()=>crystalBed(0x6fa9bd,0x70cad6,'☾'),()=>this.openFamiliarObjectPicker('bed-west'));
    this.createMovableDecor('amethyst-crystal-bed',2030,858,'Amethyst Crystal Bed',()=>crystalBed(0x906ad8,0xb17ce7,'✦'),()=>this.openFamiliarObjectPicker('bed-east'));

    this.createMovableDecor('apothecary-cabinet',390,865,'Study Apothecary',()=>{const c=this.add.container(0,0);c.add(shadow(190,44));c.add(this.add.rectangle(0,-10,170,190,0x211319,.99).setStrokeStyle(4,gold,.48));[-62,-8,46].forEach(y=>c.add(this.add.rectangle(0,y,148,6,0x67462f,.80)));const colors=[0x7b67d5,0x55a5a4,0xb85e89,0xd18d4b,0x678653,0x8d609e];for(let r=0;r<3;r++)for(let i=0;i<4;i++){const b=this.add.circle(-55+i*37,-82+r*54,10,colors[(r*4+i)%colors.length],.88).setStrokeStyle(1,0xefd09b,.48);c.add(b);c.add(this.add.rectangle(-55+i*37,-96+r*54,7,8,0xd4b77d,.85));}return c},()=>this.openCrystalFocus());
};

Game.prototype.v3310SetPetDepths = function()
{
    const rows=[['luna','lunaGlow','lunaName','lunaType'],['ember','emberGlow','emberName','emberType'],['nova','novaGlow','novaName','novaType'],['mallow','mallowGlow','mallowName','mallowType']];
    rows.forEach(([p,g,n,t])=>{if(this[p])this[p].setDepth(70);if(this[g])this[g].setDepth(62);if(this[n])this[n].setDepth(92);if(this[t])this[t].setDepth(92)});
};

Game.prototype.chooseLunaBehavior = function(){const r=Phaser.Math.Between(0,9);if(r<=5)return this.lunaWalk();if(r===6)return this.lunaHop();if(r===7)return this.lunaSit();return this.lunaSleep()};
Game.prototype.chooseEmberBehavior = function(){const r=Phaser.Math.Between(0,9);if(r<=2)return this.emberWalk();if(r<=5)return this.emberSlither();if(r===6)return this.emberFly();if(r===7)return this.emberHop();if(r===8)return this.emberSit();return this.emberSleep()};
Game.prototype.chooseNovaBehavior = function(){const r=Phaser.Math.Between(0,9);if(r<=2)return this.novaWalk();if(r<=5)return this.novaRun();if(r===6)return this.novaPounce();if(r===7)return this.novaHop();if(r===8)return this.novaSpin();return this.novaSit()};
Game.prototype.chooseMallowBehavior = function(){const r=Phaser.Math.Between(0,9);if(r<=3)return this.mallowHop();if(r<=6)return this.mallowFly();if(r===7)return this.mallowBinky();if(r===8)return this.mallowPaw();return this.mallowSit()};

Game.prototype.v3310StartMotionDirector = function()
{
    this.v3310SetPetDepths();
    this.time.delayedCall(650,()=>{if(this.luna&&this.luna.input?.enabled!==false)this.lunaWalk()});
    this.time.delayedCall(1050,()=>{if(this.ember&&this.ember.input?.enabled!==false)this.emberSlither()});
    this.time.delayedCall(1450,()=>{if(this.nova&&this.nova.input?.enabled!==false)this.novaRun()});
    this.time.delayedCall(1850,()=>{if(this.mallow&&this.mallow.input?.enabled!==false)this.mallowFly()});
    this.v3310LastPositions={};
    this.v3310MotionWatchdog=this.time.addEvent({delay:5200,loop:true,callback:()=>{
        const defs=[
          ['luna','lunaMoveTween','lunaNextTimer','lunaWalk'],['ember','emberMoveTween','emberNextTimer','emberWalk'],['nova','novaMoveTween','novaNextTimer','novaRun'],['mallow','mallowMoveTween','mallowNextTimer','mallowHop']
        ];
        defs.forEach(([petKey,tweenKey,timerKey,moveKey])=>{
            const pet=this[petKey];if(!pet||pet.input?.enabled===false)return;
            const prev=this.v3310LastPositions[petKey];this.v3310LastPositions[petKey]={x:pet.x,y:pet.y,at:Date.now()};
            const moving=!!(this[tweenKey]&&this[tweenKey].isPlaying&&this[tweenKey].isPlaying());
            const timer=!!this[timerKey];
            if(!moving&&!timer&&typeof this[moveKey]==='function')this[moveKey]();
            if(prev&&Math.abs(prev.x-pet.x)<2&&Math.abs(prev.y-pet.y)<2&&!moving&&typeof this[moveKey]==='function')this[moveKey]();
        });
        this.v3310SetPetDepths();
    }});
};

const _v3310CreateBase=Game.prototype.create;
Game.prototype.create=function()
{
    _v3310CreateBase.call(this);
    this.v3310StartMotionDirector();
};

try
{
    const liveGame=window.majickPhaserGame;
    const liveScene=liveGame?.scene?.getScene('Game');
    if(liveScene && liveScene.scene) liveScene.scene.restart();
}
catch(e)
{
    console.warn('V3.3.10 sanctuary restart', e);
}
