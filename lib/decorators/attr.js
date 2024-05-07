// TODO: Implement if needed
const isUndef = (value) => (value === null || typeof value === 'undefined');

export function attr(attrName, type = attr.String, config = {}) {
  return () => {

    return {

      /**
       * Set attribute
       * @param value
       */
      set(value) {
        this.attr(attrName, isUndef(value) ? null : type.stringify(value, attrName, config));
      },

      /**
       * Check, classname exists or not
       * @returns {*}
       */
      get() {
        const value = this.attr(attrName);
        return isUndef(value) ? null : type.parse(value, attrName, config);
      }
    };
  }
}

/**
 * Default String parser
 */
attr.String = {
  defaultValue: null,
  parse: (value) => {
    return window.String(value);
  },
  stringify: (value) => {
    return window.String(value);
  }
};
