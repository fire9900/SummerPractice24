const makeStandingFrames = (rootFrame = 0) => {
    return {
        duration: 2000,
        frames: [
            {
                time: 0,
                frame: rootFrame,
            },
            {
                time: 875,
                frame: rootFrame+1,
            },
            {
                time: 1750,
                frame: rootFrame+2,
            },
        ]
    }
}

const makeWalkingFrames = (rootFrame = 0, duration = 1000) => {
    let frames = {
        duration: duration,
        frames: []
    };
    for (let n = 0; n < 6; n++) {
        frames.frames.push({
            time: (frames.duration / 6) * n,
            frame: rootFrame + n
        })
    }
    return frames;
}

const makeAttackingFrames = (rootFrame = 0, duration = 1000) => {
    return {
        duration: duration,
        frames: [
            {
                time: 0,
                frame: rootFrame === 39 ? 3 : 6,
            },
            {
                time: duration * 0.33,
                frame: rootFrame,
            },
            {
                time: duration * 0.33 + duration * 0.33 * 0.33,
                frame: rootFrame+1,
            },
            {
                time: duration * 0.33 + duration * 0.33 * 0.66,
                frame: rootFrame+2,
            },
            {
                time: duration * 0.66,
                frame: rootFrame === 39 ? 3 : 6,
            },
        ]
    }
}

export const STAND_RIGHT = makeStandingFrames(3);
export const STAND_LEFT = makeStandingFrames(6);
export const WALK_RIGHT = makeWalkingFrames(18, 600);
export const WALK_LEFT = makeWalkingFrames(24, 600);
export const ATTACK_RIGHT = makeAttackingFrames(39, 1000);
export const ATTACK_LEFT = makeAttackingFrames(42, 1000);