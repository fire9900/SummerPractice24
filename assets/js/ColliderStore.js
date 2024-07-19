import {events} from "./Events.js";
import {rectCollide} from "./helpers/rectCollide.js";
import {Vector2} from "./Vector2.js";
import {rectSpacingDistance} from "./helpers/rectSpacingDistance.js";
// import {Hero} from "./objects/Hero.js";

const SAPquickSort = (arr) => {
    if (arr.length <= 1) {
        return arr;
    }

    let pivot = arr[0];
    let leftArr = [];
    let rightArr = [];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i][0] < pivot[0]) {
            leftArr.push(arr[i]);
        } else {
            rightArr.push(arr[i]);
        }
    }

    return [...SAPquickSort(leftArr), pivot, ...SAPquickSort(rightArr)];
};

class ColliderStore {
    constructor() {
        this.position = new Vector2(0, 0);
        this.collisions = new Map();
        this.walls = new Set();
        this.children = [];
        this.sortedSAPColliders = [];
        this.parent = undefined;
        this.hasReadyBeenCalled = false;
        this.layer = -99;
    }

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

    ready() {
        //...
    }

    step(delta) {
        for (let key of this.collisions.keys()) {
            this.collisions.set(key, new Set());
        }

        const SAPColliders = Array.from(this.collisions, ([gameObject, setObjects]) => [gameObject.position.x, gameObject]);
        const sortedSAPColliders = SAPquickSort(SAPColliders);
        this.sortedSAPColliders = sortedSAPColliders;
        for (let i=0; i<sortedSAPColliders.length; i++) {
            for (let j=i+1; j<sortedSAPColliders.length && sortedSAPColliders[i][0]+sortedSAPColliders[i][1].width > sortedSAPColliders[j][0]; j++) {
                const obj1 = sortedSAPColliders[i][1];
                const obj2 = sortedSAPColliders[j][1];
                if (rectCollide(obj1, obj2)) {
                    this.collisions.set(obj1, this.collisions.get(obj1).add(obj2));
                    this.collisions.set(obj2, this.collisions.get(obj2).add(obj1));
                    if (!obj1.isWall || !obj2.isWall)
                    if (obj1.isWall && !obj2.isWall) {
                        obj2.position = obj2.prevPosition;
                    }
                    if (obj2.isWall && !obj1.isWall) {
                        obj1.position = obj1.prevPosition;
                    }
                }
            }
        }

        for (let wall of this.walls) {
            for (let obj of this.collisions.get(wall)) {
                if (obj.isWall) continue;
                const dx = Math.abs(wall.center.x - obj.center.x) - (wall.width+obj.width)/2;
                const dy = Math.abs(wall.center.y - obj.center.y) - (wall.height+obj.height)/2;
                if (dx > dy) {
                    if (obj.position.x > wall.position.x) obj.position.x += Math.abs(dx) * 1.5;
                    else obj.position.x -= Math.abs(dx) * 1.5;
                } else {
                    if (obj.position.y > wall.position.y) obj.position.y += Math.abs(dy) * 1.5;
                    else obj.position.y -= Math.abs(dy) * 1.5;
                }
                // console.log(dx, dy, obj);
                if (obj.hasOwnProperty("tryEmitPosition")) obj.tryEmitPosition();
            }
        }

        events.emit("COLLISIONS_UPDATE");
        // console.log(this.collisions);
    }

    addCollider(gameObject) {
        this.collisions.set(gameObject, new Set());
        if (gameObject.isWall) this.walls.add(gameObject);
    }

    draw() {

    }
}

export const colliderStore = new ColliderStore();