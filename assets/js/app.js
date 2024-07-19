import {Vector2} from "./Vector2.js";
import {GameObject} from "./GameObject.js";
import {resources} from "./Resource.js";
import {Sprite} from "./Sprite.js";
import {GameLoop} from "./GameLoop.js";
import {HillGround} from "./groundMaps/HillGround.js";
import {Hero} from "./objects/Hero.js";
import {gridCells} from "./helpers/grid.js";
import {Input} from "./Input.js";
import {Camera} from "./Camera.js";
import {GoblinClub} from "./objects/GoblinClub.js";
import {colliderStore} from "./ColliderStore.js";
import {timers} from "./Timers.js";
import {GUI} from "./GUI/GUI.js";
import {Scene} from "./Scene.js";
import {events} from "./Events.js";
import {EnemySpawner} from "./EnemySpawner.js";


const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

// Создание главной сцены
const mainScene = new Scene({
    position: new Vector2(0,0)
});

const hillGround = new HillGround();
mainScene.addChild(hillGround);

const hero = new Hero(canvas.width/2, canvas.height/2);
// const test_enemy1 = new GoblinClub(gridCells(10), gridCells(5), hero);
// mainScene.addChild(test_enemy1);
// const test_enemy2 = new GoblinClub(gridCells(24), gridCells(7), hero);
// mainScene.addChild(test_enemy2);
// const test_enemy3 = new GoblinClub(gridCells(2), gridCells(11), hero);
// mainScene.addChild(test_enemy3);
// const test_enemy4 = new GoblinClub(gridCells(8), gridCells(15), hero);
// mainScene.addChild(test_enemy4);

    // let i = 5, c;
    // while (i> 0) {
    //     c = new GoblinClub(gridCells(8), gridCells(15), hero);
    //     mainScene.addChild(c);
    //     i--;
    // }

mainScene.addChild(hero);

const enemySpawner = new EnemySpawner(hero, hillGround, [
    {
        timeStart: 0,
        timeEnd: -1,
        enemy: GoblinClub,
        enemyNum: 1,
        // lastSpawnTime: 0,
        enemySpawnDelay: 2000
    }
]);
mainScene.addChild(enemySpawner);

const camera = new Camera(hillGround, hero);
mainScene.addChild(camera);

mainScene.input = new Input();
mainScene.addChild(timers);
mainScene.addChild(colliderStore);

const gui = new GUI(canvas, hero);

// Establish update and draw loops
const update = (delta) => {
    mainScene.stepEntry(delta, mainScene);
    // console.log(colliderStore.collisions.get(hero));
};
const draw = () => {

    // Clear anything stale
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // Save the current state (for camera offset)
    ctx.save();

    //Offset by camera position
    ctx.translate(camera.position.x, camera.position.y);

    // Draw objects in the mounted scene
    mainScene.draw(ctx, 0, 0);


    // ctx.beginPath();
    // ctx.rect(hero.position.x, hero.position.y, hero.width, hero.height);
    // ctx.fillStyle = "black";
    // ctx.fill();
    //
    // ctx.beginPath();
    // ctx.rect(test_enemy1.position.x, test_enemy1.position.y, test_enemy1.width, test_enemy1.height);
    // ctx.fillStyle = "green";
    // ctx.fill();

    // Restore to original state
    ctx.restore();

    gui.draw(ctx, 0, 0);
}

// Запуск игры
const gameLoop = new GameLoop(update, draw);
gameLoop.start();

const ui = document.getElementsByClassName("ui")[0];


events.on("HERO_DEATH", this, () => {
    gameLoop.stop();
    document.getElementById("gameover").style.visibility = "visible";
});

window.onbeforeunload = function() {
    // Не уходите, еще не все сохранено!
    let changesMade = 1;
    return changesMade ? "Игра начнётся заново!" : undefined;
};