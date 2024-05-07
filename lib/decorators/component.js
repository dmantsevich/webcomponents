import * as listen from './listen';
import * as className from './classname';
import * as querySelector from './queryselector';

/**
 * Decorator for Web Component
 * @param options
 * @returns {(function(*): void)|*}
 * @constructor
 */
export function Component(options = {}) {
  return (ComponentClass) => {
    if (options.tagName) {
      ComponentClass.is = options.tagName;
    }
  }
}

/**
 * Create local variables
 * @param list
 * @param rootComponent
 * @returns {*}
 */
function vars(list, rootComponent) {
  return list.map((value) => value.replaceAll(`&`, rootComponent));
}

Component.vars = vars;

Object.assign(Component, { ...listen, ...querySelector, ...className });
