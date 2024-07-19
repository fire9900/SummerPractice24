import {GameObject} from "./GameObject.js";

class Timers extends GameObject {
    constructor() {
        super({});
    }

    addTimer(Timer) {
        if (this.children.includes(Timer)) return;
        this.addChild(Timer);
    }
}

export const timers = new Timers();