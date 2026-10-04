class Game extends Phaser.Scene
{
    constructor()
    {
        super('Game');

        this.worldWidth = 2200;
        this.worldHeight = 960;

        this.draggingCamera = false;
        this.lastPointerX = 0;
        this.lastPointerY = 0;

        this.mirrorPanel = null;
        this.interactionPanel = null;
        this.decorItems = [];
        this.editMode = false;
        this.initialCameraFitDone = false;

        // V3.3.7 familiar × object interaction state.
        // These interactions are intentionally cosmetic/cozy: no hunger, sickness,
        // punishment, lost XP, or care debt can be created here.
        this.petInteractionTokens = {};
        this.objectInteractionStoreKey = 'majick-sanctuary-object-interactions-v1';

        // LUNA
        this.luna = null;
        this.lunaState = 'idle';
        this.lunaMoveTween = null;
        this.lunaFrameTimer = null;
        this.lunaNextTimer = null;

        // EMBER
        this.ember = null;
        this.emberState = 'idle';
        this.emberMoveTween = null;
        this.emberFrameTimer = null;
        this.emberNextTimer = null;

        // NOVA
        this.nova = null;
        this.novaState = 'idle';
        this.novaMoveTween = null;
        this.novaFrameTimer = null;
        this.novaNextTimer = null;
        this.novaActionTimers = [];

        // MALLOW
        this.mallow = null;
        this.mallowState = 'idle';
        this.mallowMoveTween = null;
        this.mallowFrameTimer = null;
        this.mallowNextTimer = null;
        this.mallowActionTimers = [];

        // Study-app bridge state.
        this.studyState = null;
        this.hudStatusText = null;
    }

    create()
    {
        const camera = this.cameras.main;

        camera.setBounds(0, 0, this.worldWidth, this.worldHeight);
        camera.setBackgroundColor('#120817');

        this.createBackground();
        this.createMagicMirror();

        this.createLuna();
        this.createEmber();
        this.createNova();
        this.createMallow();

        this.createDecor();
        this.createInteractiveZones();
        this.setupCameraControls();
        this.fitRoomToView();
        this.createHUD();

        if (window.majickPendingState)
        {
            this.applyStudyState(window.majickPendingState);
        }

        this.events.on('update', () =>
        {
            this.syncPetUI();
        });
    }

    // =========================================================
    // BACKGROUND
    // =========================================================

    createBackground()
    {
        // A real magical-college room instead of the flat placeholder arches.
        if (this.textures.exists('academy-sanctuary-bg'))
        {
            const backdrop = this.add.image(
                this.worldWidth / 2,
                330,
                'academy-sanctuary-bg'
            );

            // Preserve the art's proportions, then let the room floor continue below it.
            backdrop.setDisplaySize(this.worldWidth, 663);
            backdrop.setDepth(-20);
        }
        else
        {
            this.add.rectangle(
                this.worldWidth / 2,
                330,
                this.worldWidth,
                663,
                0x21102e
            ).setDepth(-20);
        }

        // Dark glazing keeps the familiars readable while preserving the collegiate art.
        this.add.rectangle(
            this.worldWidth / 2,
            330,
            this.worldWidth,
            663,
            0x120817,
            0.20
        ).setDepth(-19);

        // Polished walnut / plum floor below the window-and-library wall.
        this.add.rectangle(
            this.worldWidth / 2,
            812,
            this.worldWidth,
            297,
            0x20101f
        ).setDepth(-18);

        for (let x = 0; x < this.worldWidth; x += 145)
        {
            this.add.rectangle(
                x + 72,
                812,
                140,
                297,
                (x / 145) % 2 === 0 ? 0x2a1528 : 0x251222,
                0.96
            ).setStrokeStyle(1, 0x6d465d, 0.17).setDepth(-17);
        }

        // Large celestial common-room rug.
        const rug = this.add.ellipse(
            1100,
            795,
            1560,
            245,
            0x6d315b,
            0.62
        ).setDepth(-16);

        rug.setStrokeStyle(5, 0xd0a06f, 0.55);

        this.add.ellipse(
            1100,
            795,
            1320,
            195,
            0x32162f,
            0.42
        ).setStrokeStyle(2, 0xe4c394, 0.36).setDepth(-15);

        // Ambient motes make the room feel alive without covering the artwork.
        for (let i = 0; i < 46; i++)
        {
            const light = this.add.circle(
                Phaser.Math.Between(80, this.worldWidth - 80),
                Phaser.Math.Between(90, 760),
                Phaser.Math.Between(2, 5),
                Phaser.Math.RND.pick([
                    0xffd89e,
                    0xf0b7df,
                    0xb8dcff,
                    0xd4b4ff
                ]),
                Phaser.Math.FloatBetween(0.20, 0.55)
            ).setDepth(-10);

            this.tweens.add({
                targets: light,
                y: light.y - Phaser.Math.Between(18, 55),
                x: light.x + Phaser.Math.Between(-20, 20),
                alpha: 0.08,
                duration: Phaser.Math.Between(2200, 4800),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.inOut'
            });
        }
    }

    // =========================================================
    // PET HELPERS
    // =========================================================

    setPetTexture(pet, textureKey, targetHeight)
    {
        if (!pet)
        {
            return;
        }

        if (!this.textures.exists(textureKey))
        {
            console.warn('Missing texture:', textureKey);
            return;
        }

        const flipped = pet.flipX;

        pet.setTexture(textureKey);

        const source =
            this.textures
                .get(textureKey)
                .getSourceImage();

        if (source && source.height)
        {
            const scale =
                targetHeight / source.height;

            pet.setScale(scale);
        }

        pet.setFlipX(flipped);
    }

    syncPetUI()
    {
        if (this.luna)
        {
            this.lunaGlow.x = this.luna.x;
            this.lunaName.x = this.luna.x;
            this.lunaType.x = this.luna.x;
        }

        if (this.ember)
        {
            this.emberGlow.x = this.ember.x;
            this.emberName.x = this.ember.x;
            this.emberType.x = this.ember.x;
        }

        if (this.nova)
        {
            this.novaGlow.x = this.nova.x;
            this.novaName.x = this.nova.x;
            this.novaType.x = this.nova.x;
        }

        if (this.mallow)
        {
            this.mallowGlow.x = this.mallow.x;
            this.mallowName.x = this.mallow.x;
            this.mallowType.x = this.mallow.x;
        }
    }

    createPetLabels(x, name, type, typeColor)
    {
        const nameText = this.add.text(
            x,
            735,
            name,
            {
                fontFamily: 'Georgia',
                fontSize: '24px',
                color: '#fff0d5',
                backgroundColor: '#170a20dd',
                padding:
                {
                    x: 12,
                    y: 5
                }
            }
        ).setOrigin(0.5);

        const typeText = this.add.text(
            x,
            770,
            type,
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: typeColor
            }
        ).setOrigin(0.5);

        return {
            nameText,
            typeText
        };
    }

    // =========================================================
    // LUNA
    // =========================================================

    createLuna()
    {
        if (!this.textures.exists('luna-idle'))
        {
            return;
        }

        this.lunaGlow = this.add.ellipse(
            430,
            710,
            250,
            110,
            0xb55fc1,
            0.17
        );

        this.luna = this.add.image(
            430,
            610,
            'luna-idle'
        );

        this.luna.homeY = 610;

        this.setPetTexture(
            this.luna,
            'luna-idle',
            245
        );

        this.luna.setInteractive({
            useHandCursor: true
        });

        const labels = this.createPetLabels(
            430,
            'Velora',
            'Moon Cat • Celestial Familiar',
            '#e3bdd7'
        );

        this.lunaName = labels.nameText;
        this.lunaType = labels.typeText;

        this.tweens.add({
            targets: this.lunaGlow,
            scaleX: 1.15,
            scaleY: 1.15,
            alpha: 0.06,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        this.luna.on(
            'pointerdown',
            () =>
            {
                this.lunaReaction();
            }
        );

        this.lunaIdle();
    }

    clearLunaAction()
    {
        if (this.lunaMoveTween)
        {
            this.lunaMoveTween.stop();
            this.lunaMoveTween = null;
        }

        if (this.lunaFrameTimer)
        {
            this.lunaFrameTimer.remove();
            this.lunaFrameTimer = null;
        }

        if (this.lunaNextTimer)
        {
            this.lunaNextTimer.remove();
            this.lunaNextTimer = null;
        }

        if (this.luna)
        {
            this.tweens.killTweensOf(this.luna);
        }
    }

    lunaIdle()
    {
        if (!this.luna) return;

        this.clearLunaAction();

        this.lunaState = 'idle';

        this.setPetTexture(
            this.luna,
            'luna-idle',
            245
        );

        this.luna.y = this.luna.homeY;

        this.tweens.add({
            targets: this.luna,
            y: this.luna.homeY - 4,
            duration: 1200,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.inOut'
        });

        this.lunaNextTimer = this.time.delayedCall(
            Phaser.Math.Between(1700, 3000),
            () =>
            {
                this.chooseLunaBehavior();
            }
        );
    }

    chooseLunaBehavior()
    {
        const choice = Phaser.Math.Between(0, 4);

        if (choice <= 1)
        {
            this.lunaWalk();
        }
        else if (choice === 2)
        {
            this.lunaSit();
        }
        else if (choice === 3)
        {
            this.lunaSleep();
        }
        else
        {
            this.lunaHop();
        }
    }

    lunaWalk()
    {
        if (!this.luna) return;

        this.clearLunaAction();

        this.lunaState = 'walk';

        const targetX =
            Phaser.Math.Between(280, 680);

        this.luna.setFlipX(
            targetX < this.luna.x
        );

        let toggle = false;

        this.lunaFrameTimer = this.time.addEvent({
            delay: 190,
            loop: true,

            callback: () =>
            {
                toggle = !toggle;

                this.setPetTexture(
                    this.luna,
                    toggle
                        ? 'luna-walk-1'
                        : 'luna-walk-2',
                    250
                );
            }
        });

        const distance =
            Math.abs(targetX - this.luna.x);

        this.lunaMoveTween = this.tweens.add({
            targets: this.luna,
            x: targetX,

            duration:
                Math.max(
                    1700,
                    distance * 7
                ),

            ease: 'Sine.inOut',

            onComplete: () =>
            {
                this.lunaIdle();
            }
        });
    }

    lunaSit()
    {
        if (!this.luna) return;

        this.clearLunaAction();

        this.setPetTexture(
            this.luna,
            'luna-sit',
            250
        );

        this.lunaNextTimer =
            this.time.delayedCall(
                2400,
                () =>
                {
                    this.lunaIdle();
                }
            );
    }

    lunaSleep()
    {
        if (!this.luna) return;

        this.clearLunaAction();

        this.setPetTexture(
            this.luna,
            'luna-sleep',
            230
        );

        this.createSleepText(
            this.luna,
            '#d9c4ff'
        );

        this.lunaNextTimer =
            this.time.delayedCall(
                4200,
                () =>
                {
                    this.lunaIdle();
                }
            );
    }

    lunaHop()
    {
        if (!this.luna) return;

        this.clearLunaAction();

        this.setPetTexture(
            this.luna,
            'luna-hop',
            250
        );

        this.createSparkles(
            this.luna.x,
            this.luna.y - 70,
            9
        );

        this.tweens.add({
            targets: this.luna,
            y: this.luna.homeY - 65,
            duration: 280,
            yoyo: true,
            ease: 'Sine.out',

            onComplete: () =>
            {
                this.lunaIdle();
            }
        });
    }

    lunaReaction()
    {
        if (!this.luna) return;

        this.clearLunaAction();

        this.setPetTexture(
            this.luna,
            'luna-paw',
            250
        );

        this.createSparkles(
            this.luna.x,
            this.luna.y - 80,
            15
        );

        this.showPetMessage(
            this.luna,
            '♡ Velora likes that ♡',
            '#421a50dd'
        );

        this.lunaNextTimer =
            this.time.delayedCall(
                1200,
                () =>
                {
                    this.lunaHop();
                }
            );
    }

    // =========================================================
    // EMBER
    // =========================================================

    createEmber()
    {
        if (!this.textures.exists('ember-idle'))
        {
            return;
        }

        this.emberGlow = this.add.ellipse(
            930,
            710,
            260,
            110,
            0x54d3df,
            0.17
        );

        this.ember = this.add.image(
            930,
            610,
            'ember-idle'
        );

        this.ember.homeY = 610;

        this.setPetTexture(
            this.ember,
            'ember-idle',
            255
        );

        this.ember.setInteractive({
            useHandCursor: true
        });

        const labels = this.createPetLabels(
            930,
            'Cascade',
            'Pocket Dragon • Celestial Familiar',
            '#bde8ee'
        );

        this.emberName = labels.nameText;
        this.emberType = labels.typeText;

        this.tweens.add({
            targets: this.emberGlow,
            scale: 1.15,
            alpha: 0.06,
            duration: 1300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        this.ember.on(
            'pointerdown',
            () =>
            {
                this.emberReaction();
            }
        );

        this.emberIdle();
    }

    clearEmberAction()
    {
        if (this.emberMoveTween)
        {
            this.emberMoveTween.stop();
            this.emberMoveTween = null;
        }

        if (this.emberFrameTimer)
        {
            this.emberFrameTimer.remove();
            this.emberFrameTimer = null;
        }

        if (this.emberNextTimer)
        {
            this.emberNextTimer.remove();
            this.emberNextTimer = null;
        }

        if (this.ember)
        {
            this.tweens.killTweensOf(this.ember);
        }
    }

    emberIdle()
    {
        if (!this.ember) return;

        this.clearEmberAction();

        this.emberState = 'idle';

        this.setPetTexture(
            this.ember,
            'ember-idle',
            255
        );

        this.ember.y = this.ember.homeY;

        this.tweens.add({
            targets: this.ember,
            y: this.ember.homeY - 5,
            duration: 900,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.inOut'
        });

        this.emberNextTimer =
            this.time.delayedCall(
                Phaser.Math.Between(1300, 2600),

                () =>
                {
                    this.chooseEmberBehavior();
                }
            );
    }

    chooseEmberBehavior()
    {
        const choice =
            Phaser.Math.Between(0, 7);

        if (choice <= 1)
        {
            this.emberWalk();
        }
        else if (choice <= 3)
        {
            this.emberSlither();
        }
        else if (choice === 4)
        {
            this.emberFly();
        }
        else if (choice === 5)
        {
            this.emberHop();
        }
        else if (choice === 6)
        {
            this.emberSit();
        }
        else
        {
            this.emberSleep();
        }
    }

    emberWalk()
    {
        if (!this.ember) return;

        this.clearEmberAction();

        const targetX =
            Phaser.Math.Between(720, 1160);

        this.ember.setFlipX(
            targetX < this.ember.x
        );

        let toggle = false;

        this.emberFrameTimer =
            this.time.addEvent({
                delay: 190,
                loop: true,

                callback: () =>
                {
                    toggle = !toggle;

                    this.setPetTexture(
                        this.ember,

                        toggle
                            ? 'ember-walk-1'
                            : 'ember-walk-2',

                        255
                    );
                }
            });

        this.emberMoveTween =
            this.tweens.add({
                targets: this.ember,
                x: targetX,

                duration:
                    Math.max(
                        1500,
                        Math.abs(
                            targetX -
                            this.ember.x
                        ) * 6
                    ),

                ease: 'Sine.inOut',

                onComplete: () =>
                {
                    this.emberIdle();
                }
            });
    }

    emberSlither()
    {
        if (!this.ember) return;

        this.clearEmberAction();

        const targetX =
            Phaser.Math.Between(700, 1180);

        this.ember.setFlipX(
            targetX < this.ember.x
        );

        let toggle = false;

        this.emberFrameTimer =
            this.time.addEvent({
                delay: 160,
                loop: true,

                callback: () =>
                {
                    toggle = !toggle;

                    this.setPetTexture(
                        this.ember,

                        toggle
                            ? 'ember-slither-1'
                            : 'ember-slither-2',

                        245
                    );
                }
            });

        this.emberMoveTween =
            this.tweens.add({
                targets: this.ember,
                x: targetX,
                y: this.ember.homeY + 18,
                duration: 1900,
                ease: 'Sine.inOut',

                onComplete: () =>
                {
                    this.emberIdle();
                }
            });
    }

    emberHop()
    {
        if (!this.ember) return;

        this.clearEmberAction();

        this.setPetTexture(
            this.ember,
            'ember-hop',
            260
        );

        this.createSparkles(
            this.ember.x,
            this.ember.y - 70,
            10
        );

        this.tweens.add({
            targets: this.ember,
            y: this.ember.homeY - 75,
            duration: 270,
            yoyo: true,
            ease: 'Sine.out',

            onComplete: () =>
            {
                this.emberIdle();
            }
        });
    }

    emberFly()
    {
        if (!this.ember) return;

        this.clearEmberAction();

        this.setPetTexture(
            this.ember,
            'ember-hop',
            265
        );

        const targetX =
            Phaser.Math.Between(730, 1180);

        this.ember.setFlipX(
            targetX < this.ember.x
        );

        this.createSparkles(
            this.ember.x,
            this.ember.y - 60,
            12
        );

        this.tweens.add({
            targets: this.ember,
            y: this.ember.homeY - 125,
            duration: 420,
            ease: 'Sine.out',

            onComplete: () =>
            {
                this.emberMoveTween =
                    this.tweens.add({
                        targets: this.ember,
                        x: targetX,
                        y: this.ember.homeY - 145,
                        duration: 1400,
                        ease: 'Sine.inOut',

                        onComplete: () =>
                        {
                            this.tweens.add({
                                targets: this.ember,
                                y: this.ember.homeY,
                                duration: 450,
                                ease: 'Sine.in',

                                onComplete: () =>
                                {
                                    this.createSparkles(
                                        this.ember.x,
                                        this.ember.y,
                                        8
                                    );

                                    this.emberIdle();
                                }
                            });
                        }
                    });
            }
        });
    }

    emberSit()
    {
        if (!this.ember) return;

        this.clearEmberAction();

        this.setPetTexture(
            this.ember,
            'ember-sit',
            255
        );

        this.emberNextTimer =
            this.time.delayedCall(
                2300,
                () =>
                {
                    this.emberIdle();
                }
            );
    }

    emberSleep()
    {
        if (!this.ember) return;

        this.clearEmberAction();

        this.setPetTexture(
            this.ember,
            'ember-sleep',
            240
        );

        this.createSleepText(
            this.ember,
            '#bfeaff'
        );

        this.emberNextTimer =
            this.time.delayedCall(
                4200,
                () =>
                {
                    this.emberIdle();
                }
            );
    }

    emberReaction()
    {
        if (!this.ember) return;

        this.clearEmberAction();

        this.setPetTexture(
            this.ember,
            'ember-hop',
            260
        );

        this.createSparkles(
            this.ember.x,
            this.ember.y - 80,
            18
        );

        this.showPetMessage(
            this.ember,
            '✦ Cascade is excited! ✦',
            '#23445cdd'
        );

        this.emberNextTimer =
            this.time.delayedCall(
                1100,
                () =>
                {
                    this.emberFly();
                }
            );
    }

    // =========================================================
    // NOVA
    // =========================================================

    createNova()
    {
        if (!this.textures.exists('nova-idle'))
        {
            this.add.text(
                1430,
                600,
                'Solstice artwork did not load',
                {
                    fontFamily: 'Georgia',
                    fontSize: '22px',
                    color: '#ffc578'
                }
            );

            return;
        }

        this.novaGlow = this.add.ellipse(
            1430,
            710,
            275,
            115,
            0xf6a34e,
            0.16
        );

        this.nova = this.add.image(
            1430,
            610,
            'nova-idle'
        );

        this.nova.homeY = 610;

        this.setPetTexture(
            this.nova,
            'nova-idle',
            255
        );

        this.nova.setInteractive({
            useHandCursor: true
        });

        const labels = this.createPetLabels(
            1430,
            'Solstice',
            'Star Fox • Celestial Familiar',
            '#ffd4a5'
        );

        this.novaName = labels.nameText;
        this.novaType = labels.typeText;

        this.tweens.add({
            targets: this.novaGlow,
            scale: 1.18,
            alpha: 0.05,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        this.nova.on(
            'pointerdown',
            () =>
            {
                this.novaReaction();
            }
        );

        this.novaIdle();
    }

    clearNovaAction()
    {
        if (this.novaMoveTween)
        {
            this.novaMoveTween.stop();
            this.novaMoveTween = null;
        }

        if (this.novaFrameTimer)
        {
            this.novaFrameTimer.remove();
            this.novaFrameTimer = null;
        }

        if (this.novaNextTimer)
        {
            this.novaNextTimer.remove();
            this.novaNextTimer = null;
        }

        this.novaActionTimers.forEach(
            timer =>
            {
                if (timer)
                {
                    timer.remove();
                }
            }
        );

        this.novaActionTimers = [];

        if (this.nova)
        {
            this.tweens.killTweensOf(
                this.nova
            );

            this.nova.angle = 0;
        }
    }

    novaIdle()
    {
        if (!this.nova) return;

        this.clearNovaAction();

        this.novaState = 'idle';

        this.setPetTexture(
            this.nova,
            'nova-idle',
            255
        );

        this.nova.y = this.nova.homeY;
        this.nova.angle = 0;

        this.tweens.add({
            targets: this.nova,
            y: this.nova.homeY - 4,
            duration: 900,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.inOut'
        });

        this.novaNextTimer =
            this.time.delayedCall(
                Phaser.Math.Between(1100, 2400),

                () =>
                {
                    this.chooseNovaBehavior();
                }
            );
    }

    chooseNovaBehavior()
    {
        const choice =
            Phaser.Math.Between(0, 9);

        if (choice <= 1)
        {
            this.novaWalk();
        }
        else if (choice === 2)
        {
            this.novaRun();
        }
        else if (choice === 3)
        {
            this.novaHop();
        }
        else if (choice === 4)
        {
            this.novaSpin();
        }
        else if (choice === 5)
        {
            this.novaPounce();
        }
        else if (choice === 6)
        {
            this.novaSit();
        }
        else if (choice === 7)
        {
            this.novaSleep();
        }
        else
        {
            this.novaRun();
        }
    }

    novaWalk()
    {
        if (!this.nova) return;

        this.clearNovaAction();

        this.novaState = 'walk';

        const targetX =
            Phaser.Math.Between(1210, 1690);

        this.nova.setFlipX(
            targetX < this.nova.x
        );

        let toggle = false;

        this.novaFrameTimer =
            this.time.addEvent({
                delay: 180,
                loop: true,

                callback: () =>
                {
                    toggle = !toggle;

                    this.setPetTexture(
                        this.nova,

                        toggle
                            ? 'nova-walk-1'
                            : 'nova-walk-2',

                        255
                    );
                }
            });

        this.novaMoveTween =
            this.tweens.add({
                targets: this.nova,
                x: targetX,

                duration:
                    Math.max(
                        1400,
                        Math.abs(
                            targetX -
                            this.nova.x
                        ) * 5
                    ),

                ease: 'Sine.inOut',

                onComplete: () =>
                {
                    this.novaIdle();
                }
            });
    }

    novaRun()
    {
        if (!this.nova) return;

        this.clearNovaAction();

        this.novaState = 'run';

        this.setPetTexture(
            this.nova,
            'nova-run',
            255
        );

        const targetX =
            Phaser.Math.Between(1170, 1730);

        this.nova.setFlipX(
            targetX < this.nova.x
        );

        this.createSparkles(
            this.nova.x,
            this.nova.y,
            6
        );

        this.novaMoveTween =
            this.tweens.add({
                targets: this.nova,
                x: targetX,

                duration:
                    Phaser.Math.Between(
                        650,
                        950
                    ),

                ease: 'Sine.inOut',

                onComplete: () =>
                {
                    this.createSparkles(
                        this.nova.x,
                        this.nova.y,
                        6
                    );

                    this.novaIdle();
                }
            });
    }

    novaHop()
    {
        if (!this.nova) return;

        this.clearNovaAction();

        this.novaState = 'hop';

        this.setPetTexture(
            this.nova,
            'nova-hop',
            260
        );

        this.createSparkles(
            this.nova.x,
            this.nova.y - 70,
            10
        );

        this.tweens.add({
            targets: this.nova,
            y: this.nova.homeY - 85,
            duration: 260,
            yoyo: true,
            ease: 'Sine.out',

            onComplete: () =>
            {
                this.novaIdle();
            }
        });
    }

    novaSpin()
    {
        if (!this.nova) return;

        this.clearNovaAction();

        this.novaState = 'spin';

        this.setPetTexture(
            this.nova,
            'nova-spin',
            260
        );

        this.createSparkles(
            this.nova.x,
            this.nova.y - 50,
            18
        );

        this.tweens.add({
            targets: this.nova,
            angle: 360,
            duration: 850,
            ease: 'Cubic.inOut',

            onComplete: () =>
            {
                this.nova.angle = 0;
                this.novaIdle();
            }
        });
    }

    novaSit()
    {
        if (!this.nova) return;

        this.clearNovaAction();

        this.novaState = 'sit';

        this.setPetTexture(
            this.nova,
            'nova-sit',
            255
        );

        this.novaNextTimer =
            this.time.delayedCall(
                Phaser.Math.Between(1700, 2700),

                () =>
                {
                    this.novaIdle();
                }
            );
    }

    novaSleep()
    {
        if (!this.nova) return;

        this.clearNovaAction();

        this.novaState = 'sleep';

        this.setPetTexture(
            this.nova,
            'nova-sleep',
            240
        );

        this.createSleepText(
            this.nova,
            '#ffd5ef'
        );

        this.novaNextTimer =
            this.time.delayedCall(
                Phaser.Math.Between(3200, 4700),

                () =>
                {
                    this.novaIdle();
                }
            );
    }

    novaPounce()
    {
        if (!this.nova) return;

        this.clearNovaAction();

        this.novaState = 'pounce';

        const direction =
            Phaser.Math.RND.pick([-1, 1]);

        const targetX =
            Phaser.Math.Clamp(
                this.nova.x +
                direction *
                Phaser.Math.Between(110, 180),

                1180,
                1740
            );

        this.nova.setFlipX(
            targetX < this.nova.x
        );

        this.setPetTexture(
            this.nova,
            'nova-pounce',
            250
        );

        const timer1 =
            this.time.delayedCall(
                240,

                () =>
                {
                    if (!this.nova) return;

                    this.setPetTexture(
                        this.nova,
                        'nova-pounce2',
                        260
                    );

                    this.tweens.add({
                        targets: this.nova,
                        x: targetX,
                        y: this.nova.homeY - 65,
                        duration: 300,
                        ease: 'Sine.out'
                    });
                }
            );

        const timer2 =
            this.time.delayedCall(
                560,

                () =>
                {
                    if (!this.nova) return;

                    this.setPetTexture(
                        this.nova,
                        'nova-pounce3',
                        260
                    );

                    this.tweens.add({
                        targets: this.nova,
                        y: this.nova.homeY,
                        duration: 280,
                        ease: 'Sine.in'
                    });

                    this.createSparkles(
                        this.nova.x,
                        this.nova.y,
                        12
                    );
                }
            );

        const timer3 =
            this.time.delayedCall(
                1000,

                () =>
                {
                    this.novaIdle();
                }
            );

        this.novaActionTimers.push(
            timer1,
            timer2,
            timer3
        );
    }

    novaReaction()
    {
        if (!this.nova) return;

        this.clearNovaAction();

        this.novaState = 'paw';

        this.setPetTexture(
            this.nova,
            'nova-paw',
            255
        );

        this.createSparkles(
            this.nova.x,
            this.nova.y - 85,
            18
        );

        this.showPetMessage(
            this.nova,
            '✦ Solstice wants to play! ✦',
            '#7a3c62dd'
        );

        this.novaNextTimer =
            this.time.delayedCall(
                1100,

                () =>
                {
                    this.novaPounce();
                }
            );
    }

    // =========================================================
    // MALLOW - WINGED BUNNY
    // =========================================================

    createMallow()
    {
        if (!this.textures.exists('mallow-idle'))
        {
            this.add.text(
                1880,
                600,
                'Aurelia artwork did not load',
                {
                    fontFamily: 'Georgia',
                    fontSize: '22px',
                    color: '#f7c9ef'
                }
            );

            return;
        }

        this.mallowGlow =
            this.add.ellipse(
                1880,
                710,
                275,
                115,
                0xe9a7e8,
                0.16
            );

        this.mallow =
            this.add.image(
                1880,
                610,
                'mallow-idle'
            );

        this.mallow.homeY = 610;

        this.setPetTexture(
            this.mallow,
            'mallow-idle',
            250
        );

        this.mallow.setInteractive({
            useHandCursor: true
        });

        const labels =
            this.createPetLabels(
                1880,
                'Aurelia',
                'Winged Bunny • Celestial Familiar',
                '#f5cdea'
            );

        this.mallowName =
            labels.nameText;

        this.mallowType =
            labels.typeText;

        this.tweens.add({
            targets: this.mallowGlow,
            scale: 1.18,
            alpha: 0.05,
            duration: 1250,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        this.mallow.on(
            'pointerdown',

            () =>
            {
                this.mallowReaction();
            }
        );

        this.mallowIdle();
    }

    clearMallowAction()
    {
        if (this.mallowMoveTween)
        {
            this.mallowMoveTween.stop();
            this.mallowMoveTween = null;
        }

        if (this.mallowFrameTimer)
        {
            this.mallowFrameTimer.remove();
            this.mallowFrameTimer = null;
        }

        if (this.mallowNextTimer)
        {
            this.mallowNextTimer.remove();
            this.mallowNextTimer = null;
        }

        this.mallowActionTimers.forEach(
            timer =>
            {
                if (timer)
                {
                    timer.remove();
                }
            }
        );

        this.mallowActionTimers = [];

        if (this.mallow)
        {
            this.tweens.killTweensOf(
                this.mallow
            );

            this.mallow.angle = 0;
        }
    }

    mallowIdle()
    {
        if (!this.mallow) return;

        this.clearMallowAction();

        this.mallowState = 'idle';

        this.setPetTexture(
            this.mallow,
            'mallow-idle',
            250
        );

        this.mallow.y =
            this.mallow.homeY;

        this.mallow.angle = 0;

        this.tweens.add({
            targets: this.mallow,
            y: this.mallow.homeY - 5,
            duration: 950,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.inOut'
        });

        this.mallowNextTimer =
            this.time.delayedCall(
                Phaser.Math.Between(1200, 2500),

                () =>
                {
                    this.chooseMallowBehavior();
                }
            );
    }

    chooseMallowBehavior()
    {
        const choice =
            Phaser.Math.Between(0, 9);

        if (choice <= 2)
        {
            this.mallowHop();
        }
        else if (choice <= 4)
        {
            this.mallowFly();
        }
        else if (choice === 5)
        {
            this.mallowBinky();
        }
        else if (choice === 6)
        {
            this.mallowPaw();
        }
        else if (choice === 7)
        {
            this.mallowSit();
        }
        else
        {
            this.mallowSleep();
        }
    }

    mallowHop()
    {
        if (!this.mallow) return;

        this.clearMallowAction();

        this.mallowState = 'hop';

        const targetX =
            Phaser.Math.Between(
                1740,
                2050
            );

        this.mallow.setFlipX(
            targetX < this.mallow.x
        );

        let toggle = false;

        this.mallowFrameTimer =
            this.time.addEvent({
                delay: 180,
                loop: true,

                callback: () =>
                {
                    toggle = !toggle;

                    this.setPetTexture(
                        this.mallow,

                        toggle
                            ? 'mallow-hop-1'
                            : 'mallow-hop-2',

                        255
                    );
                }
            });

        this.createSparkles(
            this.mallow.x,
            this.mallow.y - 60,
            8
        );

        this.mallowMoveTween =
            this.tweens.add({
                targets: this.mallow,
                x: targetX,
                y: this.mallow.homeY - 45,

                duration:
                    Math.max(
                        950,
                        Math.abs(
                            targetX -
                            this.mallow.x
                        ) * 4
                    ),

                yoyo: true,
                ease: 'Sine.inOut',

                onComplete: () =>
                {
                    this.mallowIdle();
                }
            });
    }

    mallowFly()
    {
        if (!this.mallow) return;

        this.clearMallowAction();

        this.mallowState = 'fly';

        const targetX =
            Phaser.Math.Between(
                1720,
                2070
            );

        this.mallow.setFlipX(
            targetX < this.mallow.x
        );

        let toggle = false;

        this.mallowFrameTimer =
            this.time.addEvent({
                delay: 170,
                loop: true,

                callback: () =>
                {
                    toggle = !toggle;

                    this.setPetTexture(
                        this.mallow,

                        toggle
                            ? 'mallow-fly-1'
                            : 'mallow-fly-2',

                        260
                    );
                }
            });

        this.createSparkles(
            this.mallow.x,
            this.mallow.y - 70,
            14
        );

        this.tweens.add({
            targets: this.mallow,

            y:
                this.mallow.homeY - 150,

            duration: 420,
            ease: 'Sine.out',

            onComplete: () =>
            {
                this.mallowMoveTween =
                    this.tweens.add({
                        targets: this.mallow,

                        x: targetX,

                        y:
                            this.mallow.homeY - 175,

                        duration: 1350,
                        ease: 'Sine.inOut',

                        onComplete: () =>
                        {
                            if (this.mallowFrameTimer)
                            {
                                this.mallowFrameTimer.remove();

                                this.mallowFrameTimer =
                                    null;
                            }

                            this.setPetTexture(
                                this.mallow,
                                'mallow-land',
                                255
                            );

                            this.tweens.add({
                                targets: this.mallow,

                                y:
                                    this.mallow.homeY,

                                duration: 430,
                                ease: 'Sine.in',

                                onComplete: () =>
                                {
                                    this.createSparkles(
                                        this.mallow.x,
                                        this.mallow.y,
                                        10
                                    );

                                    this.mallowIdle();
                                }
                            });
                        }
                    });
            }
        });
    }

    mallowBinky()
    {
        if (!this.mallow) return;

        this.clearMallowAction();

        this.mallowState = 'binky';

        this.setPetTexture(
            this.mallow,
            'mallow-binky',
            260
        );

        this.createSparkles(
            this.mallow.x,
            this.mallow.y - 80,
            20
        );

        this.tweens.add({
            targets: this.mallow,

            y:
                this.mallow.homeY - 105,

            angle: 14,

            duration: 260,

            yoyo: true,

            ease: 'Sine.out',

            onComplete: () =>
            {
                this.mallow.angle = 0;

                this.mallowIdle();
            }
        });
    }

    mallowPaw()
    {
        if (!this.mallow) return;

        this.clearMallowAction();

        this.mallowState = 'paw';

        this.setPetTexture(
            this.mallow,
            'mallow-paw',
            255
        );

        this.createSparkles(
            this.mallow.x,
            this.mallow.y - 75,
            10
        );

        this.mallowNextTimer =
            this.time.delayedCall(
                1200,

                () =>
                {
                    this.mallowIdle();
                }
            );
    }

    mallowSit()
    {
        if (!this.mallow) return;

        this.clearMallowAction();

        this.mallowState = 'sit';

        this.setPetTexture(
            this.mallow,
            'mallow-sit',
            250
        );

        this.mallowNextTimer =
            this.time.delayedCall(
                Phaser.Math.Between(
                    1800,
                    2800
                ),

                () =>
                {
                    this.mallowIdle();
                }
            );
    }

    mallowSleep()
    {
        if (!this.mallow) return;

        this.clearMallowAction();

        this.mallowState = 'sleep';

        this.setPetTexture(
            this.mallow,
            'mallow-sleep',
            235
        );

        this.createSleepText(
            this.mallow,
            '#f7c9ef'
        );

        this.mallowNextTimer =
            this.time.delayedCall(
                Phaser.Math.Between(
                    3300,
                    4700
                ),

                () =>
                {
                    this.mallowIdle();
                }
            );
    }

    mallowReaction()
    {
        if (!this.mallow) return;

        this.clearMallowAction();

        this.mallowState =
            'reaction';

        this.setPetTexture(
            this.mallow,
            'mallow-paw',
            255
        );

        this.createSparkles(
            this.mallow.x,
            this.mallow.y - 85,
            20
        );

        this.showPetMessage(
            this.mallow,
            '♡ Aurelia is happy to see you! ♡',
            '#6b365fdd'
        );

        this.mallowNextTimer =
            this.time.delayedCall(
                950,

                () =>
                {
                    this.mallowBinky();
                }
            );
    }

    // =========================================================
    // PET MESSAGES
    // =========================================================

    showPetMessage(
        pet,
        message,
        background
    )
    {
        const text =
            this.add.text(
                pet.x,
                pet.y - 165,
                message,

                {
                    fontFamily: 'Georgia',
                    fontSize: '18px',
                    color: '#fff5e5',
                    backgroundColor: background,

                    padding:
                    {
                        x: 12,
                        y: 6
                    }
                }
            )
            .setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            delay: 400,
            duration: 1500,

            onComplete: () =>
            {
                text.destroy();
            }
        });
    }

    createSleepText(
        pet,
        color
    )
    {
        const zzz =
            this.add.text(
                pet.x + 70,
                pet.y - 100,
                'z  Z  ✦',

                {
                    fontFamily: 'Georgia',
                    fontSize: '22px',
                    color: color
                }
            );

        this.tweens.add({
            targets: zzz,
            y: zzz.y - 45,
            alpha: 0,
            duration: 1800,
            repeat: 1,

            onComplete: () =>
            {
                zzz.destroy();
            }
        });
    }

    // =========================================================
    // MAJICK STUDIES BRIDGE
    // =========================================================

    applyStudyState(state)
    {
        this.studyState = state || null;
        if (!state) return;

        const byType = {};
        (state.pets || []).forEach(p => { byType[p.type] = p; });

        const updatePet = (type, nameText, typeText, glow) =>
        {
            const p = byType[type];
            if (!p) return;
            if (nameText)
            {
                nameText.setText((p.uiSigil ? p.uiSigil + ' ' : '') + p.name + (p.id === state.activePetId ? ' ✦' : ''));
                if (p.uiAccent) nameText.setColor(p.uiAccent);
                nameText.setShadow(0, 0, p.uiAccent || '#f4d19a', 8, true, true);
            }
            if (typeText)
            {
                const title = p.uiTitle || p.species || p.type || 'Familiar';
                const role = p.uiRole ? ' • ' + p.uiRole : '';
                typeText.setText(title + role + ' • Lv ' + (p.level || 1) + ' • ' + (p.stage || 'Guardian'));
                typeText.setColor('#f6eaf2');
            }
            if (glow) glow.setAlpha(p.id === state.activePetId ? 0.32 : 0.18);
        };

        updatePet('luna', this.lunaName, this.lunaType, this.lunaGlow);
        updatePet('ember', this.emberName, this.emberType, this.emberGlow);
        updatePet('nova', this.novaName, this.novaType, this.novaGlow);
        updatePet('mallow', this.mallowName, this.mallowType, this.mallowGlow);

        if (this.hudStatusText)
        {
            this.hudStatusText.setText('Readiness ' + (state.readiness || 0) + '%  •  ' + (state.answers || 0) + ' answers  •  ' + (state.crystals || 0) + ' crystals  •  ' + (state.streak || 0) + ' day streak');
        }
    }

    sendToStudyApp(type, extra = {})
    {
        if (window.parent && window.parent !== window)
        {
            window.parent.postMessage(Object.assign({ type }, extra), '*');
        }
    }

    // =========================================================
    // MAGIC MIRROR
    // =========================================================

    createMagicMirror()
    {
        const container =
            this.add.container(
                2045,
                410
            );

        const glow =
            this.add.ellipse(
                0,
                0,
                350,
                500,
                0xe79ac8,
                0.09
            );

        const frame =
            this.add.ellipse(
                0,
                0,
                300,
                440,
                0x4c2859
            );

        frame.setStrokeStyle(
            12,
            0xe5bd75
        );

        const glass =
            this.add.ellipse(
                0,
                0,
                245,
                380,
                0x805b9f,
                0.70
            );

        glass.setStrokeStyle(
            4,
            0xf0cde4,
            0.70
        );

        const moon =
            this.add.text(
                0,
                -55,
                '☾',

                {
                    fontFamily: 'Georgia',
                    fontSize: '62px',
                    color: '#ffe0a6'
                }
            )
            .setOrigin(0.5);

        const label =
            this.add.text(
                0,
                65,
                'MAGIC\nMIRROR',

                {
                    fontFamily: 'Georgia',
                    fontSize: '24px',
                    align: 'center',
                    color: '#fff0ce'
                }
            )
            .setOrigin(0.5);

        container.add([
            glow,
            frame,
            glass,
            moon,
            label
        ]);

        glass.setInteractive({
            useHandCursor: true
        });

        glass.on(
            'pointerdown',

            () =>
            {
                this.showMirrorPanel();
            }
        );

        this.tweens.add({
            targets: glow,
            alpha: 0.18,
            scale: 1.08,
            duration: 1700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }

    showMirrorPanel()
    {
        if (this.mirrorPanel)
        {
            return;
        }

        const z = this.cameras.main.zoom || 1;
        const panel =
            this.add.container(
                (this.scale.width / 2) / z,
                (this.scale.height / 2) / z
            );

        panel
            .setScrollFactor(0)
            .setScale(1 / z)
            .setDepth(10000);

        const bg =
            this.add.rectangle(
                0,
                0,
                570,
                455,
                0x1c0c26,
                0.98
            );

        bg.setStrokeStyle(
            4,
            0xe0b776,
            0.8
        );

        const title =
            this.add.text(
                0,
                -145,
                '✦ MAGIC MIRROR ✦',

                {
                    fontFamily: 'Georgia',
                    fontSize: '30px',
                    color: '#f4d29a'
                }
            )
            .setOrigin(0.5);

        const s = this.studyState || {};
        const active = (s.pets || []).find(p => p.id === s.activePetId);
        const info =
            this.add.text(
                0,
                -25,

                'OA Readiness: ' + (s.readiness || 0) + '%\n' +
                'Recent Accuracy: ' + (s.accuracy || 0) + '%\n' +
                'Study Streak: ' + (s.streak || 0) + ' day' + ((s.streak || 0) === 1 ? '' : 's') + '\n' +
                'Moon Crystals: ' + (s.crystals || 0) + '\n' +
                'Answers Logged: ' + (s.answers || 0) + '\n\n' +
                'Traveling Familiar: ' + (active ? active.name + ' • Lv ' + active.level : '—'),

                {
                    fontFamily: 'Georgia',
                    fontSize: '19px',
                    align: 'center',
                    color: '#f7e9f1',
                    lineSpacing: 8
                }
            )
            .setOrigin(0.5);

        const continueStudy =
            this.add.text(
                0,
                112,
                '✦ CONTINUE STUDYING ✦',
                {
                    fontFamily: 'Arial',
                    fontStyle: 'bold',
                    fontSize: '17px',
                    color: '#1b0d23',
                    backgroundColor: '#f0c979',
                    padding: { x: 24, y: 11 }
                }
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        continueStudy.on('pointerdown', () =>
        {
            this.sendToStudyApp('MAJICK_CONTINUE_STUDYING');
        });

        const close =
            this.add.text(
                0,
                158,
                'CLOSE',

                {
                    fontFamily: 'Arial',
                    fontStyle: 'bold',
                    fontSize: '18px',
                    color: '#ffffff',
                    backgroundColor: '#a5538c',

                    padding:
                    {
                        x: 24,
                        y: 10
                    }
                }
            )
            .setOrigin(0.5)
            .setInteractive({
                useHandCursor: true
            });

        close.on(
            'pointerdown',

            () =>
            {
                panel.destroy();

                this.mirrorPanel = null;
        this.interactionPanel = null;
        this.decorItems = [];
        this.editMode = false;
        this.initialCameraFitDone = false;
            }
        );

        panel.add([
            bg,
            title,
            info,
            continueStudy,
            close
        ]);

        this.mirrorPanel =
            panel;
    }

    // =========================================================
    // INTERACTIVE COLLEGIATE DECOR
    // =========================================================

    createDecor()
    {
        // These are intentionally elegant silhouettes instead of placeholder text boxes.
        this.createMovableDecor('crystal-pedestal', 1450, 730, 'Crystal Pedestal', () =>
        {
            const c = this.add.container(0, 0);
            const base = this.add.rectangle(0, 26, 82, 44, 0x3a243f, 0.98)
                .setStrokeStyle(2, 0xcda674, 0.65);
            const gem = this.add.polygon(0, -22, [0,-42, 28,-5, 15,31, -15,31, -28,-5], 0x9a7cff, 0.92)
                .setStrokeStyle(3, 0xf1d5ff, 0.78);
            const glow = this.add.ellipse(0, -15, 118, 92, 0xb98cff, 0.12);
            c.add([glow, base, gem]);
            this.tweens.add({targets: glow, alpha: 0.25, scale: 1.12, duration: 1400, yoyo: true, repeat: -1});
            return c;
        }, () => this.openCrystalFocus());

        this.createMovableDecor('reading-chair', 390, 755, 'Velvet Reading Chair', () =>
        {
            const c = this.add.container(0, 0);
            const back = this.add.rectangle(0, -22, 118, 110, 0x5e3158, 1).setStrokeStyle(3, 0xd1a06e, 0.58);
            const seat = this.add.rectangle(0, 40, 132, 50, 0x744063, 1).setStrokeStyle(2, 0xe0bb86, 0.45);
            const moon = this.add.text(0, -28, '☾', {fontFamily:'Georgia',fontSize:'38px',color:'#f4d29a'}).setOrigin(0.5);
            c.add([back, seat, moon]);
            return c;
        }, () => this.openArcaneStacks());

        this.createMovableDecor('pet-cushion', 1870, 790, 'Familiar Lounge', () =>
        {
            const c = this.add.container(0, 0);
            const cushion = this.add.ellipse(0, 20, 170, 72, 0x8b5a7f, 0.96).setStrokeStyle(3, 0xe2b985, 0.55);
            const inner = this.add.ellipse(0, 14, 132, 48, 0xb1789f, 0.74);
            const star = this.add.text(0, 4, '✦', {fontFamily:'Georgia',fontSize:'30px',color:'#ffe1a9'}).setOrigin(0.5);
            c.add([cushion, inner, star]);
            return c;
        }, () => this.openFamiliarLounge());

        this.createMovableDecor('candle-stand', 1120, 690, 'Study Candles', () =>
        {
            const c = this.add.container(0, 0);
            for (const [dx,h] of [[-28,56],[0,76],[28,48]])
            {
                c.add(this.add.rectangle(dx, 25-h/2, 15, h, 0xe9d5bd, 0.96));
                const flame=this.add.circle(dx, -h+18, 8, 0xffc96d, 0.92);
                c.add(flame);
                this.tweens.add({targets:flame,scaleY:1.25,alpha:0.65,duration:420,yoyo:true,repeat:-1});
            }
            return c;
        }, () => this.openStudyDesk());
    }

    createMovableDecor(id, x, y, label, builder, onActivate)
    {
        const item = builder();
        item.x = x;
        item.y = y;
        item.setDepth(35);
        item.setSize(170, 140);
        item.setInteractive(new Phaser.Geom.Rectangle(-85, -70, 170, 140), Phaser.Geom.Rectangle.Contains);
        item.input.cursor = 'pointer';
        item.setData('decorId', id);
        item.setData('label', label);
        item.setData('activate', onActivate);

        const saved = this.readSavedDecorPosition(id);
        if (saved)
        {
            item.x = saved.x;
            item.y = saved.y;
        }

        item.on('pointerover', () => this.showWorldHint(item.x, item.y - 92, label));
        item.on('pointerout', () => this.hideWorldHint());
        item.on('pointerdown', (pointer) =>
        {
            if (this.editMode)
            {
                this.input.setDraggable(item);
                return;
            }
            if (typeof onActivate === 'function') onActivate();
        });
        item.on('drag', (pointer, dragX, dragY) =>
        {
            if (!this.editMode) return;
            item.x = Phaser.Math.Clamp(dragX, 100, this.worldWidth - 100);
            item.y = Phaser.Math.Clamp(dragY, 620, this.worldHeight - 80);
        });
        item.on('dragend', () =>
        {
            if (this.editMode) this.saveDecorPosition(id, item.x, item.y);
        });

        this.decorItems.push(item);
        return item;
    }

    readSavedDecorPosition(id)
    {
        try
        {
            const all = JSON.parse(localStorage.getItem('majick-sanctuary-layout-v2') || '{}');
            return all[id] || null;
        }
        catch (_) { return null; }
    }

    saveDecorPosition(id, x, y)
    {
        try
        {
            const all = JSON.parse(localStorage.getItem('majick-sanctuary-layout-v2') || '{}');
            all[id] = { x: Math.round(x), y: Math.round(y) };
            localStorage.setItem('majick-sanctuary-layout-v2', JSON.stringify(all));
        }
        catch (_) {}
    }

    toggleEditMode()
    {
        this.editMode = !this.editMode;
        this.decorItems.forEach(item =>
        {
            if (item.input) item.input.draggable = this.editMode;
            if (this.editMode) this.input.setDraggable(item);
        });
        if (this.editMode)
        {
            this.showToast('Room Edit', 'Drag the glowing furniture to rearrange your sanctuary. Positions save automatically.');
        }
        else
        {
            this.showToast('Explore Mode', 'Furniture is locked in place again. Tap objects to interact.');
        }
        if (this.editModeText) this.editModeText.setText(this.editMode ? '✓ DONE EDITING' : '✦ EDIT ROOM');
    }

    resetDecorLayout()
    {
        try { localStorage.removeItem('majick-sanctuary-layout-v2'); } catch (_) {}
        this.showToast('Layout reset', 'Reload the sanctuary to restore the original furniture positions.');
    }

    // =========================================================
    // INTERACTIVE HOTSPOTS
    // =========================================================

    createInteractiveZones()
    {
        this.createHotspot(250, 360, 390, 360, 'ARCANE STACKS', 'Books, references & weak-area review', () => this.openArcaneStacks());
        this.createHotspot(1020, 410, 560, 360, 'MOONLIT STUDY DESK', 'Study, journal & resume your mission', () => this.openStudyDesk());
        this.createHotspot(1260, 205, 520, 250, 'OBSERVATORY WINDOWS', 'Constellations, final review & readiness', () => this.openObservatory());
        this.createHotspot(1600, 420, 330, 300, 'FOCUS ALCOVE', 'Crystals, focus tools & quiet study', () => this.openCrystalFocus());
        this.createHotspot(1875, 715, 300, 210, 'FAMILIAR LOUNGE', 'Invite your guardians to settle in', () => this.openFamiliarLounge());
    }

    createHotspot(x, y, w, h, label, subtitle, activate)
    {
        const zone = this.add.zone(x, y, w, h).setDepth(-5).setInteractive({ useHandCursor: true });
        zone.on('pointerover', () => this.showWorldHint(x, y - h/2 + 22, label, subtitle));
        zone.on('pointerout', () => this.hideWorldHint());
        zone.on('pointerdown', () => { if (!this.editMode && typeof activate === 'function') activate(); });
        return zone;
    }

    showWorldHint(x, y, title, subtitle = '')
    {
        this.hideWorldHint();
        const c = this.add.container(x, y).setDepth(9500);
        const titleText = this.add.text(0, 0, title, {
            fontFamily: 'Georgia', fontStyle: 'bold', fontSize: '15px', color: '#f4d19a',
            backgroundColor: '#160a1fe8', padding: {x:12,y:7}, align:'center'
        }).setOrigin(0.5);
        c.add(titleText);
        if (subtitle)
        {
            const sub = this.add.text(0, 31, subtitle, {
                fontFamily:'Arial',fontSize:'11px',color:'#f6e9f1',backgroundColor:'#160a1fd8',padding:{x:9,y:5}
            }).setOrigin(0.5);
            c.add(sub);
        }
        this.worldHint = c;
    }

    hideWorldHint()
    {
        if (this.worldHint) { this.worldHint.destroy(); this.worldHint = null; }
    }

    showInteractionPanel(title, kicker, body, actions = [])
    {
        if (this.interactionPanel) this.interactionPanel.destroy();
        const z = this.cameras.main.zoom || 1;
        const panel = this.add.container((this.scale.width / 2) / z, (this.scale.height / 2) / z)
            .setScrollFactor(0).setScale(1 / z).setDepth(12000);
        const shade = this.add.rectangle(0, 0, this.scale.width + 40, this.scale.height + 40, 0x09040d, 0.48)
            .setInteractive();
        const cols = Math.max(1, actions.length > 2 ? 2 : actions.length);
        const rows = Math.max(1, Math.ceil(actions.length / cols));
        const panelHeight = 350 + Math.max(0, rows - 1) * 58;
        const bg = this.add.rectangle(0, 0, 620, panelHeight, 0x1b0c24, 0.985)
            .setStrokeStyle(3, 0xd7aa72, 0.78);
        const top = -panelHeight / 2;
        const kick = this.add.text(0, top + 46, kicker.toUpperCase(), {fontFamily:'Arial',fontStyle:'bold',fontSize:'12px',color:'#cfa9d8',letterSpacing:2}).setOrigin(0.5);
        const ttl = this.add.text(0, top + 86, title, {fontFamily:'Georgia',fontStyle:'bold',fontSize:'30px',color:'#f4d29a',align:'center'}).setOrigin(0.5);
        const txt = this.add.text(0, top + 160, body, {fontFamily:'Arial',fontSize:'16px',color:'#f7e9f1',align:'center',wordWrap:{width:510},lineSpacing:6}).setOrigin(0.5);
        panel.add([shade,bg,kick,ttl,txt]);

        const startY = top + 250;
        actions.forEach((action, i) =>
        {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const bw = cols === 1 ? 300 : 225;
            const gap = 18;
            const total = cols*bw + (cols-1)*gap;
            const bx = -total/2 + bw/2 + col*(bw+gap);
            const by = startY + row*55;
            const btn = this.add.text(bx, by, action.label, {
                fontFamily:'Arial',fontStyle:'bold',fontSize:'14px',color: action.primary ? '#241125' : '#f8edf4',
                backgroundColor: action.primary ? '#e0b776' : '#603b68',padding:{x:18,y:11},fixedWidth:bw,align:'center'
            }).setOrigin(0.5).setInteractive({useHandCursor:true});
            btn.on('pointerdown', () => { panel.destroy(); this.interactionPanel=null; action.run(); });
            panel.add(btn);
        });
        const closeY = startY + rows * 55 + 8;
        const close = this.add.text(0, closeY, 'CLOSE', {fontFamily:'Arial',fontStyle:'bold',fontSize:'13px',color:'#eadbea',backgroundColor:'#351a3d',padding:{x:20,y:9}})
            .setOrigin(0.5).setInteractive({useHandCursor:true});
        close.on('pointerdown', () => { panel.destroy(); this.interactionPanel=null; });
        panel.add(close);
        this.interactionPanel = panel;
    }

    openArcaneStacks()
    {
        this.createSparkles(360, 390, 12);
        this.showInteractionPanel('The Arcane Stacks', 'College Library', 'The shelves reorganize themselves around what you are learning. You can study here or invite one of your current familiars to investigate the stacks.', [
            {label:'OPEN STUDY GUIDE', primary:true, run:()=>this.sendToStudyApp('MAJICK_OPEN_ROUTE',{route:'guide'})},
            {label:'OPEN GRIMOIRE', run:()=>this.sendToStudyApp('MAJICK_OPEN_ROUTE',{route:'grimoire'})},
            {label:'READ WITH FAMILIAR', run:()=>this.openFamiliarObjectPicker('stacks')}
        ]);
    }

    openStudyDesk()
    {
        this.createSparkles(1080, 610, 10);
        this.showInteractionPanel('Moonlit Study Desk', 'Your Workspace', 'Your notes, current mission, and journal wait here. The desk always leads back to real learning, and a familiar can settle beside you while you work.', [
            {label:'CONTINUE STUDYING', primary:true, run:()=>this.sendToStudyApp('MAJICK_CONTINUE_STUDYING')},
            {label:'OPEN JOURNAL', run:()=>this.sendToStudyApp('MAJICK_OPEN_ROUTE',{route:'journal'})},
            {label:'STUDY WITH FAMILIAR', run:()=>this.openFamiliarObjectPicker('desk')}
        ]);
    }

    openObservatory()
    {
        this.showInteractionPanel('Celestial Observatory', 'Upper College', 'The enchanted windows turn your progress into constellations. Bring a familiar to the windows for a unique stargazing reaction.', [
            {label:'CONSTELLATION', primary:true, run:()=>this.sendToStudyApp('MAJICK_OPEN_ROUTE',{route:'constellation'})},
            {label:'FINAL REVIEW', run:()=>this.sendToStudyApp('MAJICK_OPEN_ROUTE',{route:'finalreview'})},
            {label:'STARGAZE WITH FAMILIAR', run:()=>this.openFamiliarObjectPicker('observatory')}
        ]);
    }

    openCrystalFocus()
    {
        const s = this.studyState || {};
        this.createSparkles(1480, 655, 18);
        this.showInteractionPanel('Crystal Focus Alcove', 'Quiet Study', 'Your crystal reserve is ' + (s.crystals || 0) + '. Use the alcove to return to the work—or invite a familiar to react to the focus crystal.', [
            {label:'FOCUS TOOLS', primary:true, run:()=>this.sendToStudyApp('MAJICK_OPEN_ROUTE',{route:'focus'})},
            {label:'STUDY PLANNER', run:()=>this.sendToStudyApp('MAJICK_OPEN_ROUTE',{route:'planner'})},
            {label:'FOCUS WITH FAMILIAR', run:()=>this.openFamiliarObjectPicker('focus')}
        ]);
    }

    openFamiliarLounge()
    {
        this.createSparkles(1870, 735, 14);
        this.showInteractionPanel('Familiar Lounge', 'Companion Common Room', 'Choose a familiar and they will actually travel to the lounge, settle onto the cushion, and rest. Cozy interactions only—no hunger, sickness, punishment, or care debt.', [
            {label:'LUNA • REST', run:()=>this.startFamiliarObjectInteraction('luna','lounge')},
            {label:'EMBER • CURL UP', run:()=>this.startFamiliarObjectInteraction('ember','lounge')},
            {label:'NOVA • NAP', run:()=>this.startFamiliarObjectInteraction('nova','lounge')},
            {label:'MALLOW • NAP', primary:true, run:()=>this.startFamiliarObjectInteraction('mallow','lounge')}
        ]);
    }

    // =========================================================
    // V3.3.7 • FAMILIAR × OBJECT INTERACTIONS
    // =========================================================

    getFamiliarInteractionDef(id)
    {
        const defs = {
            luna: {
                id:'luna', name:'Velora', sprite:'luna', homeX:430, homeY:610,
                clear:'clearLunaAction', idle:'lunaIdle', moveTween:'lunaMoveTween', frameTimer:'lunaFrameTimer', nextTimer:'lunaNextTimer',
                walk:['luna-walk-1','luna-walk-2'], sit:'luna-sit', sleep:'luna-sleep', delight:'luna-paw', height:245, bubble:'#421a50dd'
            },
            ember: {
                id:'ember', name:'Cascade', sprite:'ember', homeX:930, homeY:610,
                clear:'clearEmberAction', idle:'emberIdle', moveTween:'emberMoveTween', frameTimer:'emberFrameTimer', nextTimer:'emberNextTimer',
                walk:['ember-walk-1','ember-walk-2'], sit:'ember-sit', sleep:'ember-sleep', delight:'ember-hop', height:255, bubble:'#23445cdd'
            },
            nova: {
                id:'nova', name:'Solstice', sprite:'nova', homeX:1430, homeY:610,
                clear:'clearNovaAction', idle:'novaIdle', moveTween:'novaMoveTween', frameTimer:'novaFrameTimer', nextTimer:'novaNextTimer',
                walk:['nova-walk-1','nova-walk-2'], sit:'nova-sit', sleep:'nova-sleep', delight:'nova-pounce', height:255, bubble:'#6a3a20dd'
            },
            mallow: {
                id:'mallow', name:'Aurelia', sprite:'mallow', homeX:1880, homeY:610,
                clear:'clearMallowAction', idle:'mallowIdle', moveTween:'mallowMoveTween', frameTimer:'mallowFrameTimer', nextTimer:'mallowNextTimer',
                walk:['mallow-hop-1','mallow-hop-2'], sit:'mallow-sit', sleep:'mallow-sleep', delight:'mallow-binky', height:250, bubble:'#6b365fdd'
            }
        };
        const def = defs[id];
        if (!def) return null;
        def.pet = this[def.sprite] || null;
        return def;
    }

    getObjectInteractionDef(id)
    {
        const defs = {
            stacks: {
                id:'stacks', title:'Arcane Stacks', x:500, y:610, mode:'sit',
                picker:'Choose who should investigate the Arcane Stacks with you.',
                messages:{
                    luna:'Velora settles beside the oldest volume and watches the margins for clues.',
                    ember:'Cascade studies the repeating symbols on the spines as if they are a puzzle.',
                    nova:'Solstice checks every shelf like there might be a secret passage behind it.',
                    mallow:'Aurelia settles beside the books and makes the library feel unusually peaceful.'
                }
            },
            desk: {
                id:'desk', title:'Moonlit Study Desk', x:1080, y:610, mode:'sit',
                picker:'Choose a familiar to settle beside the Moonlit Study Desk while you work.',
                messages:{
                    luna:'Velora takes the quiet side of the desk and keeps watch while you study.',
                    ember:'Cascade studies your notes like the page itself contains a pattern to solve.',
                    nova:'Solstice settles in as your tiny study lookout—curious, alert, and ready to move.',
                    mallow:'Aurelia curls beside the desk and turns the whole corner into a calmer study space.'
                }
            },
            observatory: {
                id:'observatory', title:'Celestial Observatory', x:1280, y:590, mode:'delight',
                picker:'Choose a familiar to visit the Observatory windows.',
                messages:{
                    luna:'Velora watches the moon-map as if she already knows which constellation comes next.',
                    ember:'Cascade’s markings shimmer back at the star chart in tiny repeating patterns.',
                    nova:'Solstice tracks a streak of light across the glass and nearly launches after it.',
                    mallow:'Aurelia’s wings catch the starlight and glow softly against the observatory glass.'
                }
            },
            focus: {
                id:'focus', title:'Crystal Focus Alcove', x:1510, y:610, mode:'delight',
                picker:'Choose a familiar to investigate the Focus Crystal.',
                messages:{
                    luna:'Velora taps the crystal once, then looks at you like the next move is obvious.',
                    ember:'Cascade’s little runes answer the crystal with a bright pulse of light.',
                    nova:'Solstice circles the crystal, decides it is interesting, and proudly claims the discovery.',
                    mallow:'Aurelia rests a paw near the crystal and the light softens into a steady glow.'
                }
            },
            lounge: {
                id:'lounge', title:'Familiar Lounge', x:1870, y:635, mode:'sleep',
                picker:'Choose a familiar to rest in the common-room lounge.',
                messages:{
                    luna:'Velora claims the cushion with the confidence of someone who believes it was always hers.',
                    ember:'Cascade curls into a tiny warm coil and immediately looks much too comfortable.',
                    nova:'Solstice makes one careful circle, flops down, and declares the lounge acceptable.',
                    mallow:'Aurelia sinks into the cushion like a cloud landing on another cloud.'
                }
            }
        };
        return defs[id] || null;
    }

    openFamiliarObjectPicker(objectId)
    {
        const obj = this.getObjectInteractionDef(objectId);
        if (!obj) return;
        this.showInteractionPanel('Invite a Familiar', obj.title, obj.picker + ' They will physically travel to the station, react, then return to their usual part of the sanctuary.', [
            {label:'LUNA', run:()=>this.startFamiliarObjectInteraction('luna',objectId)},
            {label:'EMBER', run:()=>this.startFamiliarObjectInteraction('ember',objectId)},
            {label:'NOVA', run:()=>this.startFamiliarObjectInteraction('nova',objectId)},
            {label:'MALLOW', primary:true, run:()=>this.startFamiliarObjectInteraction('mallow',objectId)}
        ]);
    }

    startFamiliarObjectInteraction(petId, objectId)
    {
        const def = this.getFamiliarInteractionDef(petId);
        const obj = this.getObjectInteractionDef(objectId);
        if (!def || !obj || !def.pet)
        {
            this.showToast('Familiar unavailable', 'That familiar is not awake in the sanctuary yet.');
            return;
        }

        const pet = def.pet;
        this.petInteractionTokens[petId] = (this.petInteractionTokens[petId] || 0) + 1;
        const token = this.petInteractionTokens[petId];

        if (typeof this[def.clear] === 'function') this[def.clear]();
        if (pet.input) pet.input.enabled = false;

        pet.homeY = obj.y;
        pet.setFlipX(obj.x < pet.x);
        let toggle = false;
        this[def.frameTimer] = this.time.addEvent({
            delay: petId === 'mallow' ? 170 : 190,
            loop: true,
            callback: () =>
            {
                toggle = !toggle;
                this.setPetTexture(pet, toggle ? def.walk[0] : def.walk[1], def.height);
            }
        });

        const offsets = {luna:-60, ember:-20, nova:25, mallow:65};
        const targetX = Phaser.Math.Clamp(obj.x + (offsets[petId] || 0), 130, this.worldWidth - 130);
        const distance = Math.abs(targetX - pet.x);
        this.showToast(def.name + ' is on the way', obj.title);
        this[def.moveTween] = this.tweens.add({
            targets: pet,
            x: targetX,
            y: obj.y,
            duration: Phaser.Math.Clamp(900 + distance * 1.5, 1050, 2500),
            ease: 'Sine.inOut',
            onComplete: () =>
            {
                if (this.petInteractionTokens[petId] !== token) return;
                if (this[def.frameTimer])
                {
                    this[def.frameTimer].remove();
                    this[def.frameTimer] = null;
                }
                this.playFamiliarObjectReaction(def, obj, token);
            }
        });
    }

    playFamiliarObjectReaction(def, obj, token)
    {
        const pet = def.pet;
        if (!pet || this.petInteractionTokens[def.id] !== token) return;

        const texture = obj.mode === 'sleep' ? def.sleep : (obj.mode === 'sit' ? def.sit : def.delight);
        this.setPetTexture(pet, texture, obj.mode === 'sleep' ? def.height - 15 : def.height);
        this.createSparkles(pet.x, pet.y - 80, obj.mode === 'delight' ? 22 : 13);
        if (obj.mode === 'sleep') this.createSleepText(pet, def.id === 'ember' ? '#bfeaff' : (def.id === 'mallow' ? '#f7c9ef' : '#e8d4ff'));

        const message = (obj.messages && obj.messages[def.id]) || (def.name + ' enjoys the ' + obj.title + '.');
        this.showPetMessage(pet, message, def.bubble);
        const count = this.recordFamiliarObjectInteraction(def.id, obj.id);
        this.showToast(def.name + ' • ' + obj.title, 'Sanctuary visit ' + count + ' • cosmetic bond memory saved locally.');

        this[def.nextTimer] = this.time.delayedCall(obj.mode === 'sleep' ? 4300 : 3200, () =>
        {
            if (this.petInteractionTokens[def.id] !== token) return;
            this.returnFamiliarHome(def, token);
        });
    }

    returnFamiliarHome(def, token)
    {
        const pet = def.pet;
        if (!pet || this.petInteractionTokens[def.id] !== token) return;
        if (typeof this[def.clear] === 'function') this[def.clear]();

        pet.setFlipX(def.homeX < pet.x);
        let toggle = false;
        this[def.frameTimer] = this.time.addEvent({
            delay: def.id === 'mallow' ? 170 : 190,
            loop: true,
            callback: () =>
            {
                toggle = !toggle;
                this.setPetTexture(pet, toggle ? def.walk[0] : def.walk[1], def.height);
            }
        });
        const distance = Math.abs(def.homeX - pet.x);
        this[def.moveTween] = this.tweens.add({
            targets: pet,
            x: def.homeX,
            y: def.homeY,
            duration: Phaser.Math.Clamp(850 + distance * 1.25, 1000, 2300),
            ease: 'Sine.inOut',
            onComplete: () =>
            {
                if (this.petInteractionTokens[def.id] !== token) return;
                if (this[def.frameTimer])
                {
                    this[def.frameTimer].remove();
                    this[def.frameTimer] = null;
                }
                pet.homeY = def.homeY;
                if (pet.input) pet.input.enabled = true;
                if (typeof this[def.idle] === 'function') this[def.idle]();
            }
        });
    }

    recordFamiliarObjectInteraction(petId, objectId)
    {
        try
        {
            const all = JSON.parse(localStorage.getItem(this.objectInteractionStoreKey) || '{}');
            if (!all[petId]) all[petId] = { total:0, objects:{} };
            if (!all[petId].objects[objectId]) all[petId].objects[objectId] = 0;
            all[petId].objects[objectId] += 1;
            all[petId].total += 1;
            all[petId].lastObject = objectId;
            all[petId].lastAt = new Date().toISOString();
            localStorage.setItem(this.objectInteractionStoreKey, JSON.stringify(all));
            return all[petId].objects[objectId];
        }
        catch (_)
        {
            return 1;
        }
    }

    showToast(title, body)
    {
        const z = this.cameras.main.zoom || 1;
        const c = this.add.container((this.scale.width - 220) / z, (this.scale.height - 86) / z).setScrollFactor(0).setScale(1 / z).setDepth(15000);
        const bg = this.add.rectangle(0,0,390,112,0x1b0c24,0.97).setStrokeStyle(2,0xd7aa72,0.65);
        const t = this.add.text(-168,-30,title,{fontFamily:'Georgia',fontStyle:'bold',fontSize:'18px',color:'#f4d29a'});
        const b = this.add.text(-168,0,body,{fontFamily:'Arial',fontSize:'12px',color:'#f7e9f1',wordWrap:{width:330},lineSpacing:3});
        c.add([bg,t,b]);
        this.tweens.add({targets:c,alpha:0,duration:450,delay:2800,onComplete:()=>c.destroy()});
    }

    // =========================================================
    // SPARKLES
    // =========================================================

    createSparkles(
        x,
        y,
        amount = 12
    )
    {
        for (
            let i = 0;
            i < amount;
            i++
        )
        {
            const sparkle =
                this.add.circle(
                    x +
                    Phaser.Math.Between(
                        -45,
                        45
                    ),

                    y +
                    Phaser.Math.Between(
                        -30,
                        30
                    ),

                    Phaser.Math.Between(
                        2,
                        5
                    ),

                    Phaser.Math.RND.pick([
                        0xffd995,
                        0xf4a9d2,
                        0xb8ddff,
                        0xc9a8ff
                    ]),

                    0.95
                );

            this.tweens.add({
                targets: sparkle,

                y:
                    sparkle.y -
                    Phaser.Math.Between(
                        30,
                        85
                    ),

                x:
                    sparkle.x +
                    Phaser.Math.Between(
                        -30,
                        30
                    ),

                alpha: 0,
                scale: 0.2,

                duration:
                    Phaser.Math.Between(
                        600,
                        1100
                    ),

                onComplete: () =>
                {
                    sparkle.destroy();
                }
            });
        }
    }

    // Keep interface text readable even while the room camera is zoomed to fit.
    fixToScreen(obj, screenX, screenY)
    {
        const z = this.cameras.main.zoom || 1;
        obj.setScrollFactor(0);
        obj.x = screenX / z;
        obj.y = screenY / z;
        obj.setScale(1 / z);
        return obj;
    }

    // =========================================================
    // HUD
    // =========================================================

    createHUD()
    {
        const title = this.add.text(
            0, 0,
            'MAJICK STUDIES • LIVING SANCTUARY',
            {
                fontFamily: 'Georgia',
                fontStyle: 'bold',
                fontSize: '22px',
                color: '#f4d19a',
                backgroundColor: '#15091de8',
                padding: { x: 15, y: 10 }
            }
        ).setDepth(10000);
        this.fixToScreen(title, 26, 22);

        const subtitle = this.add.text(
            0, 0,
            'A magical-college common room • tap a study station, then invite a familiar',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: '#f1e2eb',
                backgroundColor: '#15091ddd',
                padding: { x: 12, y: 7 }
            }
        ).setDepth(10000);
        this.fixToScreen(subtitle, 26, 70);

        this.hudStatusText = this.add.text(
            0, 0,
            'Connected to Majick Studies',
            {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#f4d19a',
                backgroundColor: '#15091ddd',
                padding: { x: 12, y: 7 }
            }
        ).setDepth(10000);
        this.fixToScreen(this.hudStatusText, 26, 107);

        this.editModeText = this.add.text(
            0, 0,
            '✦ EDIT ROOM',
            {
                fontFamily:'Arial',fontStyle:'bold',fontSize:'13px',color:'#f7e9f1',backgroundColor:'#603b68',
                padding:{x:14,y:9}
            }
        ).setOrigin(1,0).setDepth(10000).setInteractive({useHandCursor:true});
        this.fixToScreen(this.editModeText, this.scale.width - 28, 26);
        this.editModeText.on('pointerdown',()=>this.toggleEditMode());

        const reset = this.add.text(
            0, 0,
            'RESET LAYOUT',
            {fontFamily:'Arial',fontStyle:'bold',fontSize:'10px',color:'#d9cadc',backgroundColor:'#291530cc',padding:{x:11,y:7}}
        ).setOrigin(1,0).setDepth(10000).setInteractive({useHandCursor:true});
        this.fixToScreen(reset, this.scale.width - 28, 68);
        reset.on('pointerdown',()=>this.resetDecorLayout());
    }

    // =========================================================
    // CAMERA
    // =========================================================

    fitRoomToView()
    {
        const camera = this.cameras.main;
        const fitZoom = Math.min(
            this.scale.width / this.worldWidth,
            this.scale.height / this.worldHeight
        );
        camera.setZoom(Phaser.Math.Clamp(fitZoom, 0.50, 1.0));
        camera.centerOn(this.worldWidth / 2, this.worldHeight / 2);
        this.initialCameraFitDone = true;
    }

    clampCamera()
    {
        const camera = this.cameras.main;
        const viewW = camera.width / camera.zoom;
        const viewH = camera.height / camera.zoom;
        const maxX = Math.max(0, this.worldWidth - viewW);
        const maxY = Math.max(0, this.worldHeight - viewH);
        camera.scrollX = Phaser.Math.Clamp(camera.scrollX, 0, maxX);
        camera.scrollY = Phaser.Math.Clamp(camera.scrollY, 0, maxY);
    }

    setupCameraControls()
    {
        const camera = this.cameras.main;

        this.input.on('pointerdown', (pointer, objects) =>
        {
            if (objects && objects.length > 0) return;
            this.draggingCamera = true;
            this.lastPointerX = pointer.x;
            this.lastPointerY = pointer.y;
        });

        this.input.on('pointermove', pointer =>
        {
            if (!this.draggingCamera) return;
            const dx = (pointer.x - this.lastPointerX) / camera.zoom;
            const dy = (pointer.y - this.lastPointerY) / camera.zoom;
            camera.scrollX -= dx;
            camera.scrollY -= dy;
            this.clampCamera();
            this.lastPointerX = pointer.x;
            this.lastPointerY = pointer.y;
        });

        this.input.on('pointerup', () => { this.draggingCamera = false; });
        this.input.on('pointerupoutside', () => { this.draggingCamera = false; });

        this.input.on('wheel', (pointer, objects, deltaX, deltaY) =>
        {
            const oldZoom = camera.zoom;
            const fitZoom = Math.min(this.scale.width / this.worldWidth, this.scale.height / this.worldHeight);
            const zoom = Phaser.Math.Clamp(oldZoom - deltaY * 0.00045, Math.max(0.50, fitZoom), 1.12);
            camera.setZoom(zoom);
            this.clampCamera();
        });
    }

}


// =============================================================
// V3.3.9 DARK COLLEGE SANCTUARY ROOM SKIN
// IMPORTANT: This only overrides room/background/decor presentation.
// Existing Phase 4 familiar movement methods and motion art are untouched.
// =============================================================

Game.prototype.createDecor = function()
{
    const gold=0xd0a06f, dark=0x241522, plum=0x4a2340, velvet=0x65345a;

    // Arcane bookcase.
    this.createMovableDecor('arcane-bookcase',245,700,'Arcane Bookcase',()=>{
        const c=this.add.container(0,0);
        const shell=this.add.rectangle(0,-36,176,246,0x21141d,1).setStrokeStyle(4,gold,.55);
        c.add(shell);
        [-96,-42,12,66].forEach((yy,row)=>{
            c.add(this.add.rectangle(0,yy,152,8,0x5a3b2e,.92));
            for(let i=0;i<7;i++){
                const hues=[0x5b294b,0x2f4960,0x425638,0x6a4531,0x3c315d];
                c.add(this.add.rectangle(-62+i*20,yy-19,13,35+(i%2)*6,hues[(i+row)%hues.length],.98).setStrokeStyle(1,0xd3b075,.28));
            }
        });
        c.add(this.add.text(0,-154,'☾ ✦',{fontFamily:'Georgia',fontSize:'26px',color:'#d8b27a'}).setOrigin(.5));
        return c;
    },()=>this.openArcaneStacks());

    // Moonlit study desk.
    this.createMovableDecor('moonlit-desk',1030,755,'Moonlit Study Desk',()=>{
        const c=this.add.container(0,0);
        c.add(this.add.rectangle(0,10,270,76,0x2b171d,1).setStrokeStyle(4,gold,.5));
        c.add(this.add.rectangle(-108,78,25,112,0x1c1016,.98));
        c.add(this.add.rectangle(108,78,25,112,0x1c1016,.98));
        c.add(this.add.rectangle(0,-28,118,54,0xe7dbc4,.94).setStrokeStyle(2,0x9c764f,.52));
        c.add(this.add.line(0,-28,0,-50,0,0,0x8a6b55,.7));
        c.add(this.add.text(64,-40,'✒',{fontFamily:'Georgia',fontSize:'36px',color:'#d7b57a'}).setOrigin(.5));
        const flame=this.add.circle(-88,-55,8,0xffc26e,.92);c.add(flame);
        c.add(this.add.rectangle(-88,-29,8,40,0xe8d2ad,.9));
        this.tweens.add({targets:flame,scaleY:1.25,alpha:.58,duration:420,yoyo:true,repeat:-1});
        return c;
    },()=>this.openStudyDesk());

    // Brass observatory telescope.
    this.createMovableDecor('observatory-telescope',1280,710,'Observatory Telescope',()=>{
        const c=this.add.container(0,0);
        c.add(this.add.rectangle(0,58,12,150,0x7b583d,.9));
        c.add(this.add.line(0,90,-58,170,0,0,0x7b583d,.85).setLineWidth(7));
        c.add(this.add.line(0,90,58,170,0,0,0x7b583d,.85).setLineWidth(7));
        const tube=this.add.rectangle(6,-28,176,48,0x5b3f36,1).setStrokeStyle(4,gold,.68).setAngle(-18);c.add(tube);
        c.add(this.add.circle(-82,-56,28,0x27243c,1).setStrokeStyle(4,0xa889ca,.72));
        c.add(this.add.circle(-82,-56,15,0x53658a,.8));
        return c;
    },()=>this.openObservatory());

    // Focus crystal pedestal.
    this.createMovableDecor('crystal-pedestal',1510,742,'Crystal Focus Pedestal',()=>{
        const c=this.add.container(0,0);
        const glow=this.add.ellipse(0,-44,156,116,0x7b5cff,.16);c.add(glow);
        c.add(this.add.rectangle(0,53,98,70,0x2c2432,.99).setStrokeStyle(3,gold,.62));
        c.add(this.add.rectangle(0,12,66,26,0x49354c,.99).setStrokeStyle(2,gold,.42));
        c.add(this.add.polygon(0,-48,[0,-70,39,-14,20,39,-20,39,-39,-14],0x7e65d8,.96).setStrokeStyle(4,0xe7d9ff,.86));
        this.tweens.add({targets:glow,alpha:.34,scale:1.14,duration:1250,yoyo:true,repeat:-1});
        return c;
    },()=>this.openCrystalFocus());

    // Velvet reading chair.
    this.createMovableDecor('reading-chair',520,785,'Velvet Reading Chair',()=>{
        const c=this.add.container(0,0);
        c.add(this.add.ellipse(0,-28,134,160,0x5b294d,1).setStrokeStyle(4,gold,.55));
        c.add(this.add.rectangle(0,50,144,58,velvet,1).setStrokeStyle(3,gold,.4));
        c.add(this.add.rectangle(-62,89,15,75,dark,1));c.add(this.add.rectangle(62,89,15,75,dark,1));
        c.add(this.add.text(0,-42,'☾',{fontFamily:'Georgia',fontSize:'40px',color:'#e7c78a'}).setOrigin(.5));
        return c;
    },()=>this.openArcaneStacks());

    // Familiar settee/lounge.
    this.createMovableDecor('familiar-settee',1830,772,'Familiar Lounge',()=>{
        const c=this.add.container(0,0);
        c.add(this.add.rectangle(0,-22,260,92,0x44203a,1).setStrokeStyle(4,gold,.52));
        c.add(this.add.rectangle(0,42,284,64,0x65365b,1).setStrokeStyle(3,0xc9a171,.4));
        c.add(this.add.ellipse(-66,33,84,44,0x926b8c,.78));c.add(this.add.ellipse(66,33,84,44,0x926b8c,.78));
        c.add(this.add.text(0,-25,'✦  ☾  ✦',{fontFamily:'Georgia',fontSize:'24px',color:'#e8c98e'}).setOrigin(.5));
        return c;
    },()=>this.openFamiliarLounge());

    const buildBed=(gemColor,softColor,sigil)=>{
        const c=this.add.container(0,0);
        const aura=this.add.ellipse(0,8,250,130,softColor,.13);c.add(aura);
        c.add(this.add.rectangle(0,42,236,72,0x2b1825,.99).setStrokeStyle(4,gold,.52));
        c.add(this.add.ellipse(0,18,206,62,0x765071,.95).setStrokeStyle(2,0xe5c8dd,.32));
        [-84,-56,-28,0,28,56,84].forEach((dx,i)=>{
            c.add(this.add.triangle(dx,-26,-17,34,17,34,0,-35,gemColor,.9).setStrokeStyle(2,0xf1ddff,.58));
        });
        c.add(this.add.ellipse(0,12,82,38,0xd9bfd6,.88));
        c.add(this.add.text(0,10,sigil,{fontFamily:'Georgia',fontSize:'23px',color:'#fff0cc'}).setOrigin(.5));
        this.tweens.add({targets:aura,alpha:.27,scale:1.08,duration:1500,yoyo:true,repeat:-1});
        return c;
    };

    this.createMovableDecor('amethyst-crystal-bed',2060,835,'Amethyst Crystal Bed',()=>buildBed(0x8e69d8,0xb988ff,'☾'),()=>this.openFamiliarObjectPicker('bed-east'));
    this.createMovableDecor('moonstone-crystal-bed',720,842,'Moonstone Crystal Bed',()=>buildBed(0x69a8b8,0x83d6dc,'✦'),()=>this.openFamiliarObjectPicker('bed-west'));

    // Potion cabinet / study apothecary.
    this.createMovableDecor('apothecary-cabinet',330,845,'Study Apothecary',()=>{
        const c=this.add.container(0,0);
        c.add(this.add.rectangle(0,-16,154,176,0x24171c,.99).setStrokeStyle(3,gold,.46));
        [-58,-6,46].forEach(y=>c.add(this.add.rectangle(0,y,136,5,0x6a4935,.72)));
        const colors=[0x7a65d8,0x58a6a4,0xb44e7b,0xd2924e,0x6e8c59,0x8b5a9e];
        for(let r=0;r<3;r++)for(let i=0;i<4;i++){
            const bottle=this.add.circle(-51+i*34,-76+r*52,9,colors[(r*4+i)%colors.length],.9).setStrokeStyle(1,0xeacb9a,.45);c.add(bottle);
            c.add(this.add.rectangle(-51+i*34,-89+r*52,7,8,0xd2b37d,.8));
        }
        return c;
    },()=>this.openCrystalFocus());
};

const _v339ObjectInteractionDef = Game.prototype.getObjectInteractionDef;
Game.prototype.getObjectInteractionDef = function(id)
{
    if(id==='bed-west') return {id:'bed-west',title:'Moonstone Crystal Bed',x:720,y:650,mode:'sleep',picker:'Choose a familiar to settle into the Moonstone Crystal Bed.',messages:{luna:'Velora curls beneath the moonstone glow and immediately claims the best pillow.',ember:'Cascade circles the crystal edge once, then curls up beneath the cool blue light.',nova:'Solstice tests the mattress with one paw, approves it, and disappears into the pillows.',mallow:'Aurelia sinks into the moonstone bedding until only soft wings and ears are visible.'}};
    if(id==='bed-east') return {id:'bed-east',title:'Amethyst Crystal Bed',x:1990,y:650,mode:'sleep',picker:'Choose a familiar to rest beneath the Amethyst Crystal Bed canopy.',messages:{luna:'Velora settles beneath the amethyst crown and watches the room until her eyes finally close.',ember:'Cascade tucks into the violet glow like it was made for a tiny dragon.',nova:'Solstice makes a dramatic little nest and then falls asleep instantly.',mallow:'Aurelia stretches beneath the crystals and turns the whole bed into a cloud.'}};
    return _v339ObjectInteractionDef.call(this,id);
};

Game.prototype.openFamiliarObjectPicker = function(objectId)
{
    const obj=this.getObjectInteractionDef(objectId);if(!obj)return;
    this.showInteractionPanel('Invite a Familiar',obj.title,obj.picker+' They will physically travel to the station, react, then return to their usual part of the sanctuary.',[
        {label:'VELORA',run:()=>this.startFamiliarObjectInteraction('luna',objectId)},
        {label:'CASCADE',run:()=>this.startFamiliarObjectInteraction('ember',objectId)},
        {label:'SOLSTICE',run:()=>this.startFamiliarObjectInteraction('nova',objectId)},
        {label:'AURELIA',primary:true,run:()=>this.startFamiliarObjectInteraction('mallow',objectId)}
    ]);
};

Game.prototype.openFamiliarLounge = function()
{
    this.createSparkles(1830,720,14);
    this.showInteractionPanel('Familiar Lounge','Dark College Common Room','Choose a familiar and they will travel to the velvet settee, settle in, and rest. The crystal beds are separate interactive resting places in the room.',[
        {label:'VELORA • REST',run:()=>this.startFamiliarObjectInteraction('luna','lounge')},
        {label:'CASCADE • CURL UP',run:()=>this.startFamiliarObjectInteraction('ember','lounge')},
        {label:'SOLSTICE • NAP',run:()=>this.startFamiliarObjectInteraction('nova','lounge')},
        {label:'AURELIA • NAP',primary:true,run:()=>this.startFamiliarObjectInteraction('mallow','lounge')}
    ]);
};


// =============================================================
// GAME CONFIG
// =============================================================

const config =
{
    type:
        Phaser.AUTO,

    width:
        1280,

    height:
        560,

    parent:
        'game-container',

    backgroundColor:
        '#120817',

    scale:
    {
        mode:
            Phaser.Scale.FIT,

        autoCenter:
            Phaser.Scale.CENTER_BOTH
    },

    scene:
    [
        Preloader,
        Game
    ]
};


// =============================================================
// START
// =============================================================

window.majickPhaserGame =
    new Phaser.Game(
        config
    );