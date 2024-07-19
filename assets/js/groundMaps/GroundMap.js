import {GameObject} from "../GameObject.js";
import {Vector2} from "../Vector2.js";
import {Sprite} from "../Sprite.js";
import {gridCells} from "../helpers/grid.js";
import {Rect} from "../objects/Rect.js";

export class GroundMap extends GameObject {
    constructor(x, y, hFrames, vFrames) {
        super({
            position: new Vector2(x, y),
            width: gridCells(hFrames),
            height: gridCells(vFrames)
        });
        this.hFrames = hFrames ?? 1;
        this.vFrames = vFrames ?? 1;
        this.sprites = {};
        this.spritesIdMap = [];
        this.spritesMap = [];
        this.layer = -1;

        this.walls = [];
        // this.walls.push(new Rect(new Vector2(gridCells(-1), gridCells(-1)), gridCells(hFrames+1), gridCells(1)));
        // this.walls.push(new Rect(new Vector2(gridCells(-1), gridCells(vFrames)), gridCells(hFrames+1), gridCells(1)));
        // this.walls.push(new Rect(new Vector2(gridCells(hFrames), 0), gridCells(1), gridCells(vFrames)));
        // this.walls.push(new Rect(new Vector2(gridCells(hFrames), 0), gridCells(1), gridCells(vFrames)));

        this.walls.push(new GameObject({
            position: new Vector2(this.position.x-gridCells(1), this.position.y-gridCells(1)),
            width: gridCells(hFrames+2),
            height: gridCells(1),
            isCollider: true,
            isWall: true
        }));
        this.walls.push(new GameObject({
            position: new Vector2(this.position.x-gridCells(1), this.position.y-gridCells(1)),
            width: gridCells(1),
            height: gridCells(vFrames+2),
            isCollider: true,
            isWall: true
        }));
        this.walls.push(new GameObject({
            position: new Vector2(this.position.x+this.width, this.position.y-gridCells(1)),
            width: gridCells(1),
            height: gridCells(vFrames+2),
            isCollider: true,
            isWall: true
        }));
        this.walls.push(new GameObject({
            position: new Vector2(this.position.x-gridCells(1), this.position.y+this.height),
            width: gridCells(hFrames+2),
            height: gridCells(1),
            isCollider: true,
            isWall: true
        }));
        for (let wall of this.walls) {
            this.addChild(wall);
        }
    }

    addSpriteID(id, {resource, frameSize, hFrames, vFrames, frame, scale, position, animations}) {
        this.sprites[id] = {resource, frameSize, hFrames, vFrames, frame, scale, position, animations};
    }

    addSprites(spritesID) {
        for (let n = 0; n < spritesID.length; n++) {
            this.addSpriteID(spritesID[n])
        }
    }

    initMap() {
        let currParams;
        for (let v=0; v<this.vFrames; v++) {
            this.spritesMap[v] = [];
            for (let h=0; h<this.hFrames; h++) {
                currParams = Object.assign({}, this.sprites[this.spritesIdMap[v][h]]);
                currParams.position = new Vector2(gridCells(h)-1, gridCells(v)-1); // -1 нужен из-за отсупа в sheet'е (баг с bleeding sprites)
                this.spritesMap[v][h] = new Sprite(currParams);
                this.addChild(this.spritesMap[v][h]);
            }
        }
    }
}