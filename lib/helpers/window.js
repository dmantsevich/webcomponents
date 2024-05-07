import { throttle, debounce } from 'throttle-debounce';

export const WINDOW_ON_RESIZE_DELAY = 200;
export const WINDOW_ON_SCROLL_DELAY = 50;

export function on(event, callback, useCapture = false) {
  window.addEventListener(event, callback, useCapture);
  return () => window.removeEventListener(event, callback, useCapture);
}

export function onResize(callback, delay = WINDOW_ON_RESIZE_DELAY) {
  callback = delay ? debounce(delay, callback) : callback;
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

export function onScroll(callback, delay = WINDOW_ON_SCROLL_DELAY) {
  callback = delay ? throttle(delay, callback) : callback;
  window.addEventListener('scroll', callback);
  return () => window.removeEventListener('scroll', callback);
}
