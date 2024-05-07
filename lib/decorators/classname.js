/**
 * Evaluate target
 * @param component
 * @param options
 * @returns {getTarget[]}
 */
function getTarget(component, options) {
  let target = [component];
  if (options.target) {
    if (typeof options.target === 'string') {
      target = Array.from(component.querySelectorAll(options.target));
    } else if (options.target instanceof HTMLElement) {
      target = [options.target];
    } else {
      target = Array.from(options.target);
    }
  }
  return target;
}

/**
 * Component classname decorator
 * @param className
 * @param options
 */
export function className(className, options = { target: null }) {
  return () => {
    return {

      /**
       * Set classname. If `falsy` value, then classname will be removed
       * @param value
       */
      set(value) {
        let target = getTarget(this, options);
        target && target.forEach((t) => t.classList.toggle(className, !!value));
      },

      /**
       * Check, classname exists or not
       * @returns {*}
       */
      get() {
        let target = getTarget(this, options);
        return !!target.find((t) => t.classList.contains(className));
      }
    };
  }
}
