import * as listen from './listen';
import * as className from './classname';
import * as querySelector from './queryselector';
import getConfig from '../config';

/**
 * Prepare name for component
 * @param tagName
 * @param isCX
 * @returns {*|string}
 * @private
 */
function _prepareName(tagName, isCX) {
  const { namespace, componentExtensionClassName } = getConfig();
  const prefix = `${isCX ? componentExtensionClassName : namespace}-`;
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
      ComponentClass.is = _prepareName(options.tagName, ComponentClass.WC_CX);
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
