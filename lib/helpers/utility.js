/**
 * Pick the keys from the object
 * @param object
 * @param keys
 * @returns {*}
 */
export function pick(object, keys = []) {
  return keys.reduce((result, key) => {
    (key in object) && (result[key] = object[key]);
    return result;
  }, {});
}

/**
 * Nooperation function
 */
export function noop() {}
