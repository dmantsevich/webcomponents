import { EVENT_HOOKS } from './events-hooks';

// NOT_BUBBLED_EVENTS processed directly
const NOT_BUBBLED_EVENTS = ['load', 'loadedmetadata', 'scroll'].concat(Object.keys(EVENT_HOOKS));

/**
 * Native wrapper for event bindings & event delegation
 * @param element
 * @param event
 * @param callback
 * @param delegation
 * @param useCapture
 * @returns {function()}
 */
export function on(element, event, callback, delegation = '', useCapture = false) {
  const notBubbledEvent = NOT_BUBBLED_EVENTS.indexOf(event) !== -1;
  const fire = (e, target) => {
    e.targetEl = target;
    return callback(e);
  }
  const eventListener = delegation ?
    (e) => {
      const target = (e.target || e.currentTarget).closest(delegation);
      return target ? fire(e, target) : void 0;
    } : (e) => fire(e, element);

  if (notBubbledEvent && delegation) {
    let offs = Array.from(element.querySelectorAll(delegation))
      .map((el) => on(el, event, callback, '', useCapture));

    return () => {
      offs?.forEach((off) => off());
      offs = null;
    };
  }

  if (EVENT_HOOKS[event]) {
    return EVENT_HOOKS[event](element, callback, eventListener);
  }

  element.addEventListener(event, eventListener, useCapture);
  return () => element.removeEventListener(event, eventListener, useCapture);
}

/**
 * Subscribe on event once
 * @param element
 * @param event
 * @param callback
 * @param delegation
 * @param useCapture
 * @returns {function()}
 */
export function once(element, event, callback, delegation = '', useCapture = false) {
  const off = on(element, event, (...args) => {
    off();
    callback.call(element, ...args);
  }, delegation, useCapture);
  return off;
}

/**
 * Trigger event
 * @param element
 * @param event
 * @param detail
 * @param options
 * @returns {Event}
 */
export function trigger(element, event, detail = {}, options = {bubbles: true}) {
  if (!(event instanceof Event)) {
    event = new Event(event, options);
    event.detail = detail;
  }
  element.dispatchEvent(event);
  return event;
}

/**
 * Trigger event handler without bubbling
 * @param element
 * @param event
 * @param detail
 * @param options
 * @returns {Event}
 */
export function triggerHandler(element, event, detail = {}, options = {bubbles: false}) {
  return trigger(element, event, detail, options);
}
