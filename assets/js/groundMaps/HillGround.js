import {GroundMap} from "./GroundMap.js";
import {resources} from "../Resource.js";
import {Vector2} from "../Vector2.js";
import {gridCells} from "../helpers/grid.js";

export class HillGround extends GroundMap {
    static hillSheetParams = {
        resource: resources.images.ground,
        frameSize: new Vector2(18, 18),
        hFrames: 3,
        vFrames: 1
    };

    constructor() {
        super(gridCells(-15), gridCells(-8), 30*2, 16*2);

        this.addSpriteID(1, Object.assign({frame:0}, HillGround.hillSheetParams));
        this.addSpriteID(2, Object.assign({frame:1}, HillGround.hillSheetParams));
        this.addSpriteID(3, Object.assign({frame:2}, HillGround.hillSheetParams));

        for (let v=0; v<this.vFrames; v++) {
            this.spritesIdMap[v] = [];
            for (let h=0; h<this.hFrames; h++) {
                this.spritesIdMap[v][h] = Math.floor(Math.random() * 3) + 1;
            }
        }

        this.initMap();
    }
}