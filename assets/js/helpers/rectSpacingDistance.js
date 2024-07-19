export function rectSpacingDistance(rect1, rect2) {
    // const   rect1position = rect1.position,
    //         rect1width = rect1.width,
    //         rect1height = rect1.height,
    //         rect2position = rect2.position,
    //         rect2width = rect2.width,
    //         rect2height = rect2.height;
    // return Math.max(Math.abs(rect1position.x-rect2position.x) - (rect1width+rect2width)/2,
    //     Math.abs(rect1position.y-rect2position.y) - (rect1height+rect2height)/2);
    return Math.max(Math.abs(rect1.center.x - rect2.center.x) - (rect1.width+rect2.width)/2,
        Math.abs(rect1.center.y - rect2.center.y) - (rect1.height+rect2.height)/2)
}