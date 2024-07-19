import {GameObject} from "../GameObject.js";
import {Vector2} from "../Vector2.js";
import {Sprite} from "../Sprite.js";
import {Hero} from "./Hero.js";
import {moveTowardsCenters} from "../helpers/moveTowards.js";
import {colliderStore} from "../ColliderStore.js";
import {events} from "../Events.js";
import {rectSpacingDistance} from "../helpers/rectSpacingDistance.js";
import {ColorRect} from "../ColorRect.js";

function lerp(start, end, amt) {
    return (1-amt)*start+amt*end
}

function calcAngle(cx, cy, ex, ey) {
    let dy = ey - cy;
    let dx = ex - cx;
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    // theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    // if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}

export class Enemy extends GameObject {
    constructor(x, y, hero, width, height, isCollider=true) {
        super({
            position: new Vector2(x, y),
            isCollider: isCollider
        });

        this.hero = hero;
        this.width = width ?? 0;
        this.height = height ?? 0;

        this.facingDirection = "RIGHT";
        this.destinationPosition = this.prevPosition = this.position.duplicate();
        this.isMoving = true;

        this.xpGive = 0;

        events.on("COLLISIONS_UPDATE", this, () => {
            const thisCollisions = colliderStore.collisions.get(this) ?? new Set();
            if (this.isCollider && thisCollisions.size > 0) {
                let angle, len, dist;
                for (let other of thisCollisions) {
                    dist = rectSpacingDistance(this, other);
                    angle = calcAngle(this.center.x, this.center.y, other.center.x, other.center.y);
                    len = lerp(2, 0, dist/this.width);
                    if (other === this.hero) {
                        other.getForce(Math.cos(angle) * len * 0.2, Math.sin(angle) * len * 0.2);
                        this.getForce(Math.cos(angle + Math.PI) * len, 0);
                        other.tryEmitPosition();
                    } else {
                        other.getForce(Math.cos(angle) * len * 0.5, Math.sin(angle) * len * 0.5);
                        if (this.isMoving)
                            this.getForce(Math.cos(angle + Math.PI) * len * 0.5, Math.sin(angle + Math.PI) * len * 0.5);
                    }
                }
            }
        });

        this.healthBar = new ColorRect({
            position: new Vector2(-this.width*0.1, -5),
            width: Math.floor(this.width*1.2),
            height: 0,
            color: "black"
        });
        this.addChild(this.healthBar);
        this.healthBarGreen = new ColorRect({
            position: new Vector2(-this.width*0.1, -5),
            width: Math.floor(this.width*1.2),
            height: 0,
            color: "red"
        });
        this.addChild(this.healthBarGreen);
        if (this.currHealth>=this.maxHealth) {
            this.healthBar.height = 0;
            this.healthBarGreen.height = 0;
        }
    }

    step(delta) {
        // const hero = root.children.find((el) => el instanceof Hero);
        // const distance = moveTowards(this, this.heroPosition, this.speed);
        // this.destinationPosition = this.position.duplicate();
        this.prevPosition = this.position.duplicate();
        if (this.isMoving) moveTowardsCenters(this, this.hero.center, this.speed);
        // this.destinationPosition = this.position.duplicate();
        if (this.currHealth<this.maxHealth) {
            this.healthBar.height = 1;
            this.healthBarGreen.height = 1;
            this.healthBarGreen.width = this.healthBar.width * (this.currHealth / this.maxHealth);
        } else {
            this.healthBar.height = 0;
            this.healthBarGreen.height = 0;
        }
    }

    getForce(x, y) {
        if ([...colliderStore.collisions.get(this)].some((x) => colliderStore.walls.has(x))) {
            this.position = this.prevPosition;
        } else {
            this.position.x += x;
            this.position.y += y;
        }
        // this.position = this.prevPosition;
    }

    getHit(hero) {
        this.currHealth -= hero.attackDamage;
        this.currHealth = this.currHealth < 0 ? 0 : this.currHealth;
        if (this.currHealth === 0) {
            events.emit("EXPERIENCE_GIVE", this.xpGive);
            this.destroy()
        }
    }
}

