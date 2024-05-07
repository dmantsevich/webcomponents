import * as listen from './listen';
import * as className from './classname';
import * as querySelector from './queryselector';
import getConfig from '../config';

function _prepareName(tagName) {
  const { namespace } = getConfig();
  const prefix = `${namespace}-`;
  return tagName.indexOf(prefix) === 0 ? tagName : `${prefix}${tagName}`;
}

/**
 * Decorator for Web Component
 * @param options
 * @returns {(function(*): void)|*}
 * @constructor
 */
export function Component(options = {}) {
  return (ComponentClass) => {
    // Define "wc-" prefix for component
    if (options.tagName) {
      ComponentClass.is = _prepareName(options.tagName);
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
  const replacement = _prepareName(rootComponent);
  return list.map((value) => value.replaceAll(`&`, replacement));
}

Component.vars = vars;

Object.assign(Component, { ...listen, ...querySelector, ...className });
