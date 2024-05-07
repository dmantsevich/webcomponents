/**
 * .querySelector() decorator
 * @param selector
 * @param options
 * @returns {function(*, *, *): {get(): *}}
 */
export function element(selector, options = {}) {
  return (Component, property) => {
    const propDescriptor = Object.getOwnPropertyDescriptor(Component, property);
    const setter = propDescriptor?.set || (() => {});
    return {
      /**
       * Get first element
       * @returns {*}
       */
      get() {
        try {
          if (options.context) {
            return options.context.querySelector(selector);
          }
          return this.findFirst(selector);
        } catch (e) {
          return null;
        }
      },

      /**
       * Define custom setter
       * @param value
       */
      set(value) {
        setter.call(this, value);
      }
    };
  };
}


/**
 * .querySelectorAll() decorator
 * @param selector
 * @param options
 */
export function elements(selector, options = {}) {
  return (Component, property) => {
    const propDescriptor = Object.getOwnPropertyDescriptor(Component, property);
    const setter = propDescriptor?.set || (() => {});
    return {

      /**
       * Get elements
       * @returns {*}
       */
      get() {
        try {
          if (options.context) {
            return options.context.querySelectorAll(selector);
          }
          return this.find(selector);
        } catch (e) {
          return null;
        }
      },

      /**
       * Define custom setter
       * @param value
       */
      set(value) {
        setter.call(this, value);
      }

    };
  };
}

/**
 * Get parent element by selector
 * @param selector
 */
export function parent(selector) {
  return () => {
    return {

      /**
       * No setter
       */
      set() {},

      /**
       * Check, classname exists or not
       * @returns {*}
       */
      get() {
        return !selector ? this._el.parentElement : this.findParent(selector);
      }
    };
  }
}
