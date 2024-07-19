import {Vector2} from "./Vector2.js";
import {events} from "./Events.js";
import {colliderStore} from "./ColliderStore.js";

export class GameObject {
  constructor({
      position,
      width,
      height,
      isCollider,
      isWall
  }) {
    this.position = position ?? new Vector2(0, 0);
    this.children = [];
    this.parent = null;
    this.hasReadyBeenCalled = false;
    this.width = width ?? 0;
    this.height = height ?? 0;
    this.isCollider = isCollider ?? false;
    this.isWall = isWall ?? false;
  }

  // First entry point of the loop
  stepEntry(delta, root) {
    // Call updates on all children first
    this.children.forEach((child) => child.stepEntry(delta, root));

    // Call ready on the first frame
    if (!this.hasReadyBeenCalled) {
      this.hasReadyBeenCalled = true;
      this.ready();
    }

    // Call any implemented Step code
    this.step(delta, root);
  }

  // Called before the first `step`
  ready() {
    if (this.isCollider) colliderStore.addCollider(this);
  }

  // Called once every frame
  step(_delta) {
    // ...
  }

  /* draw entry */
  draw(ctx, x, y) {
    const drawPosX = x + this.position.x;
    const drawPosY = y + this.position.y;

    // Do the actual rendering for Images
    this.drawImage(ctx, drawPosX, drawPosY);

    // Pass on to children
    this.children.forEach((child) => child.draw(ctx, drawPosX, drawPosY));
  }

  drawImage(ctx, drawPosX, drawPosY) {
    //...
  }

  // Remove from the tree
  destroy() {
    this.children.forEach(child => {
      child.destroy();
    })
    this.parent.removeChild(this)
    colliderStore.collisions.delete(this);
  }

  /* Other Game Objects are nestable inside this one */
  addChild(gameObject) {
    gameObject.parent = this;
    this.children.push(gameObject);
  }

  removeChild(gameObject) {
    events.unsubscribe(gameObject);
    this.children = this.children.filter(g => {
      return gameObject !== g;
    })
  }

  get center() {
    if (Object.hasOwn(this, "width") && Object.hasOwn(this, "height"))
      return new Vector2(this.position.x + this.width/2, this.position.y + this.height/2);
    return undefined;
  }

  getForce() {

  }
}