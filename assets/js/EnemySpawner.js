import {GameObject} from "./GameObject.js";
import {Rect} from "./objects/Rect.js";
import {Vector2} from "./Vector2.js";
import {colliderStore} from "./ColliderStore.js";
import {rectCollide} from "./helpers/rectCollide.js";

export class EnemySpawner extends GameObject {
    constructor(hero, groundMap, spawnsConfig=[]) {
        super({});
        this.hero = hero;
        this.groundMap = groundMap;
        this.spawns = spawnsConfig;
        // [
        //     {
        //         timeStart: 0,
        //         timeEnd: 1000, -1 = infinity
        //         enemy: GoblinClub,
        //         enemyNum: 1,
        //         lastSpawnTime: 0,
        //         enemySpawnDelay: 200
        //     }, ...
        // ];
        for (let spawn of this.spawns) {
            spawn.lastSpawnTime = 0;
        }
        this.spawning = new Set();
        this.time = 0;
    }

    step(delta, root) {
        this.time += delta;
        for (let spawn of this.spawns) {
            if (spawn.timeStart < this.time && (spawn.timeEnd === -1 || spawn.timeEnd > this.time)) {
                if (spawn.lastSpawnTime + spawn.enemySpawnDelay < this.time) {
                    this.spawnEnemy(root, spawn.enemy, spawn.enemyNum);
                    spawn.lastSpawnTime = this.time;
                }
            }
        }

        for (let spawning of this.spawning) {
            if (this.groundMap.position.x < spawning.position.x &&
                this.groundMap.position.y < spawning.position.y &&
                spawning.position.x + spawning.width < this.groundMap.position.x + this.groundMap.width &&
                spawning.position.y + spawning.height < this.groundMap.position.y + this.groundMap.height &&
                !Array.from(colliderStore.walls).some((wall) => {rectCollide(wall, spawning)})) {
                spawning.isCollider = true;
                colliderStore.addCollider(spawning);
                this.spawning.delete(spawning);
            }
        }
    }

    spawnEnemy(root, enemy, n=1) {
        for (let i=0; i<n; i++) {
            const randPosition =this.getRandomPosition();
            const entity = new enemy(randPosition.x, randPosition.y, this.hero, false);
            this.spawning.add(entity);
            root.addChild(entity);
        }
    }

    getRandomPosition() {
        const canvasWidth = 480;
        const canvasHeight = 256;
        const heroPosition = this.hero.position;
        const viewRect = new Rect(new Vector2(heroPosition.x - canvasWidth/2 + this.hero.width/2,
            heroPosition.y - canvasHeight/2 + this.hero.height/2), canvasWidth, canvasHeight);
        const spawnRect = viewRect.duplicate();
        const randScale = Math.random() * (1.5 - 1.1) + 1.1;
        spawnRect.width *= randScale;
        spawnRect.height *= randScale;
        spawnRect.position.x -= (spawnRect.width - viewRect.width) * 0.5;
        spawnRect.position.y -= (spawnRect.height - viewRect.height) * 0.5;
        const randDirection = Math.floor(Math.random() * 4);
        switch (randDirection) {
            case 0: return new Vector2(spawnRect.position.x + spawnRect.width * Math.random(), spawnRect.position.y);
            case 1: return new Vector2(spawnRect.position.x + spawnRect.width, spawnRect.position.y + spawnRect.height * Math.random());
            case 2: return new Vector2(spawnRect.position.x + spawnRect.width * Math.random(), spawnRect.position.y + spawnRect.height);
            case 3: return new Vector2(spawnRect.position.x, spawnRect.position.y + spawnRect.height * Math.random());
        }
    }
}