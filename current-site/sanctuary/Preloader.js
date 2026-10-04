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

        const base = './assets/runtime-motion/';

        // Local academy art keeps the room feeling like a real magical college.
        this.load.image('academy-sanctuary-bg', '../assets/academy_hero.jpg');
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