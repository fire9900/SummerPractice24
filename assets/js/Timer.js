import {GameObject} from "./GameObject.js";

export class Timer extends GameObject{
    constructor(time, callbacksConfig) {
        super({});
        this.currentTime = 0;
        this.duration = time;
        this.callbacksConfig = callbacksConfig;
        for (let callback of this.callbacksConfig) callback.hasBeenCalled = false;
    }

    step(delta) {
        this.currentTime += delta;
        for (let callback of this.callbacksConfig) {
            if (!callback.hasBeenCalled && this.currentTime+1 >= callback.time) {
                callback.cb();
                callback.hasBeenCalled = true;
            }
        }
        if (this.currentTime+1 >= this.duration) {
            this.currentTime = 0;
            for (let callback of this.callbacksConfig) callback.hasBeenCalled=false;
            this.destroy();
        }
    }
}