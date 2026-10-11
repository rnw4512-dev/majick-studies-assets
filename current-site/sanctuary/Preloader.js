class Preloader extends Phaser.Scene
{
    constructor()
    {
        super('Preloader');
    }

    preload()
    {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.add.text(w / 2, h / 2 - 44, 'Awakening the familiars…', {
            fontFamily: 'Georgia', fontSize: '26px', color: '#f4d19a'
        }).setOrigin(0.5);
        const track = this.add.rectangle(w / 2, h / 2 + 6, 430, 16, 0x2f1938, 0.95);
        track.setStrokeStyle(2, 0xe0b776, 0.45);
        const bar = this.add.rectangle(w / 2 - 211, h / 2 + 6, 1, 10, 0xe0b776, 0.95).setOrigin(0, 0.5);
        const percent = this.add.text(w / 2, h / 2 + 42, '0%', {
            fontFamily: 'Arial', fontSize: '14px', color: '#f7e9f1'
        }).setOrigin(0.5);
        this.load.on('progress', value => { bar.width = Math.max(1, 422 * value); percent.setText(Math.round(value * 100) + '%'); });
        this.load.on('complete', () => { const n = document.getElementById('phaser-load-note'); if (n) n.style.display = 'none'; });
        this.load.on('loaderror', file => console.warn('Sanctuary asset failed to load:', file && file.key));

        this.load.image('reward-solstice-reading-chaise', '../assets/rewards/solstice/items/reading-chaise.webp');
        this.load.image('reward-solstice-star-pouf', '../assets/rewards/solstice/items/star-pouf.webp');
        this.load.image('reward-solstice-explorer-telescope', '../assets/rewards/solstice/items/explorer-telescope.webp');
        this.load.image('reward-solstice-starlight-hammock', '../assets/rewards/solstice/items/starlight-hammock.webp');
        this.load.image('reward-solstice-galaxy-vanity', '../assets/rewards/solstice/items/galaxy-vanity.webp');
        this.load.image('reward-solstice-nebula-bowl', '../assets/rewards/solstice/items/nebula-bowl.webp');
        this.load.image('reward-solstice-solar-orrery', '../assets/rewards/solstice/items/solar-orrery.webp');
        this.load.image('reward-solstice-astronomy-bookshelf', '../assets/rewards/solstice/items/astronomy-bookshelf.webp');
        this.load.image('reward-solstice-fox-star-den', '../assets/rewards/solstice/items/fox-star-den.webp');
        this.load.image('reward-solstice-constellation-rug', '../assets/rewards/solstice/items/constellation-rug.webp');
        this.load.image('reward-solstice-exploration-chest', '../assets/rewards/solstice/items/exploration-chest.webp');
        this.load.image('reward-solstice-planet-climbing-tower', '../assets/rewards/solstice/items/planet-climbing-tower.webp');
        this.load.image('reward-solstice-amber-canopy-bed', '../assets/rewards/solstice/items/amber-canopy-bed.webp');
        this.load.image('reward-solstice-star-perch-tree', '../assets/rewards/solstice/items/star-perch-tree.webp');
        this.load.image('reward-solstice-moon-writing-desk', '../assets/rewards/solstice/items/moon-writing-desk.webp');
        this.load.image('reward-solstice-fox-ear-reading-chair', '../assets/rewards/solstice/items/fox-ear-reading-chair.webp');
        this.load.image('reward-solstice-crescent-lantern', '../assets/rewards/solstice/items/crescent-lantern.webp');
        this.load.image('reward-solstice-astral-doorway', '../assets/rewards/solstice/items/astral-doorway.webp');
        this.load.image('reward-solstice-galaxy-folding-screen', '../assets/rewards/solstice/items/galaxy-folding-screen.webp');
        this.load.image('reward-solstice-orbit-play-ball', '../assets/rewards/solstice/items/orbit-play-ball.webp');
        this.load.image('reward-solstice-star-charm-rack', '../assets/rewards/solstice/items/star-charm-rack.webp');
        this.load.image('reward-solstice-solar-circlet', '../assets/rewards/solstice/items/solar-circlet.webp');
        this.load.image('reward-solstice-moon-collar', '../assets/rewards/solstice/items/moon-collar.webp');
        this.load.image('reward-solstice-nebula-wand', '../assets/rewards/solstice/items/nebula-wand.webp');
        this.load.image('reward-solstice-star-glasses', '../assets/rewards/solstice/items/star-glasses.webp');
        this.load.image('reward-solstice-orbit-bracelet', '../assets/rewards/solstice/items/orbit-bracelet.webp');
        this.load.image('reward-solstice-explorer-satchel', '../assets/rewards/solstice/items/explorer-satchel.webp');
        this.load.image('reward-solstice-galaxy-cape', '../assets/rewards/solstice/items/galaxy-cape.webp');
        this.load.image('reward-solstice-astronomy-book-stack', '../assets/rewards/solstice/items/astronomy-book-stack.webp');
        this.load.image('reward-solstice-planet-mobile', '../assets/rewards/solstice/items/planet-mobile.webp');
        this.load.image('reward-solstice-starlight-tea-table', '../assets/rewards/solstice/items/starlight-tea-table.webp');
        this.load.image('reward-solstice-cosmic-orbit-puzzle', '../assets/rewards/solstice/items/cosmic-orbit-puzzle.webp');
        this.load.image('reward-solstice-sun-globe-lamp', '../assets/rewards/solstice/items/sun-globe-lamp.webp');
        this.load.image('reward-solstice-celestial-fox-gateway', '../assets/rewards/solstice/items/celestial-fox-gateway.webp');
        this.load.image('reward-velvet-study-chair', '../assets/rewards/items/velvet-study-chair.webp');
        this.load.image('reward-constellation-rug', '../assets/rewards/items/constellation-rug.webp');
        this.load.image('reward-moon-phase-wall-hanging', '../assets/rewards/items/moon-phase-wall-hanging.webp');
        this.load.image('reward-potion-shelf', '../assets/rewards/items/potion-shelf.webp');
        this.load.image('reward-crystal-lamp', '../assets/rewards/items/crystal-lamp.webp');
        this.load.image('reward-floating-book-stack', '../sanctuary/assets/runtime-objects/enchanted-bookstack.webp');
        this.load.image('reward-celestial-telescope', '../sanctuary/assets/runtime-objects/celestial-telescope.webp');
        this.load.image('reward-guardian-toy-chest', '../assets/rewards/items/guardian-toy-chest.webp');
        this.load.image('reward-enchanted-fireplace', '../assets/rewards/items/enchanted-fireplace.webp');
        this.load.image('reward-moonflower-planter', '../assets/rewards/items/moonflower-planter.webp');
        this.load.image('reward-canopy-bed-curtains', '../assets/rewards/items/canopy-bed-curtains.webp');
        this.load.image('reward-rune-writing-desk', '../sanctuary/assets/runtime-objects/moonlit-study-desk.webp');
        this.load.image('reward-memory-moon-brooch', '../assets/rewards/items/memory-moon-brooch.webp');
        this.load.image('reward-scholar-rune-circlet', '../assets/rewards/items/scholar-rune-circlet.webp');
        this.load.image('reward-fortune-seer-monocle', '../assets/rewards/items/fortune-seer-monocle.webp');
        this.load.image('reward-celestial-dice-charm', '../assets/rewards/items/celestial-dice-charm.webp');
        this.load.image('reward-star-cartographer-glasses', '../assets/rewards/items/star-cartographer-glasses.webp');
        this.load.image('reward-probability-scholar-cape', '../assets/rewards/items/probability-scholar-cape.webp');
        const base = './assets/runtime-motion/';

        // Local academy art keeps the room feeling like a real magical college.
        this.load.image('academy-sanctuary-bg', '../assets/guardian-dorm-v1.png');
        // V3.3.14 MANIFEST OBJECTS START
        this.load.json('majick-object-manifest', './assets/objects/objects-manifest.json?v=3314');
        this.load.json('majick-evolution-manifest', './assets/evolutions/evolution-manifest.json?v=3315');
        this.load.image('obj-arcane-stacks', './assets/runtime-objects/enchanted-bookstack.webp?v=3317-fast');
        this.load.image('obj-moonlit-study-desk', './assets/runtime-objects/moonlit-study-desk.webp?v=3317-fast');
        this.load.image('obj-observatory-telescope', './assets/runtime-objects/celestial-telescope.webp?v=3317-fast');
        this.load.image('obj-crystal-focus-pedestal', './assets/runtime-objects/crystal-focus-pedestal.webp?v=3317-fast');
        this.load.image('obj-moonstone-crystal-bed', './assets/runtime-objects/moonstone-canopy-bed.webp?v=3317-fast');
        this.load.image('obj-amethyst-crystal-bed', './assets/runtime-objects/amethyst-crystal-bed.webp?v=3317-fast');
        this.load.image('obj-study-apothecary', './assets/runtime-objects/study-apothecary.webp?v=3317-fast');
        this.load.image('obj-familiar-lounge', './assets/runtime-objects/familiar-lounge.webp?v=3317-fast');
        this.load.image('obj-magic-mirror', './assets/runtime-objects/magic-mirror.webp?v=3317-fast');
        this.load.image('obj-guardian-food-bowl', './assets/runtime-objects/guardian-food-bowl.webp?v=3317-fast');
        this.load.image('obj-guardian-water-basin', './assets/runtime-objects/guardian-water-basin.webp?v=3317-fast');
        this.load.image('obj-guardian-toy-basket', './assets/runtime-objects/guardian-toy-basket.webp?v=3317-fast');
        this.load.image('obj-guardian-brush', './assets/runtime-objects/guardian-brush.webp?v=3317-fast');
        this.load.image('obj-guardian-treat-jar', './assets/runtime-objects/guardian-treat-jar.webp?v=3317-fast');
        this.load.image('obj-guardian-play-rug', './assets/runtime-objects/guardian-play-rug.webp?v=3317-fast');
        // V3.3.14 MANIFEST OBJECTS END


        // =====================================================
        // LUNA
        // =====================================================

        this.load.image('luna-idle', base + 'luna-idle.webp');
        this.load.image('luna-walk-1', base + 'luna-walk-1.webp');
        this.load.image('luna-walk-2', base + 'luna-walk-2.webp');
        this.load.image('luna-hop', base + 'luna-hop.webp');

        // Keep the safe Luna fallbacks that were working.
        this.load.image('luna-paw', base + 'luna-hop.webp');
        this.load.image('luna-sit', base + 'luna-idle.webp');
        this.load.image('luna-sleep', base + 'luna-idle.webp');


        // =====================================================
        // EMBER
        // =====================================================

        this.load.image('ember-idle', base + 'ember-idle.webp');
        this.load.image('ember-walk-1', base + 'ember-walk-1.webp');
        this.load.image('ember-walk-2', base + 'ember-walk-2.webp');
        this.load.image('ember-hop', base + 'ember-hop.webp');
        this.load.image('ember-slither-1', base + 'ember-slither-1.webp');
        this.load.image('ember-slither-2', base + 'ember-slither-2.webp');
        this.load.image('ember-sit', base + 'ember-sit.webp');
        this.load.image('ember-sleep', base + 'ember-sleep.webp');


        // =====================================================
        // NOVA
        // =====================================================

        // IMPORTANT:
        // Preserve the fallback that previously allowed the game to run.
        // We will repair Nova separately after Mallow is working.
        this.load.image('nova-idle', base + 'nova-sit.webp');

        this.load.image('nova-walk-1', base + 'nova-walk-1.webp');
        this.load.image('nova-walk-2', base + 'nova-walk-2.webp');
        this.load.image('nova-run', base + 'nova-run.webp');
        this.load.image('nova-hop', base + 'nova-hop.webp');
        this.load.image('nova-paw', base + 'nova-paw.webp');
        this.load.image('nova-spin', base + 'nova-spin.webp');
        this.load.image('nova-sit', base + 'nova-sit.webp');
        this.load.image('nova-sleep', base + 'nova-sleep.webp');
        this.load.image('nova-pounce', base + 'nova-pounce.webp');
        this.load.image('nova-pounce2', base + 'nova-pounce2.webp');
        this.load.image('nova-pounce3', base + 'nova-pounce3.webp');


        // =====================================================
        // MALLOW
        // =====================================================

        this.load.image('mallow-idle', base + 'mallow-idle.webp');
        this.load.image('mallow-hop-1', base + 'mallow-hop-1.webp');
        this.load.image('mallow-hop-2', base + 'mallow-hop-2.webp');
        this.load.image('mallow-fly-1', base + 'mallow-fly-1.webp');
        this.load.image('mallow-fly-2', base + 'mallow-fly-2.webp');
        this.load.image('mallow-paw', base + 'mallow-paw.webp');
        this.load.image('mallow-sit', base + 'mallow-sit.webp');
        this.load.image('mallow-sleep', base + 'mallow-sleep.webp');
        this.load.image('mallow-land', base + 'mallow-land.webp');
        this.load.image('mallow-binky', base + 'mallow-binky.webp');
    }

    create()
    {
        this.scene.start('Game');
    }
}
