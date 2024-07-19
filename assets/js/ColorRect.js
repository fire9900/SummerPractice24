import {GameObject} from "./GameObject.js";

export class ColorRect extends GameObject {
    constructor({position, width, height, color}) {
        super({
            position: position,
            width: width,
            height: height
        });
        this.color = color ?? "black";
    }

    drawImage(ctx, x, y) {
        ctx.beginPath();
        ctx.rect(Math.floor(x), Math.floor(y), this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}