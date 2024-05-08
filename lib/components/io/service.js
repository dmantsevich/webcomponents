import { OFFSET, STATES } from './const';

const waitingList = {};

/**
 * Create waiter
 * @returns {{cleanups: *[], callbacks: *[], state: string}}
 */
const createWaiter = () => {
  return {
    state: STATES.WAITING,
    callbacks: [], // callbacks to fire
    cleanups: [] // cleanup for all waiters for that key
  };
}

/**
 * Check if key is fired
 * @param key
 * @returns {boolean}
 */
const isFired = (key) => {
  const waiter = waitingList[key];
  if (!waiter) return false;
  return waiter.state === STATES.FIRED;
};


/**
 * WCIO Service. Used to watch elements and fire callbacks
 */
export const WCIOService = {

  /**
   * Fire callbacks
   * @param key
   * @private
   */
  _fire(key) {
    const { callbacks, cleanups } = waitingList[key];
    callbacks.forEach(callback => callback()); // Fire all callbacks
    cleanups.forEach((cleanup) => cleanup()); // Cleanup
    callbacks.length = 0;
    cleanups.length = 0;
    waitingList[key] = createWaiter(); // Reset waiter
    waitingList[key].state = STATES.FIRED; // New callbacks will be fired immediately
  },

  /**
   * Watch element and fire callbacks
   * @param target
   * @param key
   * @returns {Promise<void>|Promise<unknown>}
   */
  watch(target, key) {
    return isFired(key) ? Promise.resolve() : new Promise((resolve) => {
      waitingList[key] = waitingList[key] || createWaiter();
      let io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) { return ; }
          WCIOService._fire(key);
        });
      }, { rootMargin: OFFSET });
      waitingList[key].cleanups.push(() => {
        io.disconnect();
        target = key = io = null; // Cleanup links
        resolve();
      }); // Add cleanup
      io.observe(target); // Observe target
    });
  },

  /**
   * Register callback
   * @param key
   * @param callback
   */
  registerCallback(key, callback) {
    if (isFired(key)) {
      callback(); // Fire immediately
      return ;
    }
    waitingList[key] = waitingList[key] || createWaiter(); // Create waiter if not exists
    waitingList[key].callbacks.push(callback); // Add callback to list
  }

};
