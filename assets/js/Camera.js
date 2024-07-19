import {GameObject} from "./GameObject.js";
import {events} from "./Events.js";
import {Vector2} from "./Vector2.js";

export class Camera extends GameObject {
  constructor(GroundMap, hero) {
    super({});

    this.groundMap = GroundMap;
    this.hero = hero;

    events.on("HERO_POSITION", this, heroPosition => {

      // Create a new position based on the hero's position
      const personHalfWidth = this.hero.width / 2;
      const personHalfHeight = this.hero.height / 2;
      const canvasWidth = 480;
      const canvasHeight = 256;
      const halfWidth = -personHalfWidth + canvasWidth / 2;
      const halfHeight = -personHalfHeight + canvasHeight / 2;
      this.position = new Vector2(
          -heroPosition.x + halfWidth,
          -heroPosition.y + halfHeight,
      );

      if (personHalfWidth + heroPosition.x + halfWidth - canvasWidth / 2 < 0) this.position.x = canvasWidth / 2;
      if (personHalfWidth*2 + heroPosition.x + halfWidth > this.groundMap.position.x + this.groundMap.width) this.position.x = this.groundMap.position.x;
      if (heroPosition.y - halfHeight < this.groundMap.position.y) this.position.y = canvasHeight / 2;
      if (personHalfHeight*2 + heroPosition.y + halfHeight > this.groundMap.position.y + this.groundMap.height) this.position.y = this.groundMap.position.y;
    })

  }
}