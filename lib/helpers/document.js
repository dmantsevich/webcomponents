import { once, on as onEvent } from './dom/events';
import { noop } from './utility';

/**
 * Subscribe to document ready event
 * @param callback
 * @returns {noop}
 */
export function onReady(callback) {
  let off = noop;
  if (document.readyState === 'complete') {
    setTimeout(callback);
  } else {
    off = once(document, 'DOMContentLoaded', callback);
  }
  return off;
}

/**
 * Subscribe to document event
 * @param event
 * @param callback
 * @param delegation
 * @param useCapture
 * @returns {noop|(function())}
 */
export function on(event, callback, delegation, useCapture) {
  if (['DOMContentLoaded', 'ready'].indexOf(event) !== -1) {
    return onReady(callback);
  }
  return onEvent(document, event, callback, delegation, useCapture);
}
