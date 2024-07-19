import {GameObject} from "./GameObject.js";

export class Scene extends GameObject {
    constructor({position}) {
        super({position});
    }

    step(delta) {
        this.children.sort((a, b) => {
            const layer1 = a.layer ?? 0;
            const layer2 = b.layer ?? 0;
            if (layer1 !== layer2) return layer1 - layer2;

            const bottom1 = a.height ? a.position.y + a.height :  a.position.y;
            const bottom2 = b.height ? b.position.y + b.height :  b.position.y;
            return bottom1 - bottom2;
        })
    }
}