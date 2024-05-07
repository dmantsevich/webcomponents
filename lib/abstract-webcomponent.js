import { pick } from './helpers/utility';
import { listenEvent, unlistenEvent } from './lifecycle/event-manager';
import { register } from './lifecycle/custom-elements';
import { on, trigger, triggerHandler } from './helpers/dom/events';
import getConfig from './config';

/**
 * Abstract component
 * @param Parent
 * @constructor
 */
export function AbstractWebComponent(Parent = class {
}) {
  return class extends Parent {

    /**
     * Web Component name
     * @type {string|null}
     */
    static is = `${getConfig().namespace}-abstract-component`;

    /**
     * Register custom element
     * @param tagName
     */
    static register(tagName) {
      register(tagName || this.is, this);
    }

    /**
     * Inherited events from parent component
     * @type {Array<Function>}
     */
    get onCreated() {
      if (!this.hasOwnProperty('_onCreated')) {
        this._onCreated = [].concat(this._onCreated || []);
      }
      return this._onCreated;
    }

    /**
     * Constructor for abstract components. Should be called in child constructor
     * @param el
     * @private
     */
    _create(el) {
      if (!el) {
        throw new Error(`Getter for "_el" should be defined.`);
      }

      this._el = el;
      this._listenEvents ??= []; // events, defined via @listen decorators
      this._unlistenEvents ??= []; // events, defined via @listen decorators for unsubscribe
      this._onDestroyCallbacks = []; // onDestroy callbacks
      this._constructCalled = false; // Constructor called flag. Fired once
      this.onCreated.forEach((callback) => callback.call(this));
    }

    /**
     * construct - will be called only once
     */
    construct() {
      // That code will run only once
    }

    /**
     * Init will be called every time when component is inserted to DOM
     */
    init() {
      // Define your code here
      this.listenEvents();
    }

    /**
     * onDestroy - will be called when component is destroyed
     */
    onDestroy() {
      this
        ._onDestroyCallbacks
        .forEach((onDestroy) => onDestroy());
      this.unlistenEvents();
    }

    /**
     * Subscribe to event
     * @param event
     * @param callback
     * @param delegation
     * @param useCapture
     * @returns {EventTypes.removeEventListener}
     */
    on(event, callback, delegation = null, useCapture = false) {
      return on(this._el, event, callback, delegation, useCapture);
    }

    /**
     * Unsubscribe from event
     * @param event
     * @param callback
     */
    off(event, callback) {
      this._el.removeEventListener(event, callback);
      return this;
    }

    /**
     * Trigger event
     * @param event
     * @param details
     * @returns {Event}
     */
    trigger(event, details = {}) {
      return trigger(this._el, event, details);
    }

    /**
     * Trigger event handler without bubbling
     * @param event
     * @param details
     * @returns {*}
     */
    triggerHandler(event, details = {}) {
      return triggerHandler(this._el, event, details);
    }

    /**
     * Subscribe to events, defined via @listen decorators
     */
    listenEvents() {
      this.unlistenEvents();
      this?._listenEvents.forEach((eventDeclaration) => listenEvent(this, eventDeclaration));
    }

    /**
     * Unsubscribe from events, defined via @listen decorators
     */
    unlistenEvents() {
      this?._unlistenEvents.forEach((eventDeclaration) => unlistenEvent(this, eventDeclaration));
    }

    /**
     * Check if element matches selector
     * @param selector
     * @returns {*}
     */
    is(selector) {
      return this._el.matches(selector);
    }

    /**
     * Check if element has class
     * @param className
     * @returns {boolean}
     */
    hasClass(className) {
      return this._el.classList.contains(className);
    }

    /**
     * Add class to element
     * @param className
     */
    addClass(className) {
      this._el.classList.add(className);
      return this;
    }

    /**
     * Remove class from element
     * @param className
     */
    removeClass(className) {
      this._el.classList.remove(className);
      return this;
    }

    /**
     * Toggle class
     * @param className
     * @param add
     */
    toggleClass(className, add) {
      if (typeof add === 'undefined') {
        this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
      } else {
        add ? this.addClass(className) : this.removeClass(className);
      }
      return this;
    }

    /**
     * Get or set attribute value
     * @param name
     * @param value
     */
    attr(name, value) {
      if (value === null) {
        this._el.removeAttribute(name);
        return this;
      } else if (typeof value !== 'undefined') {
        this._el.setAttribute(name, value);
        return this;
      }
      return this._el.getAttribute(name);
    }

    /**
     * Get or set data- attribute value
     * @param name
     * @param value
     */
    data(name, value) {
      if (value === null) {
        delete this._el.dataset[name];
        return this;
      } else if (typeof value !== 'undefined') {
        this._el.dataset[name] = value;
        return this;
      }
      if (typeof name === 'object') {
        return Object.assign(this._el.dataset, name);
      }
      return this._el.dataset[name];
    }


    /**
     * Find first element by selector
     * @param selector
     */
    findFirst(selector) {
      return this._el.querySelector(selector);
    }


    /**
     * Find elements by selector
     * @param selector
     * @returns {unknown[]}
     */
    find(selector) {
      return Array.from(this._el.querySelectorAll(selector));
    }

    /**
     * Find parent element by selector
     * @param selector
     * @returns {Element}
     */
    findParent(selector) {
      return this._el.parentElement.closest(selector);
    }

    /**
     * Set or get css styles
     * @param styles
     * @param value
     */
    css(styles, value) {
      switch (true) {
        case Array.isArray(styles):
          return pick(getComputedStyle(this._el), styles);
        case typeof styles === 'object':
          return Object.assign(this._el.style, styles);
        case typeof styles === 'string':
          if (typeof value !== 'undefined') {
            this._el.style[styles] = value;
          } else {
            return getComputedStyle(this._el)[styles];
          }
          break;
      }
      return this;
    }

  };
}
