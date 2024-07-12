import {Vector2} from "./Vector2.js";
import {GameObject} from "./GameObject.js";
import {resources} from "./Resource.js";
import {Sprite} from "./Sprite.js";
import {GameLoop} from "./GameLoop.js";



const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Создание главной сцены
const mainScene = new GameObject({
    position: new Vector2(0,0)
})

const groundSprite = new Sprite({
    resource: resources.images.ground,
    frameSize: new Vector2(16, 16),
    hFrames: 13,
    vFrames: 11,
    frame: 74
})
mainScene.addChild(groundSprite);

// Establish update and draw loops
const update = (delta) => {
    mainScene.stepEntry(delta, mainScene)
};
const draw = () => {

    // Clear anything stale
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // Save the current state (for camera offset)
    ctx.save();


    // Draw objects in the mounted scene
    mainScene.draw(ctx, 0, 0);

    // Restore to original state
    ctx.restore();

}

// Start the game!
const gameLoop = new GameLoop(update, draw);
gameLoop.start();


