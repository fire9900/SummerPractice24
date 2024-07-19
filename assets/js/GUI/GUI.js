import {GameObject} from "../GameObject.js";
import {Vector2} from "../Vector2.js";
import {Sprite} from "../Sprite.js";
import {resources} from "../Resource.js";
import {events} from "../Events.js";

export class GUI extends GameObject {
    constructor(canvas, hero) {
        super({
            width: canvas.width,
            height: canvas.height
        });

        this.hero = hero;

        this.healthBarOffsetX = 16;
        this.health = new Sprite({
            resource: resources.images.health,
            frameSize: new Vector2(64,16),
            position: new Vector2(0, 1),
        });
        this.addChild(this.health);

        this.healthBar = new Sprite({
            resource: resources.images.healthBar,
            frameSize: new Vector2(this.healthBarOffsetX + 48 * (this.hero.currHealth / this.hero.maxHealth),16),
            position: new Vector2(0, 1),
        });
        this.addChild(this.healthBar);

        this.healthHeart = new Sprite({
            resource: resources.images.healthHeart,
            frameSize: new Vector2(16,16),
            vFrames: 1,
            hFrames: 5,
            frame: 0,
            position: new Vector2(0, 1),
        });
        this.addChild(this.healthHeart);

        events.on("HERO_HEALTH_UPDATE", this, this.healthBarUpdate);

        this.xpBarOffsetX = 11;
        this.xp = new Sprite({
            resource: resources.images.xp,
            frameSize: new Vector2(192,16),
            position: new Vector2((this.width - 192) / 2, this.height - 32),
        });
        this.addChild(this.xp);
        this.xpBar = new Sprite({
            resource: resources.images.xpBar,
            frameSize: new Vector2(this.xpBarOffsetX + 170 * ((this.hero.currXp-this.hero.xpRequirements[this.hero.level-1]) / this.hero.xpRequirements[this.hero.level]),16),
            position: new Vector2((this.width - 192) / 2, this.height - 32),
        });
        this.addChild(this.xpBar);

        events.on("EXPERIENCE_GIVE", this, this.xpBarUpdate);
    }

    healthBarUpdate() {
        const gui = this.caller;
        gui.healthBar.frameSize.x = gui.healthBarOffsetX + 48 * (gui.hero.currHealth / gui.hero.maxHealth);
        gui.healthHeart.frame = 4 - Math.ceil(gui.hero.currHealth / (gui.hero.maxHealth / 4));
        // console.log(16 + 48 * (gui.her o.currHealth / gui.hero.maxHealth));
        // console.log(gui.hero.currHealth);
    }

    xpBarUpdate() {
        const gui = this.caller;
        gui.xpBar.frameSize.x = gui.xpBarOffsetX + 170 * ((gui.hero.currXp-gui.hero.xpRequirements[gui.hero.level-1]) / gui.hero.xpRequirements[gui.hero.level]);
    }
}