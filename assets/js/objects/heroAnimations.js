const makeFrames = (rootFrame = 0, duration = 1000) => {
  let frames = {
    duration: duration,
    frames: []
  };
  for (let n=0; n<10; n++) {
    frames.frames.push({
      time: (frames.duration / 10) * n,
      frame: rootFrame+n
    })
  }
  return frames;
}

const makeAttackFrames = (rootFrame = 0, duration = 1000) => {
  let frames = {
    duration: duration,
    frames: []
  };
  for (let n=0; n<6; n++) {
    frames.frames.push({
      time: (frames.duration / 6) * n,
      frame: rootFrame+n
    })
  }
  return frames;
}

export const STAND_RIGHT = makeFrames(0, 2000);
export const STAND_LEFT = makeFrames(20, 2000);
export const WALK_RIGHT = makeFrames(10, 600);
export const WALK_LEFT = makeFrames(30, 600);
export const ATTACK_RIGHT = makeAttackFrames(50, 800);
export const ATTACK_LEFT = makeAttackFrames(60, 800);
export const HIT_RIGHT = {duration: 200, frames: [{time: 0, frame: 40}]};
export const HIT_LEFT = {duration: 200, frames: [{time: 0, frame: 41}]};
export const DEATH_RIGHT = makeFrames(70, 800);
export const DEATH_LEFT = makeFrames(80, 800);

