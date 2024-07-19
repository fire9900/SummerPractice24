import {Vector2} from "../Vector2.js";

export class Rect {
    constructor(position, width, height) {
        this.position = position ?? new Vector2();
        this.width = width ?? 0;
        this.height = height ?? 0;
    }

    duplicate() {
        return new Rect(this.position, this.width, this.height);
    }
}