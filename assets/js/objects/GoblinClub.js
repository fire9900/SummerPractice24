import {Enemy} from "./Enemy.js";
import {Vector2} from "../Vector2.js";
import {resources} from "../Resource.js";
import {Animations} from "../Animations.js";
import {FrameIndexPattern} from "../FrameIndexPattern.js";
import {ATTACK_LEFT, ATTACK_RIGHT, STAND_LEFT, STAND_RIGHT, WALK_LEFT, WALK_RIGHT} from "./goblinClubAnimations.js";
import {Sprite} from "../Sprite.js";
import {rectSpacingDistance} from "../helpers/rectSpacingDistance.js";
import {timers} from "../Timers.js";
import {Timer} from "../Timer.js";
import {rectCollide} from "../helpers/rectCollide.js";
import {Rect} from "./Rect.js";

export class GoblinClub extends Enemy {
    constructor(x, y, hero, isCollider=true) {
        super(x, y, hero, 16, 26, isCollider);

        this.speed = 1;
        this.attackDistance = 2;
        this.attackRange = 20;
        this.attackDamage = 2;
        this.maxHealth = 10;
        this.currHealth = 10;
        this.xpGive = 12;

        this.body = new Sprite({
            resource: resources.images.goblinClub,
            frameSize: new Vector2(64, 64),
            hFrames: 6,
            vFrames: 11,
            frame: 1,
            position: new Vector2(-24, -25),
            animations: new Animations({
                standRight: new FrameIndexPattern(STAND_RIGHT),
                standLeft: new FrameIndexPattern(STAND_LEFT),
                walkLeft: new FrameIndexPattern(WALK_LEFT),
                walkRight: new FrameIndexPattern(WALK_RIGHT),
                attackRight: new FrameIndexPattern(ATTACK_RIGHT),
                attackLeft: new FrameIndexPattern(ATTACK_LEFT),
            })
        });
        this.addChild(this.body);

        this.attackTimer = new Timer(ATTACK_RIGHT.duration, [
            {time: ATTACK_RIGHT.duration * 0.66, cb: () => {
                if ((this.facingDirection === "RIGHT" &&
                        rectCollide(new Rect(new Vector2(this.position.x+this.width, this.position.y), this.attackRange, this.height), this.hero)) ||
                    (this.facingDirection === "LEFT" &&
                        rectCollide(new Rect(new Vector2(this.position.x-this.attackRange, this.position.y), this.attackRange, this.height), this.hero)) ||
                    rectCollide(new Rect(new Vector2(this.position.x-this.attackRange/4, this.position.y-this.attackRange/2), this.width+this.attackRange/2, this.attackRange/2), this.hero) ||
                    rectCollide(new Rect(new Vector2(this.position.x-this.attackRange/4, this.position.y+this.height), this.width+this.attackRange/2, this.attackRange/2), this.hero)
                ) {
                    this.hero.getHit(this);
                }
            }},
            {time: ATTACK_RIGHT.duration, cb: () => this.isMoving = true}
        ]);
    }

    step(delta) {
        super.step(delta);
        if (this.isMoving) {
            if (this.hero.position.x + this.hero.width/2 < this.position.x + this.width/2) {
                this.facingDirection = "LEFT";
                this.body.animations.play("walkLeft");
            }
            if (this.hero.position.x + this.hero.width/2 > this.position.x + this.width/2) {
                this.facingDirection = "RIGHT";
                this.body.animations.play("walkRight");
            }
        }

        if (rectSpacingDistance(this, this.hero) < this.attackDistance &&
            ((this.facingDirection === "RIGHT" && this.body.animations.activeKey !== "attackRight") ||
            (this.facingDirection === "LEFT" && this.body.animations.activeKey !== "attackLeft"))) {
            this.isMoving = false;
            this.body.animations.play(this.facingDirection === "RIGHT" ? "attackRight" : "attackLeft");
            timers.addTimer(this.attackTimer);
        }
    }
}