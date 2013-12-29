var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        _super.apply(this, arguments);
    }
    BootState.prototype.preload = function () {
        this.load.image("preloadBar", "assets/textures/loader.png");
    };

    BootState.prototype.create = function () {
        this.game.state.start("Preloader", true, false);
    };
    return BootState;
})(Phaser.State);

var PreloaderState = (function (_super) {
    __extends(PreloaderState, _super);
    function PreloaderState() {
        _super.apply(this, arguments);
    }
    PreloaderState.prototype.preload = function () {
        this.ready = false;
        this.preloadBar = this.add.sprite(200, 250, 'preloadBar');

        var style = { font: "40px Arial", fill: "#ff0044", align: "center" };
        this.txt = this.add.text(this.world.centerX, 400, "Loading...\nThis could take a while.\n(but relative to the the Green Gi\nit will seem fast)", style);
        this.txt.anchor.setTo(0.5, 0.5);

        this.load.setPreloadSprite(this.preloadBar);

        this.load.audio('bgMusic', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/bodenstaendig_2000_in_rock_4bit.mp3']);

        this.load.image("platform", "assets/textures/platform.png");
        this.load.image("greenGi", "assets/textures/greenGiLogo.png");
        this.load.image("toad", "assets/textures/toad.png");

        this.load.image("belt", "assets/textures/belt.png");
        this.load.image("patch", "assets/textures/patch.png");
        this.load.image("book", "assets/textures/book.png");
        this.load.image("email", "assets/textures/email.png");
        this.load.image("gi", "assets/textures/gi.png");

        //NOTE: the ts definition file was not correct here - send an update
        this.load.spritesheet('guy', 'assets/textures/KarateGuy.png', 48, 96);
        this.load.spritesheet('unicorn', "assets/textures/unicorn.png", 200, 160);

        this.load.image("buttonLeft", "assets/textures/button_left.png");
        this.load.image("buttonRight", "assets/textures/button_right.png");
        this.load.image("buttonOK", "assets/textures/button_circle.png");
    };

    PreloaderState.prototype.create = function () {
    };

    PreloaderState.prototype.update = function () {
        //        You don't actually need to do this, but I find it gives a much smoother game experience.
        //        Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
        //        You can jump right into the menu if you want and still play the music, but you'll have a few
        //        seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
        //        it's best to wait for it to decode here first, then carry on.
        //        If you don't have any music in your game then put the game.state.start line into the create function and delete
        //        the update function completely.
        if (this.cache.isSoundDecoded('bgMusic') && this.ready == false) {
            //if (this.ready == false) {
            this.ready = true;

            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startPlaying, this);
        }
    };

    PreloaderState.prototype.startPlaying = function () {
        this.game.state.start("Playing");
    };
    return PreloaderState;
})(Phaser.State);

var XStateManager = (function () {
    function XStateManager() {
    }
    XStateManager.prototype.nextState = function (state) {
        if (this.currentState)
            this.currentState.exit();

        this.currentState = state;

        state.enter();
    };
    return XStateManager;
})();

var DetermineNextLevel = (function () {
    function DetermineNextLevel(game, p) {
        this.game = game;
        this.p = p;
    }
    DetermineNextLevel.prototype.enter = function () {
        this.p.level++;

        for (var i = 0; i < this.p.spritesToKill.length; i++) {
            this.p.spritesToKill[i].kill();
        }

        //This is lazy
        this.p.spritesToKill = new Array();

        var nextState;

        if (this.p.level === 1) {
            console.log("Level 1");
            nextState = new ShowTextUntilDismissed(this.game, this.p, "Press Enter to pay $200 for your Green Gi!", new UpdateScore(this.game, this.p, new GoPickUpTheGreenGi(this.game, this.p, false, new RaiseUpSprite(this.game, this.p, "patch", new ShowTextUntilDismissed(this.game, this.p, "You found a Green Gi Patch!\nBut you don't have a Green Gi to put it on...", new DetermineNextLevel(this.game, this.p))))));
        } else if (this.p.level === 2) {
            console.log("Level 2");
            nextState = new GoPickUpTheGreenGi(this.game, this.p, true, new RaiseUpSprite(this.game, this.p, "belt", new ShowTextUntilDismissed(this.game, this.p, "You found a Green Gi Belt!\nBut you don't have a Green Gi to keep closed", new DetermineNextLevel(this.game, this.p))));
        } else if (this.p.level === 3) {
            console.log("Level 3");
            nextState = new GoPickUpTheGreenGi(this.game, this.p, true, new RaiseUpSprite(this.game, this.p, "book", new ShowTextUntilDismissed(this.game, this.p, "You found a Facebook post!\nIt has pictures of hemp fabric!", new DetermineNextLevel(this.game, this.p))));
        } else if (this.p.level === 4) {
            console.log("Level 4");
            nextState = new GoPickUpTheGreenGi(this.game, this.p, true, new RaiseUpSprite(this.game, this.p, "email", new ShowTextUntilDismissed(this.game, this.p, "You found an email!\nIt promises the Green Gi\nwill be available in the next level!", new DetermineNextLevel(this.game, this.p))));
        } else if (this.p.level === 5) {
            console.log("Level 5");
            nextState = new GoPickUpTheGreenGi(this.game, this.p, true, new ShowUnicorn(this.game, this.p, new ShowTextUntilDismissed(this.game, this.p, "You found a Unicorn!\nBoth it and the Green Gi are Mythical Beasts!\n(This level is dedicated to Billy Dowey)", new DetermineNextLevel(this.game, this.p))));
        } else if (this.p.level === 6) {
            console.log("Level 6");
            nextState = new GoPickUpTheGreenGi(this.game, this.p, true, new RaiseUpSprite(this.game, this.p, "email", new ShowTextUntilDismissed(this.game, this.p, "You found another email!\nIt promises the Green Gi\nwill be available in the next level!\n(For real this time)", new DetermineNextLevel(this.game, this.p))));
        } else if (this.p.level === 7) {
            console.log("Level 7");
            nextState = new GoPickUpTheGreenGi(this.game, this.p, true, new ShowToad(this.game, this.p, new ShowTextUntilDismissed(this.game, this.p, "Thank You Bro!\nBut Our Green Gi is in another castle!", new DetermineNextLevel(this.game, this.p))));
        } else if (this.p.level === 8) {
            console.log("Level 8");
            nextState = new GoPickUpTheGreenGi(this.game, this.p, true, new RaiseUpSprite(this.game, this.p, "book", new ShowTextUntilDismissed(this.game, this.p, "You found another Facebook post!\nIt has pictures of Green Gis being shipped!", new DetermineNextLevel(this.game, this.p))));
        } else if (this.p.level === 9) {
            console.log("Level 9");
            nextState = new GoPickUpTheGreenGi(this.game, this.p, true, new RaiseUpSprite(this.game, this.p, "gi", new ShowTextUntilDismissed(this.game, this.p, "You finally found a Green Gi!", new ShowRipText(this.game, this.p, new ShowTextUntilDismissed(this.game, this.p, "Sorry, the pants ripped.\nYou have to send it back...", new DetermineNextLevel(this.game, this.p))))));
        } else {
            this.p.theMusic.stop();
            this.game.state.start("GameOver");
            return;
        }

        this.p.stateManager.nextState(nextState);
    };

    DetermineNextLevel.prototype.update = function () {
    };

    DetermineNextLevel.prototype.exit = function () {
    };
    return DetermineNextLevel;
})();

var UpdateScore = (function () {
    function UpdateScore(game, p, next) {
        this.game = game;
        this.p = p;
        this.next = next;
    }
    UpdateScore.prototype.enter = function () {
        var style = { font: "60px Arial", fill: "#000000", align: "center" };
        this.game.add.text(0, 0, "SCORE: -$200", style);
        this.p.stateManager.nextState(this.next);
    };

    UpdateScore.prototype.update = function () {
    };

    UpdateScore.prototype.exit = function () {
    };
    return UpdateScore;
})();

var ShowToad = (function () {
    function ShowToad(game, p, next) {
        this.game = game;
        this.p = p;
        this.next = next;
    }
    ShowToad.prototype.enter = function () {
        var toad = this.game.add.sprite(this.game.world.width - 100, this.game.world.height - 64 - 48, "toad");
        this.p.spritesToKill.push(toad);
        this.p.stateManager.nextState(this.next);
    };

    ShowToad.prototype.update = function () {
    };

    ShowToad.prototype.exit = function () {
    };
    return ShowToad;
})();

var ShowUnicorn = (function () {
    function ShowUnicorn(game, p, next) {
        this.game = game;
        this.p = p;
        this.next = next;
    }
    ShowUnicorn.prototype.enter = function () {
        this.unicorn = this.game.add.sprite(this.game.world.width - 100, this.game.world.height - 64 - 146, "unicorn");
        this.unicorn.anchor.setTo(0.5, 0);
        this.unicorn.animations.add("idle", [0], 10, false);
        this.unicorn.animations.add("walk", [0, 1], 10, true);
        this.unicorn.animations.play("walk");

        this.p.spritesToKill.push(this.unicorn);

        this.unicorn.scale.x = -1;
        var tween = this.game.add.tween(this.unicorn).to({ x: 200 }, 2000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.finishTween1, this);
    };

    ShowUnicorn.prototype.finishTween1 = function () {
        this.unicorn.scale.x = 1;
        var tween = this.game.add.tween(this.unicorn).to({ x: this.game.world.centerX }, 2500, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.finishTween2, this);
    };

    ShowUnicorn.prototype.finishTween2 = function () {
        this.unicorn.animations.play("idle");
        this.p.stateManager.nextState(this.next);
    };

    ShowUnicorn.prototype.update = function () {
    };

    ShowUnicorn.prototype.exit = function () {
    };
    return ShowUnicorn;
})();

var ShowRipText = (function () {
    function ShowRipText(game, p, next) {
        this.game = game;
        this.p = p;
        this.next = next;
    }
    ShowRipText.prototype.enter = function () {
        var style = { font: "40px Arial", fill: "#ff0044", align: "center" };
        this.txt = this.game.add.text(this.game.world.width - 75 - 100, this.game.world.height - 75 - 64 - 30, "**RIP**", style);

        var tween = this.game.add.tween(this.txt).to({ y: this.game.world.height - 75 - 64 - 80 }, 2000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.finishTween, this);
    };

    ShowRipText.prototype.finishTween = function () {
        this.p.stateManager.nextState(this.next);
    };

    ShowRipText.prototype.update = function () {
    };

    ShowRipText.prototype.exit = function () {
        this.txt.destroy();
    };
    return ShowRipText;
})();

var RaiseUpSprite = (function () {
    function RaiseUpSprite(game, p, key, next) {
        this.game = game;
        this.p = p;
        this.key = key;
        this.next = next;
    }
    RaiseUpSprite.prototype.enter = function () {
        this.theSprite = this.game.add.sprite(this.game.world.width - 75 - 100, this.game.world.height - 75 - 64 - 30, this.key);
        this.p.spritesToKill.push(this.theSprite);

        var tween = this.game.add.tween(this.theSprite).to({ y: this.game.world.height - 75 - 64 - 80 }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.finishTween, this);
    };

    RaiseUpSprite.prototype.finishTween = function () {
        this.p.stateManager.nextState(this.next);
    };

    RaiseUpSprite.prototype.update = function () {
    };

    RaiseUpSprite.prototype.exit = function () {
    };
    return RaiseUpSprite;
})();

var ShowTextUntilDismissed = (function () {
    function ShowTextUntilDismissed(game, parent, msg, next) {
        this.game = game;
        this.p = parent;
        this.msg = msg;
        this.next = next;
    }
    ShowTextUntilDismissed.prototype.enter = function () {
        var style = { font: "40px Arial", fill: "#ff0044", align: "center" };
        this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 50, this.msg + "\n(Press Enter)", style);
        this.text.anchor.setTo(0.5, 0.5);
    };

    ShowTextUntilDismissed.prototype.update = function () {
        if (this.p.keyboard.enter() || this.p.gPad.ok()) {
            this.p.stateManager.nextState(this.next);
        }
    };

    ShowTextUntilDismissed.prototype.exit = function () {
        this.text.destroy();
    };
    return ShowTextUntilDismissed;
})();

var GoPickUpTheGreenGi = (function () {
    function GoPickUpTheGreenGi(game, p, respawnPlayer, next) {
        this.game = game;
        this.p = p;
        this.next = next;
        this.respawnPlayer = respawnPlayer;
        //console.log("RespawnPlayer=" + this.respawnPlayer);
    }
    GoPickUpTheGreenGi.prototype.enter = function () {
        if (this.respawnPlayer) {
            //console.log("Respawn");
            this.p.player.x = 10;
            this.p.player.y = this.game.world.centerY;
        }

        //Make the green Gi logo to go pick up
        this.greenGi = this.game.add.sprite(this.game.world.width - 75 - 50, this.game.world.height - 75 - 64 - 30, "greenGi");
    };

    GoPickUpTheGreenGi.prototype.update = function () {
        //Check for touching the green gi
        if (this.game.physics.overlap(this.p.player, this.greenGi)) {
            this.greenGi.kill();
            this.p.stateManager.nextState(this.next);
            return;
        }

        //Handle input
        if (this.p.keyboard.right() || this.p.gPad.right()) {
            this.p.player.body.velocity.x = 150;
            this.p.player.animations.play("walk");
        } else if (this.p.keyboard.left() || this.p.gPad.left()) {
            this.p.player.body.velocity.x = -150;
            this.p.player.animations.play("walk");
        } else {
            this.p.player.animations.play("idle");
        }
    };

    GoPickUpTheGreenGi.prototype.exit = function () {
        this.p.player.animations.play("idle");
    };
    return GoPickUpTheGreenGi;
})();

var PlayingState = (function (_super) {
    __extends(PlayingState, _super);
    function PlayingState() {
        _super.apply(this, arguments);
    }
    PlayingState.prototype.create = function () {
        this.spritesToKill = new Array();

        this.gPad = new VGamePad(this.game);

        this.game.stage.backgroundColor = '#B9D3EE';

        //Make cursor keys for input
        this.keyboard = new KeyboardHandler(this.game.input.keyboard);

        console.log("starting music...");
        this.theMusic = this.game.add.audio('bgMusic', 1, true);
        this.theMusic.play('', 0, 1, true);

        //Make the ground
        //Normal image is 400 x 32 but is scaled to 800 x 64
        var ground;
        ground = this.game.add.sprite(0, this.game.height - 64, "platform");
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;
        this.ground = ground;

        //Make the player
        var player;
        player = this.game.add.sprite(10, this.game.world.centerY, 'guy');
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 6;
        player.body.bounce.y = 0.2;

        player.animations.add("idle", [0], 1, true);
        player.animations.add("walk", [0, 1], 10, true);

        player.animations.play("idle");
        this.player = player;

        //Do this last so it's on top
        this.gPad.createButtons();

        this.level = 0;

        this.stateManager = new XStateManager();
        this.stateManager.nextState(new DetermineNextLevel(this.game, this));
    };

    PlayingState.prototype.update = function () {
        //Check collisions
        this.game.physics.collide(this.player, this.ground);

        //Always reset the player velocity to zero
        this.player.body.velocity.x = 0;

        //Update Inputs
        this.gPad.update();

        this.stateManager.currentState.update();
    };

    PlayingState.prototype.destroy = function () {
        //this.theMusic.stop();
    };
    return PlayingState;
})(Phaser.State);

var GameOverState = (function (_super) {
    __extends(GameOverState, _super);
    function GameOverState() {
        _super.apply(this, arguments);
    }
    GameOverState.prototype.create = function () {
        var style = { font: "40px Arial", fill: "#ff0044", align: "center" };
        this.txt = this.add.text(this.world.centerX, 300, "GAME OVER!\nYou didn't get a green gi.\nMaybe next year?", style);
        this.txt.anchor.setTo(0.5, 0.5);

        this.keyboard = new KeyboardHandler(this.game.input.keyboard);
        this.gPad = new VGamePad(this.game);
        this.gPad.createButtons();
    };

    GameOverState.prototype.update = function () {
        //Go back to playing after they press enter
        if (this.keyboard.enter() || this.gPad.ok()) {
            this.game.state.start("Playing");
        }
    };
    return GameOverState;
})(Phaser.State);

var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {});
        this.game.state.add("Boot", BootState, false);
        this.game.state.add("Preloader", PreloaderState, false);
        this.game.state.add("Playing", PlayingState, false);
        this.game.state.add("GameOver", GameOverState, false);

        this.game.state.start("Boot");
    }
    return SimpleGame;
})();

var KeyboardHandler = (function () {
    function KeyboardHandler(keyboard) {
        this._keyboard = keyboard;

        keyboard.addKeyCapture(Phaser.Keyboard.UP);
        keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
        keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
        keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
    }
    KeyboardHandler.prototype.right = function () {
        return this._keyboard.isDown(Phaser.Keyboard.RIGHT);
    };

    KeyboardHandler.prototype.left = function () {
        return this._keyboard.isDown(Phaser.Keyboard.LEFT);
    };

    KeyboardHandler.prototype.enter = function () {
        return this._keyboard.justPressed(Phaser.Keyboard.ENTER);
    };
    return KeyboardHandler;
})();

var VGamePad = (function () {
    function VGamePad(game) {
        this._game = game;
    }
    VGamePad.prototype.createButtons = function () {
        //Don't do anything if this is a desktop game
        if (this._game.device.desktop)
            return;

        this._btnLeft = new VGamePadKey(this._game.add.sprite(0 + 10, this._game.world.height - 10 - 64, "buttonLeft"));
        this._btnLeft.button.bringToTop();

        this._btnRight = new VGamePadKey(this._game.add.sprite(0 + 10 + 64 + 10, this._game.world.height - 10 - 64, "buttonRight"));
        this._btnRight.button.bringToTop();

        this._btnOK = new VGamePadKey(this._game.add.sprite(this._game.world.width - 10 - 64, this._game.world.height - 10 - 64, "buttonOK"));
        this._btnOK.button.bringToTop();

        this._pointers = new Array();
        this._pointers.push(this._game.input.pointer1);
        this._pointers.push(this._game.input.pointer2);

        this.enabled = true;
        //var style = { font: "40px Arial", fill: "#ff0044", align: "center" };
        //var text = this._game.add.text(this._game.world.centerX, this._game.world.centerY - 50, "Touch Enabled!", style);
        //text.anchor.setTo(0.5, 0.5);
    };

    VGamePad.prototype.update = function () {
        if (!this.enabled)
            return;

        //Reset all the buttons before the checks
        this._btnRight.isDown = false;
        this._btnLeft.isDown = false;
        this._btnOK.isDown = false;

        for (var i = 0; i < this._pointers.length; i++) {
            var pointer = this._pointers[i];

            if (pointer.isDown) {
                if (this._btnRight.button.bounds.contains(pointer.x, pointer.y)) {
                    this._btnRight.isDown = true;
                } else if (this._btnLeft.button.bounds.contains(pointer.x, pointer.y)) {
                    this._btnLeft.isDown = true;
                } else if (this._btnOK.button.bounds.contains(pointer.x, pointer.y)) {
                    this._btnOK.isDown = true;
                }
            }
        }
    };

    VGamePad.prototype.right = function () {
        if (!this.enabled)
            return false;

        return this._btnRight.isDown;
    };

    VGamePad.prototype.left = function () {
        if (!this.enabled)
            return false;

        return this._btnLeft.isDown;
    };

    VGamePad.prototype.ok = function () {
        if (!this.enabled)
            return false;

        return this._btnOK.isDown;
    };
    return VGamePad;
})();

var VGamePadKey = (function () {
    function VGamePadKey(button) {
        this.button = button;
    }
    return VGamePadKey;
})();

window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=app.js.map
