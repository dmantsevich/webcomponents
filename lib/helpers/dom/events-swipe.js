import { on } from './events';
import { TOUCH_EVENTS } from '../browser';

const THRESHOLD = 30;
const RESTRAINT = 100;
const ALLOWEDTIME = 300;

export const LEFT = 'left';
export const RIGHT = 'right';
export const UP = 'up';
export const DOWN = 'down';
export const NONE = 'none';

function unify(e) {
  return e.changedTouches ? e.changedTouches[0] : e;
}

function preventDefault(e) {
  if (!TOUCH_EVENTS) {
    e.preventDefault();
  }
}

export function onSwipe(element, callback) {
  let startX = 0;
  let startY = 0;
  let time;
  let lock = (e) => {
    startX = unify(e).clientX;
    startY = unify(e).clientY;
    time = Date.now();
    preventDefault(e);
  };
  let unlock = (e) => {
    let distX = unify(e).clientX - startX;
    let distY = unify(e).clientY - startY;
    let direction = NONE;
    if (Date.now() - time <= ALLOWEDTIME) {
      if (Math.abs(distX) >= THRESHOLD && Math.abs(distY) <= RESTRAINT) {
        direction = distX < 0 ? LEFT : RIGHT;
      } else if (Math.abs(distY) >= THRESHOLD && Math.abs(distX) <= RESTRAINT) {
        direction = distY < 0 ? UP : DOWN;
      }
    }

    if (direction !== NONE) {
      let event = new Event('swipe', { bubbles: false });
      event.detail = {
        direction, startX, startY, X: distX, Y: distY
      };

      callback.call(element, event);
      preventDefault(e);
    }
  };

  let offs = [
    on(element, 'touchstart', lock),
    on(element, 'mousedown', lock),

    on(element, 'touchmove', preventDefault),
    on(element, 'mousemove', preventDefault),

    on(element, 'touchend', unlock),
    on(element, 'mouseup', unlock)
  ];

  return () => {
    offs.forEach((off) => off && off());
    offs = null;
    element = callback = null;
  };
}

function checkDirection(element, callback, direction) {
  return onSwipe(element, function (e) {
    if (e.detail.direction === direction) {
      callback.call(this, e);
    }
  });
}

export function onSwipeLeft(element, callback) {
  return checkDirection(element, callback, LEFT);
}

export function onSwipeRight(element, callback) {
  return checkDirection(element, callback, RIGHT);
}

export function onSwipeUp(element, callback) {
  return checkDirection(element, callback, UP);
}

export function onSwipeDown(element, callback) {
  return checkDirection(element, callback, DOWN);
}
