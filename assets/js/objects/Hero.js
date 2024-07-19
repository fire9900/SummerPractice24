import {GameObject} from "../GameObject.js";
import {Vector2} from "../Vector2.js";
import {Sprite} from "../Sprite.js";
import {resources} from "../Resource.js";
import {Animations} from "../Animations.js";
import {FrameIndexPattern} from "../FrameIndexPattern.js";
import {
    STAND_LEFT,
    STAND_RIGHT,
    WALK_LEFT,
    WALK_RIGHT,
    ATTACK_RIGHT,
    ATTACK_LEFT,
    HIT_RIGHT,
    HIT_LEFT,
    DEATH_RIGHT,
    DEATH_LEFT
} from "./heroAnimations.js";
import {DOWN, LEFT, RIGHT, UP} from "../Input.js";
import {moveTowardsCenters, moveTowardsPoints} from "../helpers/moveTowards.js";
import {isSpaceFree} from "../helpers/grid.js";
import {events} from "../Events.js";
import {colliderStore} from "../ColliderStore.js";
import {timers} from "../Timers.js";
import {Timer} from "../Timer.js";
import {rectCollide} from "../helpers/rectCollide.js";
import {Rect} from "./Rect.js";

export class Hero extends GameObject {
    constructor(x, y) {
        super({
            position: new Vector2(x-10, y-14),
            isCollider: true
        });

        this.isCollider = true;
        this.isMoving = true;
        this.isAttacking = false;
        this.isAlive = true;
        this.isGettingHit = false;
        this.isInvulnerable = false;

        this.width = 20;
        this.height = 38-10;

        this.maxHealth = 50;
        this.currHealth = this.maxHealth;
        this.attackRange = 30;
        this.attackDamage = 2;

        this.level = 1;
        this.xpRequirements = [0, 20, 45, 75, 110, 150, 195, 245, 300, 360];
        this.currXp = 0;

        this.body = new Sprite({
            resource: resources.images.hero,
            frameSize: new Vector2(120,80),
            hFrames: 10,
            vFrames: 9,
            frame: 1,
            position: new Vector2(-45, -41-10),
            animations: new Animations({
                standRight: new FrameIndexPattern(STAND_RIGHT),
                standLeft: new FrameIndexPattern(STAND_LEFT),
                walkRight: new FrameIndexPattern(WALK_RIGHT),
                walkLeft: new FrameIndexPattern(WALK_LEFT),
                attackRight: new FrameIndexPattern(ATTACK_RIGHT),
                attackLeft: new FrameIndexPattern(ATTACK_LEFT),
                hitRight: new FrameIndexPattern(HIT_RIGHT),
                hitLeft: new FrameIndexPattern(HIT_LEFT),
                deathRight: new FrameIndexPattern(DEATH_RIGHT),
                deathLeft: new FrameIndexPattern(DEATH_LEFT),
            })
        });
        this.addChild(this.body);

        this.facingDirection = RIGHT;
        this.destinationPosition = this.prevPosition = this.position.duplicate();
        // this.destinationPosition.x += this.width/2;
        // this.destinationPosition.y += this.height/2;
        // this.destinationPosition = this.center;
        // this.speed = 1;
        this.speed = 2;

        events.on("ATTACK_PRESSED", this, () => {
            this.isMoving = false;
            this.isAttacking = true;
        });
        this.attackTimer = new Timer(ATTACK_RIGHT.duration, [
            {time: ATTACK_RIGHT.duration * 0.5, cb: () => {
                    let i = 0;
                    while (i<colliderStore.sortedSAPColliders.length && colliderStore.sortedSAPColliders[i][1].position.x+colliderStore.sortedSAPColliders[i][1].width < this.position.x-this.attackRange) i++;
                    while (i<colliderStore.sortedSAPColliders.length && colliderStore.sortedSAPColliders[i][1].position.x < this.position.x+this.width+this.attackRange) {
                        if (colliderStore.sortedSAPColliders[i][1] === this) {
                            i++;
                            continue;
                        }
                        if ((this.facingDirection === "RIGHT" &&
                                rectCollide(new Rect(new Vector2(this.position.x+this.width, this.position.y-4), this.attackRange, this.height+4), colliderStore.sortedSAPColliders[i][1]) ||
                                rectCollide(new Rect(new Vector2(this.position.x-this.attackRange*0.7, this.position.y+this.height-this.attackRange/2), this.attackRange, this.attackRange/2), colliderStore.sortedSAPColliders[i][1])) ||
                            (this.facingDirection === "LEFT" &&
                                rectCollide(new Rect(new Vector2(this.position.x-this.attackRange, this.position.y-4), this.attackRange, this.height+4), colliderStore.sortedSAPColliders[i][1])) ||
                                rectCollide(new Rect(new Vector2(this.position.x+this.width, this.position.y+this.height-this.attackRange/2), this.attackRange*0.7,this.attackRange/2), colliderStore.sortedSAPColliders[i][1]) ||
                            rectCollide(new Rect(new Vector2(this.position.x-this.attackRange/4, this.position.y+this.height), this.width+this.attackRange/2, this.attackRange/4), colliderStore.sortedSAPColliders[i][1])
                        ) {
                            // console.log(colliderStore.sortedSAPColliders[i][1]);
                            try {
                                colliderStore.sortedSAPColliders[i][1].getHit(this);
                            } catch {}
                        }
                        i++;
                    }
            }},
            {time: ATTACK_RIGHT.duration, cb: () => {
                    this.isMoving = true;
                    this.isAttacking = false;
            }}
        ]);

        this.hitTimer = new Timer(HIT_RIGHT.duration+500, [
            {
                time: HIT_RIGHT.duration,
                cb: () => {this.isGettingHit=false}
            },
            {
                time: HIT_RIGHT.duration+500,
                cb: () => {this.isInvulnerable=false}
            }
        ]);

        this.deathTimer = new Timer(DEATH_RIGHT.duration, [
            {
                time:DEATH_RIGHT.duration,
                cb: () => {console.log("!");events.emit("HERO_DEATH")}
            }
        ]);

        events.on("EXPERIENCE_GIVE", this, xpAmount => {
            this.currXp += xpAmount;
            if (this.currXp >= this.xpRequirements[this.level]) {
                this.level += 1;
                events.emit("LEVEL_UP");
                // TODO: Звук LvlUp
            }
        });
    }

    step(delta, root) {
        // const distance = moveTowardsPoints(this, this.destinationPosition, this.speed);
        this.destinationPosition = this.prevPosition = this.position.duplicate();
        const {input} = root;

        if (!this.isAlive) {
            this.body.animations.play(this.facingDirection === RIGHT ? "deathRight" : "deathLeft");
            timers.addTimer(this.deathTimer);
            return;
        }else
        // if (this.body.animations.activeKey === "hitRight" || this.body.animations.activeKey === "hitLeft") {
        if (this.isGettingHit) {
            this.body.animations.play(this.facingDirection === RIGHT ? "hitRight" : "hitLeft");
            timers.addTimer(this.hitTimer);
        } else if (this.isMoving) {
            if (!input.direction) {
                if (this.facingDirection === LEFT) { this.body.animations.play("standLeft")}
                if (this.facingDirection === RIGHT) { this.body.animations.play("standRight")}
                return;
            }

            let nextX = this.destinationPosition.x;
            let nextY = this.destinationPosition.y;

            if (input.heldDirections.includes(DOWN) && input.heldDirections.includes(UP)) {
                if (input.heldDirections.indexOf(DOWN) < input.heldDirections.indexOf(UP)) {
                    nextY += this.speed;
                    this.body.animations.play(this.facingDirection === LEFT ? "walkLeft" : "walkRight");
                } else {
                    nextY -= this.speed;
                    this.body.animations.play(this.facingDirection === LEFT ? "walkLeft" : "walkRight");
                }
            } else {
                if (input.heldDirections.includes(DOWN)) {
                    nextY += this.speed;
                    this.body.animations.play(this.facingDirection === LEFT ? "walkLeft" : "walkRight");
                }
                if (input.heldDirections.includes(UP)) {
                    nextY -= this.speed;
                    this.body.animations.play(this.facingDirection === LEFT ? "walkLeft" : "walkRight");
                }
            }

            if (input.heldDirections.includes(LEFT) && input.heldDirections.includes(RIGHT)) {
                if (input.heldDirections.indexOf(LEFT) < input.heldDirections.indexOf(RIGHT)) {
                    nextX -= this.speed;
                    this.body.animations.play("walkLeft");
                } else {
                    nextX += this.speed;
                    this.body.animations.play("walkRight");
                }
            } else {
                if (input.heldDirections.includes(LEFT)) {
                    nextX -= this.speed;
                    this.body.animations.play("walkLeft");
                }
                if (input.heldDirections.includes(RIGHT)) {
                    nextX += this.speed;
                    this.body.animations.play("walkRight");
                }
            }

            if (input.direction && (input.heldDirections.includes(RIGHT) || input.heldDirections.includes(LEFT))) {
                if (input.heldDirections.includes(LEFT) && input.heldDirections.includes(RIGHT)) {
                    this.facingDirection = input.heldDirections.indexOf(LEFT) < input.heldDirections.indexOf(RIGHT) ? LEFT : RIGHT;
                } else {
                    this.facingDirection = input.heldDirections.includes(LEFT) ? LEFT : RIGHT;
                }
            }

            const distance = moveTowardsPoints(this, new Vector2(nextX, nextY), this.speed);
            this.tryEmitPosition();
        }
        else if (this.isAttacking) {
            this.body.animations.play(this.facingDirection === RIGHT ? "attackRight" : "attackLeft");
            timers.addTimer(this.attackTimer);
        }
    }

    tryEmitPosition() {
        if (this.lastX === this.position.x && this.lastY === this.position.y) {
            return;
        }
        this.lastX = this.position.x;
        this.lastY = this.position.y;
        events.emit("HERO_POSITION", this.position);
    }

    getHit(enemy) {
        if (this.isInvulnerable) return;
        this.currHealth -= enemy.attackDamage;
        this.currHealth = this.currHealth < 0 ? 0 : this.currHealth;
        events.emit("HERO_HEALTH_UPDATE");
        this.isGettingHit = true;
        this.isInvulnerable = true;
        if (this.currHealth === 0) {
            this.isAlive = false;
        }
    }

    getForce(x, y) {
        if ([...colliderStore.collisions.get(this)].some((x) => colliderStore.walls.has(x))) {
            this.position = this.prevPosition;
        } else {
            this.position.x += x;
            this.position.y += y;
        }
    }
}
